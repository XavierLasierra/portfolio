import { RefObject, useCallback, useEffect, useState } from "react";
import { Point } from "../models/distance";

interface ClickState {
  position?: Point;
  valid?: boolean;
}

const useEndClickEventPosition = (ref: RefObject<any>) => {
  const [endClickState, setEndClickState] = useState<ClickState | null>(null);

  useEffect(() => {
    const handleClickStart = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target)) {
        setEndClickState((prevState) => ({
          ...prevState,
          valid: true,
        }));
      }
    };

    const handleClickEnd = ({ clientX: x, clientY: y }: MouseEvent) => {
      setEndClickState((prevState) =>
        prevState?.valid
          ? {
              valid: true,
              position: { x, y },
            }
          : { valid: false }
      );
    };

    document.addEventListener("mousedown", handleClickStart);
    document.addEventListener("mouseup", handleClickEnd);

    return () => {
      document.removeEventListener("mousedown", handleClickStart);
      document.addEventListener("mouseup", handleClickEnd);
    };
  }, [ref]);

  const resetState = useCallback(() => {
    setEndClickState(null);
  }, []);

  return {
    endPosition: endClickState?.position,
    resetState,
  };
};

export { useEndClickEventPosition };
