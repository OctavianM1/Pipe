import { Dispatch, SetStateAction, useEffect } from "react";

export default function useDisplayComponent(
  elementRef: React.RefObject<HTMLElement>,
  displayComponent: boolean,
  setDisplayComponent: Dispatch<SetStateAction<boolean>>,
  direction?: string
) {
  useEffect(() => {
    function onScroll(ev: any) {
      if (elementRef.current) {
        const clientRect = elementRef.current.getBoundingClientRect();
        let up: number;
        if (direction === "bottom->top") {
          up = clientRect.top - window.innerHeight + clientRect.height - 500;
        } else if (direction === "small->normal") {
          up =
            clientRect.top -
            window.innerHeight
        } else {
          up = clientRect.top - window.innerHeight + clientRect.height;
        }
        
        if (up < 0 && !displayComponent) {
          setDisplayComponent(true);
        }
      }
    }
    if (!displayComponent) {
      window.addEventListener("scroll", onScroll);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [displayComponent, direction, elementRef, setDisplayComponent]);
}
