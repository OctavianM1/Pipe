import React from "react";
import { Link } from "react-router-dom";
import { ServerActivityUserRaiting } from "../../../api/serverDataInterfaces";
import Star from "../../../components/Svgs/Star";
import useCoverImage from "../../../Hooks/useCoverImage";
import useProfileCoverPhotoError from "../../../Hooks/useProfileCoverPhotoError";

const UserRaiting = ({ user }: { user: ServerActivityUserRaiting }) => {
  const [coverPhotoSrc, setCoverPhotoSrc] = useCoverImage(
    user.id,
    user.coverImageExtension
  );

  const profileCoverImg = useProfileCoverPhotoError(setCoverPhotoSrc);

  return (
    <Link
      className="my-activities__activities-side__activity__total-raiting__users__user"
      to={`/activities/${user.id}`}
      key={user.id}
    >
      <img
        className="user-liker__container__image"
        onError={profileCoverImg}
        src={coverPhotoSrc}
        alt="User Cover"
      />
      <h3>
        {user.name}: <span>{user.rate}</span>
      </h3>
      <Star color="yellow" />
    </Link>
  );
};

export default React.memo(UserRaiting);
