import useReplaceHash from "./useReplaceHash";

const replaceHash = useReplaceHash();

export default function useChangePage(hashObj, hash) {
  return (page) => {
    window.scroll({ top: 0 });
    replaceHash(hash, `&p=${hashObj["p"]}`, `&p=${page}`);
  };
}
