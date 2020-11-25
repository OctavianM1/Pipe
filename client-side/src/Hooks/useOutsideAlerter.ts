import { RefObject, useEffect } from "react";

function useOutsideAlerter(
  ref: RefObject<HTMLElement>,
  popUp: boolean,
  fn?: () => void,
  className?: string | null
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        (!className || !target.classList.contains(className))
      ) {
        fn && fn();
      }
    }
    if (popUp) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, className, fn, popUp]);
}

export default useOutsideAlerter;
