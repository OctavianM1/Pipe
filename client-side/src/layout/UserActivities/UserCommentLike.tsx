import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ServerUser } from "../../api/serverDataInterfaces";
import useProfileCoverPhotoError from "../../Hooks/useProfileCoverPhotoError";

const UserCommentLike = ({ user }: { user: ServerUser }) => {
  const [coverPhotoSrc, setCoverPhotoSrc] = useState(
    user.coverImageExtension
      ? `/images/userPhotos/${user.id}.${user.coverImageExtension}`
      : "/images/userPhotos/anonym.jpg"
  );

  const profileCoverImg = useProfileCoverPhotoError(setCoverPhotoSrc);

  return (
    <Link className="user-liker" to={`/activities/${user.id}`} key={user.id}>
      <div className="user-liker__container">
        <img
          className="user-liker__container__image"
          onError={profileCoverImg}
          src={coverPhotoSrc}
          alt="User Cover"
        />
        <span className="user-liker__container__name">{user.name}:</span>
        <img
          className="user-liker__container__like"
          src="/images/activities/blueLike.svg"
          alt="blue like"
        />
      </div>
    </Link>
  );
};

export default UserCommentLike;
