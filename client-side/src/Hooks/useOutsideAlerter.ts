import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

function useOutsideAlerter(
  ref: RefObject<HTMLElement>,
  setPopUp: Dispatch<SetStateAction<boolean>>,
  className?: string | null,
  fn?: () => void
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
        setPopUp(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setPopUp, className, fn]);
}

export default useOutsideAlerter;
