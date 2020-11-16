import React from "react";
import "./user.scss";
import { Link } from "react-router-dom";

interface UserProps {
  id: string;
  name: string;
  following: number;
  followers: number;
  grid: number;
  activities: number;
}

const User = ({
  id,
  name,
  following,
  followers,
  grid,
  activities,
}: UserProps) => {
  return (
    <Link to={`/activities/${id}`} className={`user grid-${grid}x${grid}`}>
      <img src="/images/userPhotos/anonym.jpg" alt="anonym" />
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
