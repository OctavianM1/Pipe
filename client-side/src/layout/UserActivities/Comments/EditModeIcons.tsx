import React, { RefObject, useContext } from "react";
import { ServerUser } from "../../../api/serverDataInterfaces";
import { VisitorUserContext } from "./../UserActivities";

const EditModeIcons = ({
  editMode,
  cancelEdit,
  user,
  onDeleteComment,
  toggleEditMode,
}: {
  editMode: boolean;
  cancelEdit: RefObject<HTMLImageElement>;
  user: ServerUser;
  onDeleteComment: () => void;
  toggleEditMode: () => void;
}) => {
  const visitorUser = useContext(VisitorUserContext);

  return (
    <>
      {editMode && (
        <div className="comment__edit">
          <img src="/images/activities/check.svg" alt="check" />
          <img
            src="/images/activities/cancel.svg"
            alt="cancel"
            ref={cancelEdit}
          />
        </div>
      )}
      {user.id === visitorUser.id && !editMode && (
        <div className="comment__edit">
          <img
            src="/images/activities/edit.svg"
            alt="edit"
            onClick={toggleEditMode}
          />
          <img
            src="/images/activities/delete.svg"
            alt="delete"
            onClick={onDeleteComment}
          />
        </div>
      )}
    </>
  );
};

export default EditModeIcons;
