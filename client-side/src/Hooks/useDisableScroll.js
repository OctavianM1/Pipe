import { useEffect } from "react";

const wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

const wheelOpt = { passive: false };

export default function useDisableScroll(options = [false]) {
  function preventDefault(e) {
    if (e.key !== "ArrowDown" && e.key !== undefined) {
      return;
    }
    e.preventDefault();
  }
  useEffect(() => {
    let apply = true;
    options.forEach((el) => {
      if (!el) {
        apply = false;
      }
    });

    if (apply) {
      document.body.classList.add("hide-scrollbar");
      window.addEventListener(wheelEvent, preventDefault, wheelOpt);
      window.addEventListener("keydown", preventDefault, wheelOpt);
      window.addEventListener("touchmove", preventDefault, wheelOpt);
    }
    return () => {
      document.body.classList.remove("hide-scrollbar");
      window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
      window.removeEventListener("keydown", preventDefault, wheelOpt);
      window.removeEventListener("touchmove", preventDefault, wheelOpt);
    };
  }, [options]);
}
