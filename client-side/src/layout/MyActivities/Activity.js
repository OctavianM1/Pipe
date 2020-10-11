import React, { useRef, useState } from "react";
import Star from "../../components/Svgs/Star";

import "./myactivities.scss";

const Activity = ({title, subject, body, date}) => {
  const commentInput = useRef(null);
  const [yellowStarsPersonal, setYellowStarsPersonal] = useState(0);
  let personalStars = [];
  for (let i = 1; i <= 5; i++) {
    personalStars.push(
      <Star
        key={i}
        color={yellowStarsPersonal >= i ? "yellow" : "black"}
        onMouseEnter={() => setYellowStarsPersonal(i)}
        onClick={() => console.log(`selected ${i} personalStars`)}
      />
    );
  }

  let totalStars = [];
  for (let i = 1; i <= 5; i++) {
    totalStars.push(<Star key={i} color={3 >= i ? "yellow" : "black"} />);
  }
  return (
    <div className="my-activities__activities-side__activity">
      <div className="my-activities__activities-side__activity__total-raiting">
        <h3>Total raiting:</h3>
        {totalStars}
      </div>
      <div className="my-activities__activities-side__activity__personal-raiting">
        <h3>Your raiting:</h3>
        {personalStars}
      </div>
      <div className="my-activities__activities-side__activity__title">
        {title}
      </div>
      <div className="my-activities__activities-side__activity__subject">
        {subject}
      </div>
      <div className="my-activities__activities-side__activity__body">
        {body}
      </div>
      <div className="my-activities__activities-side__activity__date">
        {date}
      </div>
      <div className="my-activities__activities-side__activity__buttons">
        <button>
          <img src="/images/activities/like.svg" alt="like" />
          Like<span>&nbsp;</span>
        </button>
        <button onClick={() => commentInput.current.focus()}>
          <img src="/images/activities/comment.svg" alt="comment" />
          Comment<span>&nbsp;</span>
        </button>
      </div>
      <div className="my-activities__activities-side__activity__comments">
        <div className="my-activities__activities-side__activity__comments__comment">
          <img src="/images/activities/anonym.jpg" alt="anonym user" />
          <div>
            <div className="my-activities__activities-side__activity__comments__comment__name">
              Octavian
            </div>
            <div className="my-activities__activities-side__activity__comments__comment__body">
              Foarte frumos Foarte frumos Foarte frumos Foarte frumos Foarte
              frumos
            </div>
            <button>Like</button>
            <div className="comment-likes">
              <img src="/images/activities/like.svg" alt="like" />
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="my-activities__activities-side__activity__add-comment">
          <img src="/images/activities/anonym.jpg" alt="anonym user" />
          <input
            ref={commentInput}
            type="text"
            placeholder="Write a comment..."
          />
        </div>
      </div>
    </div>
  );
};

export default Activity;
