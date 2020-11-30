import React, {
  Dispatch,
  FocusEvent,
  FormEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./createActivity.scss";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import { Link } from "react-router-dom";
import { Activities } from "../../api/axios";
import CloseBtn from "../../components/Buttons/CloseBtn/CloseBtn";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import UpLabelInput from "../../components/UpLabelInput/UpLabelInput";
import FancyHeader from "../../components/Headers/FancyHeader";
import useDocumentTitle from "../../Hooks/useDocumentTitle";

interface CreateActivityProps {
  edit: boolean;
  title: string;
  subject: string;
  body: string;
  activityId: string;
}

const CreateActivity = ({
  edit,
  title,
  subject,
  body,
  activityId,
}: Partial<CreateActivityProps>) => {
  const [inputs, dispatchInputs] = useReducer(inputsReducer, {
    titleLabel: edit,
    subjectLabel: edit,
    bodyLabel: edit,
    titleLogger: false,
    subjectLogger: false,
    bodyLogger: false,
  });

  const bodyInput = useRef<HTMLTextAreaElement>(null);

  const [successCreatedPopUp, setSuccessCreatedPopUp] = useState(false);
  const successPopUp = useRef<HTMLDivElement>(null);
  useOutsideAlerter(
    successPopUp,
    successCreatedPopUp,
    useCallback(() => setSuccessCreatedPopUp(false), [])
  );
  const error = useApiErrorHandler();

  useDocumentTitle(edit ? "Edit activity" : "Create an activity", [edit]);

  const handleFocusInput = (
    ev: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>
  ) => {
    if (ev.target.name === "title") {
      dispatchInputs({ type: "active title label" });
    } else if (ev.target.name === "subject") {
      dispatchInputs({ type: "active subject label" });
    } else if (ev.target.name === "body") {
      dispatchInputs({ type: "active body label" });
    }
  };

  const handleSubmitForm = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      let errors = false;
      const target = ev.target as any;
      if (target.title.value.length < 5) {
        errors = true;
        dispatchInputs({ type: "active title logger" });
      } else {
        dispatchInputs({ type: "inactive title logger" });
      }
      if (target.subject.value.length < 2) {
        errors = true;
        dispatchInputs({ type: "active subject logger" });
      } else {
        dispatchInputs({ type: "inactive subject logger" });
      }
      if (target.body.value.length < 15) {
        errors = true;
        dispatchInputs({ type: "active body logger" });
      } else {
        dispatchInputs({ type: "inactive body logger" });
      }

      if (!errors) {
        const title = target.title.value;
        const subject = target.subject.value;
        const body = target.body.value;
        if (edit) {
          Activities.update({
            activityId: activityId!,
            title: title,
            subject: subject,
            body: body,
          })
            .then(() => {
              setSuccessCreatedPopUp(true);
              dispatchInputs({ type: "submitted edited" });
            })
            .catch(error);
        } else {
          Activities.create({
            userHostId: JSON.parse(window.localStorage.getItem("user") || "{}")
              .id,
            title: title,
            subject: subject,
            body: body,
          })
            .then(() => {
              setSuccessCreatedPopUp(true);
              dispatchInputs({ type: "submitted" });
              if (bodyInput.current) {
                bodyInput.current.value = "";
              }
            })
            .catch(error);
        }
      }

      ev.preventDefault();
    },
    [activityId, error, edit]
  );

  return (
    <>
      {successCreatedPopUp && (
        <div className="succes-submit-pop-up">
          <div ref={successPopUp} className="succes-submit-pop-up__container">
            <h1>You successfully {edit ? "updated" : "created"} a activity!</h1>
            <Link
              to={`/activities/${
                JSON.parse(window.localStorage.getItem("user") || "{}").id
              }`}
            >
              <StandardButton>Go to activities</StandardButton>
            </Link>
            <CloseBtn onClick={() => setSuccessCreatedPopUp(false)} />
          </div>
        </div>
      )}

      <div className="create-activity">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FancyHeader>
            {edit ? "Edit activity" : "Create an activity"}
          </FancyHeader>
        </div>
        <form
          className="create-activity__container"
          onSubmit={handleSubmitForm}
        >
          <UpLabelInput
            handleBlurInput={(ev) => handleBlurInput(ev, dispatchInputs)}
            handleFocusInput={handleFocusInput}
            edit
            val={title}
            label={inputs.titleLabel}
            labelName="Title"
            logger={inputs.titleLogger}
            name="title"
            loggerText="Title cannot be shorter then 5 characters"
          />
          <UpLabelInput
            handleBlurInput={(ev) => handleBlurInput(ev, dispatchInputs)}
            handleFocusInput={handleFocusInput}
            edit
            val={subject}
            label={inputs.subjectLabel}
            labelName="Subject"
            logger={inputs.subjectLogger}
            name="subject"
            loggerText="Subject cannot be shorter then 2 characters"
          />
          <div>
            <textarea
              ref={bodyInput}
              name="body"
              className="create-activity__container__body"
              onBlur={(ev) => handleBlurInput(ev, dispatchInputs)}
              onFocus={handleFocusInput}
              defaultValue={edit ? body : ""}
            />
            <span
              style={inputs.bodyLogger ? { top: "38%" } : {}}
              className={
                inputs.bodyLabel
                  ? "textarea-label textarea-label-active"
                  : "textarea-label"
              }
              onClick={() => bodyInput.current?.focus()}
            >
              Body
            </span>
            {inputs.bodyLogger && (
              <span className="logger">
                Body cannot be shorter then 15 characters
              </span>
            )}
          </div>
          <div className="create-activity__container__submit">
            <StandardButton type="submit">Submit</StandardButton>
          </div>
        </form>
      </div>
    </>
  );
};

interface InputsLabelsAndLogersState {
  titleLabel: boolean | undefined;
  subjectLabel: boolean | undefined;
  bodyLabel: boolean | undefined;
  titleLogger: boolean;
  subjectLogger: boolean;
  bodyLogger: boolean;
}

function inputsReducer(
  state: InputsLabelsAndLogersState,
  action: { type: string }
) {
  switch (action.type) {
    case "active title label":
      return { ...state, titleLabel: true };
    case "inactive title label":
      return { ...state, titleLabel: false };
    case "active subject label":
      return { ...state, subjectLabel: true };
    case "inactive subject label":
      return { ...state, subjectLabel: false };
    case "active body label":
      return { ...state, bodyLabel: true };
    case "inactive body label":
      return { ...state, bodyLabel: false };
    case "active title logger":
      return { ...state, titleLogger: true };
    case "inactive title logger":
      return { ...state, titleLogger: false };
    case "active subject logger":
      return { ...state, subjectLogger: true };
    case "inactive subject logger":
      return { ...state, subjectLogger: false };
    case "active body logger":
      return { ...state, bodyLogger: true };
    case "inactive body logger":
      return { ...state, bodyLogger: false };
    case "submitted edited":
      return {
        titleLabel: true,
        subjectLabel: true,
        bodyLabel: true,
        titleLogger: false,
        subjectLogger: false,
        bodyLogger: false,
      };
    case "submitted":
      return {
        titleLabel: false,
        subjectLabel: false,
        bodyLabel: false,
        titleLogger: false,
        subjectLogger: false,
        bodyLogger: false,
      };

    default:
      throw new Error(`Problem action reducer inputs:: ${action.type}`);
  }
}

function handleBlurInput(
  ev: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>,
  dispatchInputs: Dispatch<{
    type: string;
  }>
) {
  if (ev.target.name === "title") {
    if (ev.target.value.trim()) {
      dispatchInputs({ type: "active title label" });
    } else {
      dispatchInputs({ type: "inactive title label" });
    }
  } else if (ev.target.name === "subject") {
    if (ev.target.value.trim()) {
      dispatchInputs({ type: "active subject label" });
    } else {
      dispatchInputs({ type: "inactive subject label" });
    }
  } else if (ev.target.name === "body") {
    if (ev.target.value.trim()) {
      dispatchInputs({ type: "active body label" });
    } else {
      dispatchInputs({ type: "inactive body label" });
    }
  }
}

export default CreateActivity;
