import { useEffect } from "react";

function useOutsideAlerter(ref, setPopUp, className) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        (!className || !event.target.classList.contains(className))
      ) {
        setPopUp(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setPopUp, className]);
}

export default useOutsideAlerter;