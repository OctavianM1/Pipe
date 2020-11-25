import React from "react";

const BottomCommentButtons = ({
  isLikedComment,
  handleOnLikeComment,
  onClickRespond,
  style,
}: {
  isLikedComment: boolean;
  handleOnLikeComment: () => void;
  onClickRespond: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  style?: { [key: string]: string };
}) => {
  return (
    <div className="c__buttons" style={style}>
      {isLikedComment ? (
        <button
          className="c__buttons__button-like c__buttons__button-like-active"
          onClick={() => handleOnLikeComment()}
        >
          UnLike
        </button>
      ) : (
        <button
          className="c__buttons__button-like"
          onClick={() => handleOnLikeComment()}
        >
          Like
        </button>
      )}
      <span>&nbsp;·&nbsp;</span>
      <button className="c__buttons__button-respond" onClick={onClickRespond}>
        Respond
      </button>
    </div>
  );
};

export default BottomCommentButtons;
