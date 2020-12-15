import React, { useCallback, useReducer, useRef, useState } from "react";
import { Activities } from "../../../api/axios";
import {
  ServerActivityRaiting,
  ServerUser,
  ServerActivityUserRaiting,
} from "../../../api/serverDataInterfaces";
import StarsRaiting from "../../../components/StarsRaiting/StarsRaiting";
import Star from "../../../components/Svgs/Star";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import UserRaiting from "./UserRaiting";

const ActivityRaiting = ({
  totalRaiting,
  personalRate,
  activityId,
}: {
  totalRaiting: ServerActivityRaiting;
  personalRate: number;
  activityId: string;
}) => {
  const [displayRaiting, setDisplayRaiting] = useState(false);
  const [totalRaitingState, dispatchTotalRaiting] = useReducer(
    totalRaitingReducer,
    {
      raiting: totalRaiting.raiting,
      users: totalRaiting.users,
      personalRate: personalRate,
    }
  );
  const raitingUsersRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  const visitorUser: ServerUser = JSON.parse(
    window.localStorage.getItem("user") || "{}"
  );
  const error = useApiErrorHandler();

  const onHoverRaiting = () => {
    if (raitingUsersRef.current) {
      isHovering.current = true;
      setDisplayRaiting(true);
      setTimeout(() => {
        const container = raitingUsersRef?.current?.firstElementChild;
        container?.classList.add(
          "my-activities__activities-side__activity__total-raiting__users-active"
        );
      });
    }
  };

  const onDishoverRaiting = () => {
    if (raitingUsersRef.current) {
      const container = raitingUsersRef?.current?.firstElementChild;
      if (container) {
        isHovering.current = false;
        container.classList.remove(
          "my-activities__activities-side__activity__total-raiting__users-active"
        );
        setTimeout(() => {
          if (!isHovering.current) {
            setDisplayRaiting(false);
          }
        }, 150);
      }
    }
  };

  const handleRateActivity = useCallback(
    (rate: number) => {
      if (rate === totalRaitingState.personalRate) {
        Activities.deleteRate({
          userId: visitorUser.id,
          activityId: activityId,
        })
          .then(() => {
            dispatchTotalRaiting({
              type: "delete rate",
              visitorUser: visitorUser,
              rate: rate,
            });
          })
          .catch(error);
      } else {
        Activities.rate({
          userId: visitorUser.id,
          activityId: activityId,
          rate: rate,
        })
          .then(() => {
            dispatchTotalRaiting({
              type: "update total rate",
              visitorUser: visitorUser,
              rate: rate,
            });
          })
          .catch(error);
      }
    },
    [error, visitorUser, activityId, totalRaitingState.personalRate]
  );

  let totalStars = [];
  for (let i = 1; i <= 5; i++) {
    totalStars.push(
      <Star
        key={i}
        color={Math.round(totalRaitingState.raiting) >= i ? "#fff220" : "black"}
      />
    );
  }

  return (
    <div className="my-activities__activities-side__activity__total-raiting__container">
      <div
        className="my-activities__activities-side__activity__total-raiting"
        onMouseEnter={onHoverRaiting}
        onMouseLeave={onDishoverRaiting}
      >
        <div ref={raitingUsersRef}>
          {displayRaiting && totalRaitingState.raiting !== 0 && (
            <div className="my-activities__activities-side__activity__total-raiting__users">
              <div className="my-activities__activities-side__activity__total-raiting__users__arrow">
                &nbsp;
              </div>
              {totalRaitingState.users.map((u) => (
                <UserRaiting key={u.id} user={u} />
              ))}
            </div>
          )}
        </div>
        <h3>Total raiting:</h3>
        <div>{totalStars}</div>
      </div>
      <div className="my-activities__activities-side__activity__personal-raiting">
        <h3>Your raiting:</h3>
        <StarsRaiting
          initialState={totalRaitingState.personalRate}
          handleStarClick={handleRateActivity}
        />
      </div>
    </div>
  );
};

function totalRaitingReducer(
  state: ServerActivityRaiting & { personalRate: number },
  action: {
    type: string;
    visitorUser: ServerUser;
    rate: number;
  }
) {
  const uLength = state.users.length;

  switch (action.type) {
    case "delete rate":
      const newRaiting = Math.round(
        (state.raiting * uLength - action.rate) / (uLength - 1)
      );
      return {
        raiting: newRaiting || 0,
        users: state.users.filter((u) => u.id !== action.visitorUser.id),
        personalRate: 0,
      };

    case "update total rate":
      let userExist = false;
      for (const u of state.users) {
        if (u.id === action.visitorUser.id) {
          userExist = true;
          break;
        }
      }
      const newRaitingUser: ServerActivityUserRaiting = {
        id: action.visitorUser.id,
        email: action.visitorUser.email,
        coverImageExtension: action.visitorUser.coverImageExtension,
        name: action.visitorUser.name,
        rate: action.rate,
      };
      if (!userExist) {
        const newRaiting =
          Math.round(state.raiting * uLength + action.rate) / (uLength + 1);

        return {
          raiting: newRaiting,
          users: [...state.users, newRaitingUser],
          personalRate: action.rate,
        };
      } else {
        const newRaiting = Math.round(
          (state.raiting * uLength - state.personalRate + action.rate) / uLength
        );
        return {
          raiting: newRaiting,
          users: [
            ...state.users.filter((u) => u.id !== action.visitorUser.id),
            newRaitingUser,
          ],
          personalRate: action.rate,
        };
      }

    default:
      throw new Error("Invalid action type on total raiting reducer");
  }
}

export default ActivityRaiting;
