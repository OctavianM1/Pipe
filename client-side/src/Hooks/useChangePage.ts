import useReplaceHash from "./useReplaceHash";

export default function useChangePage(
  hashObj: { [key: string]: string },
  hash: string
) {
  const replaceHash = useReplaceHash();
  return (page: number | string) => {
    window.scroll({ top: 0 });
    replaceHash(hash, `&p=${hashObj["p"]}`, `&p=${page}`);
  };
}
