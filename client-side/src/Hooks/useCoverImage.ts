import { Dispatch, SetStateAction, useState } from "react";

export default function useCoverImage(
  userId: string,
  extension: string | null
): [string, Dispatch<SetStateAction<string>>] {
  const [coverPhotoSrc, setCoverPhotoSrc] = useState(
    extension
      ? `/images/userPhotos/${userId}.${extension}`
      : "/images/userPhotos/anonym.jpg"
  );

  return [coverPhotoSrc, setCoverPhotoSrc];
}
