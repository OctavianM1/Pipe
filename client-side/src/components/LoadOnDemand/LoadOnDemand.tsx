import React, { useEffect } from "react";

export default function LoadOnDemand({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldRender, setShouldRender] = React.useState(false);
  const elRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShouldRender(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0, rootMargin: "150px" }
    );
    if (elRef.current) {
      observer.observe(elRef.current);
    }
  }, []);

  return shouldRender ? (
    <React.Suspense fallback={<div />}>{children}</React.Suspense>
  ) : (
    <div style={{ height: "200px" }} ref={elRef} />
  );
}
