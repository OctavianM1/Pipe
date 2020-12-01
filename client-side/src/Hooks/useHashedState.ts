import { useEffect, useState } from "react";

export default function useHashedState() {
  const [hashObj, setHashObj] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const hash = window.location.hash;
    const newHashObj: { [key: string]: string } = {};
    hash.split("&").forEach((item) => {
      newHashObj[item.split("=")[0]] = item.split("=")[1];
    });
    setHashObj(newHashObj);
  }, []);

  useEffect(() => {
    function onHashChange(ev: HashChangeEvent) {
      const newHashObj: { [key: string]: string } = {};
      const hash = ev.newURL.split("#")[1];
      hash.split("&").forEach((item) => {
        newHashObj[item.split("=")[0]] = item.split("=")[1];
      });
      setHashObj(newHashObj);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return hashObj;
}
 