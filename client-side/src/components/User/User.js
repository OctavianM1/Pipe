import React from "react";
import { Link } from "react-router-dom";
import "./user.scss";

const User = ({ id, name, following, followers, grid }) => {
  return (
    <Link
      to={`/activities/${id}`}
      className={`user grid-${grid}x${grid}`}
    >
      <img src="/images/activities/anonym.jpg" alt="anonym" />
      <div>
        <div>Name: {name}</div>
        <div>Following: {following}</div>
        <div>Follows: {followers}</div>
      </div>
    </Link>
  );
};

export default User;
