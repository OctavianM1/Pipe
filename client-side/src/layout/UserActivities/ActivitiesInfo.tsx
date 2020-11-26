import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CSSTransition } from "react-transition-group";
import { Follows } from "../../api/axios";
import { ServerUsersRelationActivity } from "../../api/serverDataInterfaces";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import useCoverImage from "../../Hooks/useCoverImage";
import useProfileCoverPhotoError from "../../Hooks/useProfileCoverPhotoError";

const ActivitiesInfo = ({
  userData,
  setUserData,
  errorHandler,
}: {
  userData: ServerUsersRelationActivity;
  setUserData: Dispatch<SetStateAction<ServerUsersRelationActivity>>;
  errorHandler: (error: any, cb?: Function | undefined) => void;
}) => {
  const [coverPhotoSrc, setCoverPhotoSrc] = useCoverImage(
    userData.userHostId,
    userData.coverImageExtension
  );

  const [topInfoTransform, setTopInfoTransform] = useState(false);

  const profileCoverImgError = useProfileCoverPhotoError(setCoverPhotoSrc);

  const activitiesInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (activitiesInfoRef.current) {
        const top = activitiesInfoRef.current.getBoundingClientRect().top;
        if (top === 0) {
          setTopInfoTransform(true);
        } else {
          setTopInfoTransform(false);
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleFollowClick = () => {
    if (userData?.isVisitorFollowingHost) {
      Follows.unfollow({
        userId: userData.userHostId,
        followUserId: userData.userVisitorId,
      })
        .then(() =>
          setUserData({
            ...userData,
            isVisitorFollowingHost: false,
            countFollows: userData.countFollows - 1,
          })
        )
        .catch(errorHandler);
    } else {
      Follows.follow({
        userId: userData.userHostId,
        followUserId: userData.userVisitorId,
      })
        .then(() =>
          setUserData({
            ...userData,
            isVisitorFollowingHost: true,
            countFollows: userData.countFollows + 1,
          })
        )
        .catch(errorHandler);
    }
  };

  return (
    <div className="activities-info" ref={activitiesInfoRef}>
      <CSSTransition
        timeout={{ enter: 150, exit: 75 }}
        classNames="activity-info"
        in={topInfoTransform}
        unmountOnExit
        onEnter={(node: HTMLElement) => {
          node.classList.add("display-none");
        }}
        onEntering={(node: HTMLElement) => {
          setTimeout(() => {
            node.classList.remove("display-none");
            node.classList.add("custom-activity-info-enter-active");
          }, 74);
        }}
      >
        <div
          className="activities-info__left activities-info__left-active"
          onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
        >
          <div>
            <img
              onError={profileCoverImgError}
              src={coverPhotoSrc}
              alt="cover"
            />
            <div>
              <span>{userData.name}</span>
            </div>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        timeout={{ enter: 150, exit: 75 }}
        in={!topInfoTransform}
        classNames="activity-info"
        unmountOnExit
        onEnter={(node: HTMLElement) => {
          node.classList.add("display-none");
        }}
        onEntering={(node: HTMLElement) => {
          setTimeout(() => {
            node.classList.remove("display-none");
            node.classList.add("custom-activity-info-enter-active");
          }, 74);
        }}
      >
        <div className="activities-info__left activities-info__left-pasive">
          <div>
            Name: <span>{userData.name}</span>
          </div>
          <div>
            Following: <span>{userData.countFollowing}</span>
          </div>
          <div>
            Follows: <span>{userData.countFollows}</span>
          </div>
          <div>
            Activities: <span>{userData.numberOfActivities}</span>
          </div>
        </div>
      </CSSTransition>
      <div className="activities-info__right">
        <StandardButton onClick={handleFollowClick}>
          {userData.isVisitorFollowingHost ? "Unfollow" : "Follow"}
        </StandardButton>
      </div>
    </div>
  );
};

export default ActivitiesInfo;
