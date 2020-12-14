import React from "react";

const StatelessProfileItem = ({
  label,
  data,
}: {
  data: any;
  label: string;
}) => {
  return (
    <div className="profile__container__public__el">
      <div className="profile__container__public__el__label">{label}</div>
      <div className="profile__container__public__el__info">
        <div className="profile__container__public__el__info__data">
          {data}
        </div>
      </div>
    </div>
  );
};

export default StatelessProfileItem;
