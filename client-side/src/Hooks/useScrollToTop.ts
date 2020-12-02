import { RefObject, useEffect } from "react";

export default function useScrollToTop(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    function onScroll(ev: any) {
      if (el) {
        if (window.pageYOffset > 150) {
          el.classList.remove("scroll-to-top__hide");
        } else {
          el.classList.add("scroll-to-top__hide");
        }
      }
    }
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (el) {
      window.addEventListener("scroll", onScroll);
      el.addEventListener("click", scrollToTop);
    }
    return () => {
      if (el) {
        window.removeEventListener("scroll", onScroll);
        el.addEventListener("click", scrollToTop);
      }
    };
  }, [ref]);
}
