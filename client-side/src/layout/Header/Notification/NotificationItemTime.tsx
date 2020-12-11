import React, { useEffect, useRef, useState } from "react";
import useIsMounted from "../../../Hooks/useIsMounted";
import moment from "moment";

const NotificationItemTime = ({ time }: { time: string }) => {
  const [timeSpan, setTimeSpan] = useState(moment(time).fromNow());

  const isMounted = useIsMounted();
  const timeSpanRef = useRef(timeSpan);

  useEffect(() => {
    const unit = timeSpanRef.current.substring(
      timeSpanRef.current.length - 11,
      timeSpanRef.current.length - 4
    );
    if (unit === "seconds" || unit === "minutes" || unit === " minute") {
      const interval = setInterval(() => {
        if (isMounted.current) {
          setTimeSpan(moment(time).fromNow());
        }
      }, 1000 * 60);
      setTimeout(() => {
        clearInterval(interval);
      }, 1000 * 60 * 60);
    }
  }, [time, isMounted]);

  return <span className="notification__list__item__time">{timeSpan}</span>;
};

export default NotificationItemTime;
