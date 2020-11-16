import React, { ReactNode, MouseEventHandler } from "react";
import "./standardButton.scss";

interface StandardButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset" | undefined;
  classNames?: string[];
  id?: string;
}

const StandardButton = ({
  onClick,
  children,
  type,
  classNames,
  id
}: StandardButtonProps) => {
  return (
    <button
      className={`standard-btn ${classNames ? classNames.join(" ") : ""}`}
      onClick={onClick}
      type={type}
      id={id}
    >
      {children}
    </button>
  );
};

export default StandardButton;
