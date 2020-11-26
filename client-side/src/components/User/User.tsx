import React from "react";
import "./user.scss";
import { Link } from "react-router-dom";
import useCoverImage from "../../Hooks/useCoverImage";
import useProfileCoverPhotoError from "../../Hooks/useProfileCoverPhotoError";

interface UserProps {
  id: string;
  name: string;
  following: number;
  followers: number;
  grid: number;
  activities: number;
  extension: string | null;
}

const User = ({
  id,
  name,
  following,
  followers,
  grid,
  activities,
  extension,
}: UserProps) => {
  const [coverPhotoSrc, setCoverPhotoSrc] = useCoverImage(id, extension);

  const onImgError = useProfileCoverPhotoError(setCoverPhotoSrc);

  return (
    <Link to={`/activities/${id}`} className={`user grid-${grid}x${grid}`}>
      <img src={coverPhotoSrc} onError={onImgError} alt="cover" />
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
