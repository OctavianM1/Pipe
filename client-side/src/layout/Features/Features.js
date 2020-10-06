import React, { useEffect } from "react";
import { Users } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";

const Features = () => {
  const errorApiErrorHandler = useApiErrorHandler();
  useEffect(() => {
    console.log("asd");
    Users.list()
      .then((data) => {
        console.log(data);
      })
      .catch(errorApiErrorHandler);
  }, [errorApiErrorHandler]);
  return (
    <div>
      <h1>Features</h1>
    </div>
  );
};

export default Features;
