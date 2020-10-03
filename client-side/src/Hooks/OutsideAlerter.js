import { useEffect } from "react";

function useOutsideAlerter(ref, setPopUp) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !event.target.classList.contains("menu-mobile-btn")
      ) {
        setPopUp(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setPopUp]);
}

export default useOutsideAlerter;
