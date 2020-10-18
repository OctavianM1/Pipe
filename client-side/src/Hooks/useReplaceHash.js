export default function useReplaceHash() {
  return (hashPath, prevHash, actualHash) => {
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