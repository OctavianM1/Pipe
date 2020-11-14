export default function useReplaceHash() {
  return (hashPath: string, prevHash: string, actualHash: string): string => {
    let newHashPath = "";
    if (hashPath.includes(prevHash)) {
      hashPath.split(prevHash).forEach((p) => {
        newHashPath += p;
      });
    } else {
      newHashPath += hashPath;
    }
    newHashPath += actualHash;
    window.location.hash = newHashPath;
    return newHashPath;
  };
}
