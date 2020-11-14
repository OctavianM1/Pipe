export default function useAddHashOnChecked() {
  return (
    hashPath: string,
    ref: any,
    replaceHash: (
      hashPath: string,
      prevHash: string,
      actualHash: string
    ) => string
  ) => {
    if (ref.checked) {
      window.location.hash = `${hashPath}&${ref.value}=true`;
    } else {
      replaceHash(hashPath, `&${ref.value}=true`, "");
    }
  };
}
