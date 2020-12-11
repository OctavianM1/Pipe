import React, { useEffect, useRef, useState } from "react";
import "./activitiesFacade.scss";

const ActivitiesFacade = () => {
  const [upImagePx, setUpImagePx] = useState(0);
  const [displaySection, setDisplaySection] = useState(false);

  const facadeRef = useRef<HTMLDivElement>(null);
  const firstImageRef = useRef<HTMLImageElement>(null);
  const secondImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    function handleScroll() {
      if (facadeRef.current && secondImageRef.current) {
        const clientRect = facadeRef.current.getBoundingClientRect();
        const up = clientRect.top - window.innerHeight + 350;
        const secondImageBottom = secondImageRef.current?.getBoundingClientRect()
          .bottom;

        if (up - 300 < 0 && !displaySection) {
          setDisplaySection(true);
        }

        if (
          up < 0 &&
          (secondImageBottom > clientRect.bottom || up / 3 > upImagePx)
        ) {
          setUpImagePx(up / 3);
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [upImagePx, displaySection]);

  return (
    <div className="activities-facade">
      <div
        ref={facadeRef}
        className={`activities-facade__facade ${
          displaySection ? "" : "activities-facade__facade__hidden"
        }`}
      >
        <img
          ref={firstImageRef}
          style={{ transform: `translateY(${upImagePx}px)` }}
          src="/images/home/activities_1.jpg"
          alt="Activities facade 1"
          loading='lazy'
        />
        <img
          ref={secondImageRef}
          style={{ transform: `translateY(${upImagePx}px)` }}
          src="/images/home/activities_2.jpg"
          alt="Activities facade 2"
          loading='lazy'
        />
      </div>
      <div
        className={`activities-facade__text ${
          displaySection ? "" : "activities-facade__text__hidden"
        }`}
      >
        <h1>Publish your passions</h1>
        <h2>Create a unique and beautiful blog. It’s easy and free.</h2>
        <p>
          {" "}
          <span style={{ paddingLeft: "30px" }}>&nbsp;</span>
          Create a beautiful blog that fits your style. Choose from a selection
          of easy-to-use templates – all with flexible layouts – or design
          something new. Give your blog the perfect home. Post your activities
          and get the latest news on following users activities.
        </p>
      </div>
    </div>
  );
};

export default ActivitiesFacade;
