import { FocusEvent } from "react";

export default function handleBlurPassword(
  event: FocusEvent<HTMLInputElement>,
  dispatch: ({ type, msg }: { type: string; msg: string }) => void,
  actionType: string
) {
  const password = event.target.value;
  let log = [];
  if (password.length < 8) {
    log.push("at least 8 charachters");
  }
  if (!/[a-zA-Z]+/g.test(password)) {
    log.push("a lowercase character or a uppercase character");
  }
  if (!/[\d\W]/g.test(password)) {
    log.push("a digit or a non alphanumeric charachter");
  }
  if (log.length !== 0 && log.length !== 3) {
    // log.length !== 3 -> 3 tests
    dispatch({
      type: actionType,
      msg: "Your password must contain " + log.join(", "),
    });
  } else {
    dispatch({
      type: actionType,
      msg: "",
    });
  }
}
