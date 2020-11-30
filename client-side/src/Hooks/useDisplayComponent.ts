import { useEffect, useState } from "react";

export default function useDisplayComponent(
  elementRef: React.RefObject<HTMLElement>,
  direction?: string
) {
  const [displayed, setDisplayed] = useState(false);

  
  useEffect(() => {
    function onScroll() {
      if (elementRef.current) {
        const clientRect = elementRef.current.getBoundingClientRect();
        let up: number;
        if (direction === "bottom->top") {
          up = clientRect.top - window.innerHeight + clientRect.height - 500;
        } else if (direction === "small->normal") {
          up = clientRect.top - window.innerHeight;
        } else {
          up = clientRect.top - window.innerHeight + clientRect.height;
        }

        if (up < 0 && !displayed) {
          setDisplayed(true);
        }
      }
    }
    if (!displayed) {
      window.addEventListener("scroll", onScroll);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [displayed, direction, elementRef]);

  return displayed;
}
