export default function useAddHashOnChecked() {
  return (hashPath, ref, replaceHash) => {
    if (ref.checked) {
      window.location.hash = `${hashPath}&${ref.value}=true`;
    } else {
      replaceHash(hashPath, `&${ref.value}=true`, "");
    }
  };
}
