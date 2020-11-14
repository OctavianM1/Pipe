import { useEffect } from "react";

function useOutsideAlerter(
  ref: React.RefObject<HTMLElement>,
  setPopUp: React.Dispatch<React.SetStateAction<boolean>>,
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
