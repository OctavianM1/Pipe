import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export default function useProfileCoverPhotoError(
  setCoverPhotoSrc: Dispatch<SetStateAction<string>>
) {
  return (ev: SyntheticEvent<HTMLImageElement, Event>) => {
    setCoverPhotoSrc("/images/userPhotos/anonym.jpg");
    ev.preventDefault();
  };
}
