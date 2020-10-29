import React, { useRef, useState } from "react";

import "./createActivity.scss";

import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";

import { Link } from "react-router-dom";

import { Activities } from "../../api/axios";
import CloseBtn from "../../components/Buttons/CloseBtn/CloseBtn";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";

const CreateActivity = ({ edit, title, subject, body, activity }) => {
  const [titleLabel, setTitleLabel] = useState(edit);
  const [subjectLabel, setSubjectLabel] = useState(edit);
  const [bodyLabel, setBodyLabel] = useState(edit);

  const [titleLogger, setTitleLogger] = useState(false);
  const [subjectLogger, setSubjectLogger] = useState(false);
  const [bodyLogger, setBodyLogger] = useState(false);

  const titleInput = useRef(null);
  const subjectInput = useRef(null);
  const bodyInput = useRef(null);

  const [successCreatedPopUp, setSuccessCreatedPopUp] = useState(false);
  const successPopUp = useRef(null);
  useOutsideAlerter(successPopUp, setSuccessCreatedPopUp);
  const error = useApiErrorHandler();

  const handleBlurInput = (ev) => {
    if (ev.target.name === "title") {
      if (ev.target.value.trim()) {
        setTitleLabel(true);
      } else {
        setTitleLabel(false);
      }
    } else if (ev.target.name === "subject") {
      if (ev.target.value.trim()) {
        setSubjectLabel(true);
      } else {
        setSubjectLabel(false);
      }
    } else if (ev.target.name === "body") {
      if (ev.target.value.trim()) {
        setBodyLabel(true);
      } else {
        setBodyLabel(false);
      }
    }
  };

  const handleFocusInput = (ev) => {
    if (ev.target.name === "title") {
      setTitleLabel(true);
    } else if (ev.target.name === "subject") {
      setSubjectLabel(true);
    } else if (ev.target.name === "body") {
      setBodyLabel(true);
    }
  };

  const handleSubmitForm = (ev) => {
    let errors = false;
    if (ev.target.title.value.length < 5) {
      errors = true;
      setTitleLogger(true);
    }
    if (ev.target.subject.value.length < 2) {
      errors = true;
      setSubjectLogger(true);
    }
    if (ev.target.body.value.length < 15) {
      errors = true;
      setBodyLogger(true);
    }

    if (!errors) {
      const title = ev.target.title.value;
      const subject = ev.target.subject.value;
      const body = ev.target.body.value;
      if (edit) {
        Activities.update({
          activityId: activity.id,
          title: title,
          subject: subject,
          body: body,
        })
          .then(() => {
            setSuccessCreatedPopUp(true);
            setBodyLogger(false);
            setTitleLogger(false);
            setSubjectLogger(false);
          })
          .catch(error);
      } else {
        Activities.create({
          userHostId: JSON.parse(window.localStorage.getItem("user")).id,
          title: title,
          subject: subject,
          body: body,
        })
          .then(() => {
            setSuccessCreatedPopUp(true);
            titleInput.current.value = "";
            subjectInput.current.value = "";
            bodyInput.current.value = "";
            setTitleLabel(false);
            setSubjectLabel(false);
            setBodyLabel(false);
            setBodyLogger(false);
            setTitleLogger(false);
            setSubjectLogger(false);
          })
          .catch(error);
      }
    }

    ev.preventDefault();
  };

  return (
    <>
      {successCreatedPopUp && (
        <div className="succes-submit-pop-up">
          <div ref={successPopUp} className="succes-submit-pop-up__container">
            <h1>You successfully {edit ? "updated" : "created"} a activity!</h1>
            <Link
              to={`/activities/${
                JSON.parse(window.localStorage.getItem("user")).id
              }`}
            >
              <StandardButton>Go to activities</StandardButton>
            </Link>
            <CloseBtn onClick={() => setSuccessCreatedPopUp(false)} />
          </div>
        </div>
      )}

      <div className="create-activity">
        <form
          className="create-activity__container"
          onSubmit={handleSubmitForm}
        >
          <div>
            <input
              ref={titleInput}
              type="text"
              name="title"
              className="create-activity__container__title"
              onBlur={handleBlurInput}
              onFocus={handleFocusInput}
              defaultValue={edit ? title : ""}
            />
            <span
              className={
                titleLabel ? "input-label input-label-active" : "input-label"
              }
              onClick={() => titleInput.current.focus()}
            >
              Title
            </span>
            {titleLogger && (
              <span className="logger">
                Title cannot be shorter then 5 characters
              </span>
            )}
          </div>
          <div>
            <input
              ref={subjectInput}
              type="text"
              name="subject"
              className="create-activity__container__subject"
              onBlur={handleBlurInput}
              onFocus={handleFocusInput}
              defaultValue={edit ? subject : ""}
            />
            <span
              className={
                subjectLabel ? "input-label input-label-active" : "input-label"
              }
              onClick={() => subjectInput.current.focus()}
            >
              Subject
            </span>
            {subjectLogger && (
              <span className="logger">
                Subject cannot be shorter then 2 characters
              </span>
            )}
          </div>
          <div>
            <textarea
              ref={bodyInput}
              type="text"
              name="body"
              className="create-activity__container__body"
              onBlur={handleBlurInput}
              onFocus={handleFocusInput}
              defaultValue={edit ? body : ""}
            />
            <span
              className={
                bodyLabel
                  ? "textarea-label textarea-label-active"
                  : "textarea-label"
              }
              onClick={() => bodyInput.current.focus()}
            >
              Body
            </span>
            {bodyLogger && (
              <span className="logger">
                Body cannot be shorter then 15 characters
              </span>
            )}
          </div>
          <div className="create-activity__container__submit" type="submit">
            <StandardButton>Submit</StandardButton>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateActivity;
