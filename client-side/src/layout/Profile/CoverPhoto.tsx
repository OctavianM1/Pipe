import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { UploadFile } from "../../api/axios";
import { ServerUser } from "../../api/serverDataInterfaces";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import useDisableScroll from "../../Hooks/useDisableScroll";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import useProfileCoverPhotoError from "../../Hooks/useProfileCoverPhotoError";

function onResizeProfile(
  dispatchEdit: Dispatch<{
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

const CoverPhoto = ({ user }: { user: ServerUser }) => {
  const [coverPhotoSrc, setCoverPhotoSrc] = useState(
    user.coverImageExtension
      ? `/images/userPhotos/${user.id}.${user.coverImageExtension}`
      : "/images/userPhotos/anonym.jpg"
  );
  const [inputCoverPhotoLogger, setInputCoverPhotoLogger] = useState("");
  const [file, setFile] = useState<string | Blob>("");
  const [fileExtension, setFileExtension] = useState("");
  const [biggerPhoto, setBiggerPhoto] = useState(false);
  const [chooseFileName, setChooseFileName] = useState("Change avatar");
  const [edit, dispatchEdit] = useReducer(editReducer, {
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
  useOutsideAlerter(biggerPhotoContainer, setBiggerPhoto);

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
      setChooseFileName(evTarget.files[0].name);
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
          window.localStorage.setItem(
            "user",
            JSON.stringify({ ...user, coverImageExtension: fileExtension })
          );
          dispatchEdit({ type: "closeEdit" });
        })
        .catch((err) => console.log(err));
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
      {biggerPhoto && (
        <div className="profile__show-big-image">
          <img
            ref={biggerPhotoContainer}
            className="profile__show-big-image__container"
            src={coverPhotoSrc}
            alt="Big cover"
          />
        </div>
      )}
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
                  <span>{chooseFileName}</span>
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

export default CoverPhoto;
