import { useEffect } from "react";

function useOutsideAlerter(ref, setPopUp, className, fn) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        (!className || !event.target.classList.contains(className))
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