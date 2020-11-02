import { useContext } from "react";
import { Context } from "../context";

export default function useScrollUpAndOpenLogin() {
  const { isOpenLoginModal } = useContext(Context);
  return () => {
    const scrollY = window.scrollY; 
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
    if (scrollY < 100) {
      isOpenLoginModal(true);
    } else if (scrollY < 200) {
      setTimeout(() => {
        isOpenLoginModal(true);
      }, 100);
    } else if (scrollY < 350) {
      setTimeout(() => {
        isOpenLoginModal(true);
      }, 200);
    } else {
      setTimeout(() => {
        isOpenLoginModal(true);
      }, 270);
    }
  };
}
