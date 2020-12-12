import React, { useCallback, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { UploadFile } from "../../../api/axios";
import { ServerUser } from "../../../api/serverDataInterfaces";
import StandardButton from "../../../components/Buttons/StandardBtn/StandardButton";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import useCoverImage from "../../../Hooks/useCoverImage";
import useDisableScroll from "../../../Hooks/useDisableScroll";
import useOutsideAlerter from "../../../Hooks/useOutsideAlerter";
import useProfileCoverPhotoError from "../../../Hooks/useProfileCoverPhotoError";

const CoverPhoto = ({ user }: { user: ServerUser }) => {
  const [coverPhotoSrc, setCoverPhotoSrc] = useCoverImage(
    user.id,
    user.coverImageExtension
  );
  const [inputCoverPhotoLogger, setInputCoverPhotoLogger] = useState("");

  const [fileData, setFileData] = useState({
    file: "",
    fileExtension: "",
    chooseFileName: "Change avatar",
  });

  const [biggerPhoto, setBiggerPhoto] = useState(false);
  const [edit, dispatchEdit] = React.useReducer(editReducer, {
    editMode: false,
    labelClassStyle: "profile__container__public__el__label",
  });

  const biggerPhotoContainer = useRef<HTMLImageElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  if (biggerPhoto) {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }
  useDisableScroll([biggerPhoto]);
  useOutsideAlerter(
    biggerPhotoContainer,
    biggerPhoto,
    useCallback(() => {
      setBiggerPhoto(false);
    }, [])
  );
  const error = useApiErrorHandler();

  const saveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const evTarget = e.target as any;
    if (evTarget.files.length > 1) {
      setInputCoverPhotoLogger("You need to select only 1 file");
    }
    const splitFileName = evTarget.files[0].name.split(".");
    const fileExtension = splitFileName[splitFileName.length - 1];

    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "pneg"
    ) {
      setFileData({
        file: evTarget.files[0],
        chooseFileName: evTarget.files[0].name,
        fileExtension,
      });
      setInputCoverPhotoLogger("");
    } else {
      setInputCoverPhotoLogger(
        "Supported images are with extensions png, jpg, jpeg or pneg"
      );
    }
  };

  const uploadFile = (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (
      fileData.fileExtension === "png" ||
      fileData.fileExtension === "jpg" ||
      fileData.fileExtension === "jpeg" ||
      fileData.fileExtension === "pneg"
    ) {
      const formData = new FormData();
      formData.append("formFile", fileData.file);
      formData.append("fileName", `${user.id}.${fileData.fileExtension}`);
      formData.append("fileExtension", fileData.fileExtension);
      formData.append("userId", user.id);
      UploadFile.userCoverImage(formData)
        .then(() => {
          window.localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              coverImageExtension: fileData.fileExtension,
            })
          );
          setCoverPhotoSrc(
            `/images/userPhotos/${user.id}.${fileData.fileExtension}`
          );
          dispatchEdit({ type: "closeEdit" });
        })
        .catch(error);
    }
  };

  const profileImgError = useProfileCoverPhotoError(setCoverPhotoSrc);

  const handleEditCoverPhoto = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!edit.editMode) {
      onResizeProfile(dispatchEdit);
    }
  };

  const cancelEditCoverPhoto = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setInputCoverPhotoLogger("");
    dispatchEdit({ type: "closeEdit" });
  };

  const makeBigCoverPhoto = (
    ev: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    setBiggerPhoto(true);
    ev.stopPropagation();
  };

  useEffect(() => {
    if (edit.editMode) {
      window.addEventListener(
        "resize",
        onResizeProfile.bind(this, dispatchEdit)
      );
    }
    return () => {
      window.removeEventListener(
        "resize",
        onResizeProfile.bind(this, dispatchEdit)
      );
    };
  }, [edit.editMode]);

  return (
    <>
      <CSSTransition
        timeout={{ enter: 500, exit: 300 }}
        in={biggerPhoto}
        unmountOnExit
        classNames="fade-in"
      >
        <div className="profile__show-big-image">
          <img
            ref={biggerPhotoContainer}
            className="profile__show-big-image__container"
            src={coverPhotoSrc}
            alt="Big cover"
          />
        </div>
      </CSSTransition>
      <div
        className={
          edit.editMode
            ? "profile__container__public__el"
            : "profile__container__public__el editable"
        }
        onClick={handleEditCoverPhoto}
      >
        <div className={edit.labelClassStyle}>Photo</div>
        <div className="profile__container__public__el__info">
          {edit.editMode ? (
            <form
              id="uploadCoverImage"
              onSubmit={uploadFile}
              encType="multipart/form-data"
            >
              <div>
                <label
                  htmlFor="uploadFileInput"
                  className="profile__container__public__el__info__cahnge-avatar"
                >
                  <img src="/images/profile/upload.svg" alt="Upload" />
                  <span>{fileData.chooseFileName}</span>
                </label>
                <input
                  id="uploadFileInput"
                  name="uploadFileInput"
                  ref={fileInput}
                  type="file"
                  onChange={saveFile}
                  style={{ display: "none" }}
                />
                <div className="profile__cover-photo-logger">
                  {inputCoverPhotoLogger}
                </div>
              </div>
              <div className="profile__submit-cancel-pair">
                <StandardButton
                  type="submit"
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
                  onError={profileImgError}
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

function onResizeProfile(
  dispatchEdit: React.Dispatch<{
    type: string;
  }>
) {
  const windowWidth = window.innerWidth;
  if (windowWidth < 1125 && windowWidth > 825) {
    dispatchEdit({ type: "small label" });
  } else {
    dispatchEdit({ type: "large label" });
  }
}

interface editState {
  editMode: boolean;
  labelClassStyle: string;
}

function editReducer(state: editState, action: { type: string }) {
  switch (action.type) {
    case "closeEdit":
      return {
        editMode: false,
        labelClassStyle: "profile__container__public__el__label",
      };
    case "small label":
      return {
        editMode: true,
        labelClassStyle: "profile__container__public__el__label-small",
      };
    case "large label":
      return {
        editMode: true,
        labelClassStyle: "profile__container__public__el__label-large",
      };
    default:
      throw new Error("Invalid action type");
  }
}

export default CoverPhoto;
