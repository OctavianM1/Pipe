import React, {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { UploadFile } from "../../api/axios";
import { ServerUser } from "../../api/serverDataInterfaces";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import useDisableScroll from "../../Hooks/useDisableScroll";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";

const CoverPhoto = ({ user }: { user: ServerUser }) => {
  const [coverPhotoSrc, setCoverPhotoSrc] = useState(
    "/images/userPhotos/anonym.jpg"
  );
  const [editCoverPhoto, setEditCoverPhoto] = useState(false);
  const [inputCoverPhotoLogger, setInputCoverPhotoLogger] = useState("");
  const [file, setFile] = useState<string | Blob>("");
  const [fileExtension, setFileExtension] = useState("");
  const [biggerPhoto, setBiggerPhoto] = useState(false);

  const biggerPhotoContainer = useRef<HTMLImageElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  if (biggerPhoto) {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }
  useDisableScroll([biggerPhoto]);
  useOutsideAlerter(biggerPhotoContainer, setBiggerPhoto);

  useEffect(() => {
    if (user) {
      let src: string;
      if (user.coverImageExtension) {
        src = `/images/userPhotos/${user.id}.${user.coverImageExtension}`;
      } else {
        src = "/images/userPhotos/anonym.jpg";
      }
      setCoverPhotoSrc(src);
    }
  }, [user]);

  const saveFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const evTarget = e.target as any;
    if (evTarget.files.length > 1) {
      setInputCoverPhotoLogger("You need to select only 1 file");
    }
    const fileExtension = evTarget.files[0].name.split(".")[1];
    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "pneg"
    ) {
      setFile(evTarget.files[0]);
      setFileExtension(evTarget.files[0].name.split(".")[1]);
      setInputCoverPhotoLogger("");
    } else {
      setInputCoverPhotoLogger(
        "Supported images are with extensions png, jpg, jpeg or pneg"
      );
    }
  };

  const uploadFile = (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "pneg"
    ) {
      const formData = new FormData();
      formData.append("formFile", file);
      formData.append("fileName", `${user.id}.${fileExtension}`);
      formData.append("fileExtension", fileExtension);
      formData.append("userId", user.id);
      UploadFile.userCoverImage(formData)
        .then(() => {
          setEditCoverPhoto(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleProfileCoverPhotoError = (
    ev: SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setCoverPhotoSrc("/images/userPhotos/anonym.jpg");
    ev.preventDefault();
  };

  const handleEditCoverPhoto = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!editCoverPhoto) {
      setEditCoverPhoto(true);
    }
  };

  const cancelEditCoverPhoto = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setEditCoverPhoto(false);
    setInputCoverPhotoLogger("");
  };

  const makeBigCoverPhoto = (
    ev: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    setBiggerPhoto(true);
    ev.stopPropagation();
  };

  return (
    <>
      {biggerPhoto && (
        <div className="profile__show-big-image">
          <img
            ref={biggerPhotoContainer}
            className="profile__show-big-image__container"
            src={coverPhotoSrc}
            alt="Big cover"
          ></img>
        </div>
      )}
      <div
        className={
          editCoverPhoto
            ? "profile__container__public__el"
            : "profile__container__public__el editable"
        }
        onClick={handleEditCoverPhoto}
      >
        <div className="profile__container__public__el__label">Photo</div>
        <div className="profile__container__public__el__info">
          {editCoverPhoto ? (
            <form
              id="uploadCoverImage"
              onSubmit={uploadFile}
              encType="multipart/form-data"
            >
              <div>
                <input ref={fileInput} type="file" onChange={saveFile} />
                <div className="profile__cover-photo-logger">
                  {inputCoverPhotoLogger}
                </div>
              </div>
              <div className="profile__submit-cancel-pair">
                <StandardButton
                  onClick={uploadFile}
                  id="submitCoverImage"
                  classNames={["profile__submit-btn"]}
                >
                  Submit
                </StandardButton>
                <StandardButton
                  onClick={cancelEditCoverPhoto}
                  classNames={["profile__cancel-btn"]}
                >
                  Cancel
                </StandardButton>
              </div>
            </form>
          ) : (
            <>
              <div className="profile__container__public__el__info__data">
                <img
                  onClick={makeBigCoverPhoto}
                  src={coverPhotoSrc}
                  onError={handleProfileCoverPhotoError}
                  alt="Cover"
                />
              </div>
              <div className="profile__container__public__el__info__edit">
                <img src="/images/profile/draw.svg" alt="edit" />
                Edit
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CoverPhoto;
