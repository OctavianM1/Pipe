import React from "react";
import { Link } from "react-router-dom";
import "./user.scss";

const User = ({ id, name, following, followers, grid, activities }) => {
  return (
    <Link to={`/activities/${id}`} className={`user grid-${grid}x${grid}`}>
      <img src="/images/activities/anonym.jpg" alt="anonym" />
      <div>
        <div>
          Name: <span>{name}</span>
        </div>
        <div>
          Following: <span>{following}</span>
        </div>
        <div>
          Followers: <span>{followers}</span>
        </div>
        <div>
          Activities: <span>{activities}</span>
        </div>
      </div>
    </Link>
  );
};

export default User;
