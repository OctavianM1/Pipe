import { useEffect } from "react";

export default function useGridOnResize(grid, setGrid) {
  useEffect(() => {
    function onResize() {
      const width = window.innerWidth;
      if (grid === 4 && width < 1001) {
        setGrid(3);
      }
      if (grid !== 2 && width < 701) {
        setGrid(2);
      }
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [grid, setGrid]);
}
