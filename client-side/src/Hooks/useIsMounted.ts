import { useEffect, useRef } from "react";

export default function useIsMounted() {
  const isMountedRef = useRef<boolean | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  });

  return isMountedRef;
}
