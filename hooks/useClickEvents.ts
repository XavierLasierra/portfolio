import React, { RefObject, useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
}

const useClickEvents = (ref: RefObject<any>) => {
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [endPosition, setEndPosition] = useState<Position | null>(null);

  useEffect(() => {
    const handleClickStart = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target)) {
        const position: Position = {
          x: event.clientX,
          y: event.clientY,
        };
        setStartPosition(position);
        setEndPosition(null);
      }
    };

    const handleClickEnd = (event: MouseEvent) => {
      setEndPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    document.addEventListener("mousedown", handleClickStart);
    document.addEventListener("mouseup", handleClickEnd);

    return () => {
      document.removeEventListener("mousedown", handleClickStart);
      document.addEventListener("mouseup", handleClickEnd);
    };
  }, [ref]);

  return {
    isDragging: startPosition !== null && endPosition === null,
    startPosition,
    endPosition,
  };
};

export { useClickEvents };
