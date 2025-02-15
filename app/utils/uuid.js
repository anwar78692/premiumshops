import { v4 as uuidv4 } from "uuid";

export function getUserUUID() {
  let userUUID = localStorage.getItem("userUUID");

  if (!userUUID) {
    userUUID = uuidv4();
    localStorage.setItem("userUUID", userUUID);
  }

  return userUUID;
}
