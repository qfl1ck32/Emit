import { createError } from "apollo-errors";

export const NotAuthenticated = createError("NotAuthenticated", {
  message: "You are not authenticated.",
});
