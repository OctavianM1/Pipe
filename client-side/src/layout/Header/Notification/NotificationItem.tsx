import React from 'react';
import { NotifyMessage, ServerUser } from '../../../api/serverDataInterfaces';
import NotificationItemTime from './NotificationItemTime';

const NotificationItem = ({
  notification,
  className,
  visitorUser,
}: {
  notification: NotifyMessage;
  className: string;
  visitorUser: ServerUser;
}) => {
  return (
    <li className={className}>
      <img
        src={
          notification.user.coverImageExtension
            ? `/images/userPhotos/${notification.user.id}.${notification.user.coverImageExtension}`
            : '/images/userPhotos/anonym.jpg'
        }
        alt="cover"
      />
      <div>
        <p>
          <span className="notification__list__item__name">
            {`${visitorUser.id === notification.user.id ? 'Just You' : notification.user.name}`}
          </span>{' '}
          {notification.message} <NotificationItemTime time={notification.time} />
        </p>
      </div>
    </li>
  );
};

export default NotificationItem;
