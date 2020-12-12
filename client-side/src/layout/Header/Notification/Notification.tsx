import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { lazy, useEffect, useReducer, useRef, useState } from "react";
import { NotificationAPI } from "../../../api/axios";
import { NotifyMessage, ServerUser } from "../../../api/serverDataInterfaces";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import useOutsideAlerter from "../../../Hooks/useOutsideAlerter";

const NotificationItem = lazy(() => import("./NotificationItem"));

const Notification = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [notification, dispatchNotification] = useReducer(notificationReducer, {
    notifications: [],
    socketNotification: [],
    isDisplayedNotifications: false,
    countDisplayedNotifications: 0,
    loader: true,
  });

  const containerRef = useRef<HTMLLIElement>(null);
  const displayNotificationContainerRef = useRef<HTMLUListElement>(null);
  const containerArrowRef = useRef<HTMLSpanElement>(null);

  const visitorUser: ServerUser = JSON.parse(
    window.localStorage.getItem("user") || "{}"
  );

  const error = useApiErrorHandler();

  useOutsideAlerter(
    displayNotificationContainerRef,
    notification.isDisplayedNotifications,
    React.useCallback(() => {
      displayNotificationContainerRef.current?.classList.remove(
        "notification__list-active"
      );
      containerArrowRef.current?.classList.remove("arrow-active");
      setTimeout(() => {
        dispatchNotification({ type: "close" });
      }, 450);
    }, []),
    "header__li-notification__container"
  );

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/hubs/notify")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    NotificationAPI.getAll({ userId: visitorUser.id, taken: 0, toTake: 7 })
      .then((notifs: NotifyMessage[]) => {
        dispatchNotification({
          type: "set notifications",
          notification: notifs,
        });
      })
      .catch(error);
  }, [visitorUser.id, error]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (message: NotifyMessage) => {
            if (message.observableUsersIds.includes(visitorUser.id)) {
              dispatchNotification({
                type: "set socket notifications",
                notification: [message],
              });
            }
          });
        })
        .catch((e: any) => console.log("Connection failed: ", e));
    }
  }, [connection, visitorUser.id]);

  const allNotifsLength =
    notification.notifications.length + notification.socketNotification.length;

  useEffect(() => {
    if (allNotifsLength !== notification.countDisplayedNotifications) {
      NotificationAPI.getAll({
        userId: visitorUser.id,
        taken: allNotifsLength,
        toTake: notification.countDisplayedNotifications - allNotifsLength,
      })
        .then((notifs: NotifyMessage[]) => {
          dispatchNotification({
            type: "update notifications",
            notification: notifs,
          });
        })
        .catch(error);
    }
  }, [
    visitorUser.id,
    notification.countDisplayedNotifications,
    allNotifsLength,
    error,
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (
        displayNotificationContainerRef.current &&
        notification.isDisplayedNotifications
      ) {
        let last = displayNotificationContainerRef.current.lastElementChild;
        if (last && last.classList.contains("notification__list__loader")) {
          last = last.previousElementSibling;
        }
        if (last && last.classList.contains("notification__list__item")) {
          const options = {
            threshold: 1.0,
          };
          const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                dispatchNotification({ type: "add notifications" });
                observer.disconnect();
              }
            });
          }, options);
          observer.observe(last);
        }
      }
    }, 100);
  }, [allNotifsLength, notification.isDisplayedNotifications]);

  const showNotifications = () => {
    if (notification.isDisplayedNotifications) {
      if (displayNotificationContainerRef.current) {
        displayNotificationContainerRef.current.classList.remove(
          "notification__list-active"
        );
        containerArrowRef.current?.classList.remove("arrow-active");
        setTimeout(() => {
          dispatchNotification({ type: "close" });
        }, 450);
      }
    } else {
      dispatchNotification({ type: "open" });
      setTimeout(() => {
        displayNotificationContainerRef.current?.classList.add(
          "notification__list-active"
        );
        containerArrowRef.current?.classList.add("arrow-active");
      });
    }
  };

  let allNotificationItems = [];
  if (notification.isDisplayedNotifications) {
    allNotificationItems = mapReverse(
      notification.socketNotification,
      (n: NotifyMessage) => (
        <NotificationItem
          key={n.id}
          className="notification__list__item notification__list__item__socket"
          notification={n}
          visitorUser={visitorUser}
        />
      ),
      notification.countDisplayedNotifications
    );
    const actualLength = allNotificationItems.length;
    for (
      let i = actualLength;
      i < notification.countDisplayedNotifications;
      i++
    ) {
      const n = notification.notifications[i - actualLength];
      if (!n) {
        break;
      }
      allNotificationItems.push(
        <NotificationItem
          key={n.id}
          className="notification__list__item"
          notification={n}
          visitorUser={visitorUser}
        />
      );
    }
  }

  return (
    <li className="header__li-notification__container" ref={containerRef}>
      <div className="header__li-notification" onClick={showNotifications}>
        <img src="/images/notification.svg" alt="notification" />
        {notification.socketNotification.length > 0 && (
          <span className="header__span-top-right">
            <p>
              {notification.socketNotification.length > 9
                ? "9+"
                : notification.socketNotification.length}
            </p>
          </span>
        )}
      </div>
      {notification.isDisplayedNotifications && (
        <>
          <span ref={containerArrowRef}>&nbsp;</span>
          <ul
            className="notification__list"
            ref={displayNotificationContainerRef}
          >
            {allNotificationItems.length > 0 ? (
              <>
                <React.Suspense fallback={<div />}>
                  {allNotificationItems}
                </React.Suspense>
                {notification.loader && (
                  <div className="notification__list__loader">
                    <span className="notification__list__loader--1">
                      &nbsp;
                    </span>
                    <span className="notification__list__loader--2">
                      &nbsp;
                    </span>
                    <span className="notification__list__loader--3">
                      &nbsp;
                    </span>
                  </div>
                )}
              </>
            ) : (
              <h2 className="notification__list__no-item">
                No notifications yet!
              </h2>
            )}
          </ul>
        </>
      )}
    </li>
  );
};

function mapReverse(arr: any[], cb: Function, nr: number) {
  const newArr = [];
  for (let i = arr.length - 1; i >= arr.length - nr && arr[i]; i--) {
    newArr.push(cb(arr[i]));
  }
  return newArr;
}

interface notificationState {
  notifications: NotifyMessage[];
  socketNotification: NotifyMessage[];
  isDisplayedNotifications: boolean;
  countDisplayedNotifications: number;
  loader: boolean;
}

function notificationReducer(
  state: notificationState,
  action: {
    type: string;
    notification?: NotifyMessage[];
  }
) {
  switch (action.type) {
    case "close":
      const newNotifications: NotifyMessage[] = [];
      for (const n of state.socketNotification) {
        newNotifications.push(n);
      }
      for (const n of state.notifications) {
        newNotifications.push(n);
      }
      return {
        ...state,
        notifications: newNotifications,
        socketNotification: [],
        isDisplayedNotifications: false,
      };
    case "open":
      return { ...state, isDisplayedNotifications: true };
    case "set notifications":
      if (!action.notification) {
        throw new Error(`Must tot insert notifications`);
      }
      return {
        ...state,
        notifications: action.notification,
        countDisplayedNotifications: action.notification.length,
        loader: false,
      };
    case "update notifications":
      if (!action.notification) {
        throw new Error(`Must tot insert notifications`);
      }
      const notificationItems = [...state.notifications].concat(
        action.notification
      );
      return {
        ...state,
        notifications: notificationItems,
        countDisplayedNotifications:
          notificationItems.length + state.socketNotification.length,
        loader: false,
      };
    case "set socket notifications":
      if (!action.notification) {
        throw new Error(`Must tot insert notifications`);
      }
      return {
        ...state,
        socketNotification: state.socketNotification.concat(
          ...action.notification
        ),
        countDisplayedNotifications:
          state.countDisplayedNotifications + action.notification.length,
      };
    case "add notifications":
      return {
        ...state,
        countDisplayedNotifications: state.countDisplayedNotifications + 7,
        loader: true,
      };
    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
}

export default Notification;
