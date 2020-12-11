import React from "react";

const Loader = () => {
  return (
    <>
      <picture>
        <source
          srcSet="/images/gifs/Spinner-1s-200px-1.webp"
          type="image/webp"
        />
        <source srcSet="/images/gifs/Spinner-1s-200px-1.gif" type="image/gif" />
        <img src="/images/gifs/Spinner-1s-200px-1.gif" alt="Loader" />
      </picture>
    </>
  );
};

export default Loader;
