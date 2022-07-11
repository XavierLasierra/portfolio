import { RefObject, useCallback, useEffect, useState } from "react";
import { Point } from "../models/distance";

interface ClickState {
  endPosition?: Point;
  valid?: boolean;
  clickedMousePosition?: Point;
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
              endPosition: { x, y },
            }
          : { valid: false }
      );
    };

    const handleMousePosition = ({ clientX: x, clientY: y }: MouseEvent) => {
      setEndClickState((prevState) =>
        prevState?.valid
          ? {
              ...prevState,
              clickedMousePosition: { x, y },
            }
          : prevState
      );
    };

    document.addEventListener("mousedown", handleClickStart);
    document.addEventListener("mouseup", handleClickEnd);
    document.addEventListener("mousemove", handleMousePosition);

    return () => {
      document.removeEventListener("mousedown", handleClickStart);
      document.addEventListener("mouseup", handleClickEnd);
      document.removeEventListener("mousemove", handleMousePosition);
    };
  }, [ref]);

  const resetState = useCallback(() => {
    setEndClickState(null);
  }, []);

  return {
    endPosition: endClickState?.endPosition,
    clickedMousePosition: endClickState?.clickedMousePosition,
    resetState,
  };
};

export { useEndClickEventPosition };
