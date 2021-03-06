import React, { useEffect, useState } from "react";
import Star from "../Svgs/Star";

import "./starRaiting.scss";

const StarsRaiting = ({
  initialState,
  handleStarClick,
}: {
  initialState: number;
  handleStarClick: (rate: number) => void;
}) => {
  const [yellowStarsPersonal, setYellowStarsPersonal] = useState(initialState);

  useEffect(() => {
    setYellowStarsPersonal(initialState);
  }, [initialState]);

  let personalStars = [];
  for (let i = 1; i <= 5; i++) {
    personalStars.push(
      <Star
        key={i}
        color={yellowStarsPersonal >= i ? "#fff220" : "black"}
        onMouseEnter={() => setYellowStarsPersonal(i)}
        onMouseLeave={() => setYellowStarsPersonal(initialState)}
        onClick={() => handleStarClick(i)}
      />
    );
  }
  return <>{personalStars}</>;
};

export default React.memo(StarsRaiting);