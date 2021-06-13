import { client } from "../../graphql";
import {
  ADD_TO_BLACKLIST,
  ADD_TO_WHITELIST,
  REMOVE_FROM_BLACKLIST,
  REMOVE_FROM_WHITELIST,
} from "../../graphql/mutations/user";
import { ActionType, rootStore } from "../../Root";

export const addToWhitelist = async (id: string) => {
  rootStore.dispatch({
    type: ActionType.ADD_TO_WHITELIST,
    userId: id,
  });

  return await client.mutate({
    mutation: ADD_TO_WHITELIST,
    variables: {
      id,
    },
  });
};

export const removeFromWhitelist = async (id: string) => {
  rootStore.dispatch({
    type: ActionType.REMOVE_FROM_WHITELIST,
    userId: id,
  });

  return await client.mutate({
    mutation: REMOVE_FROM_WHITELIST,
    variables: { id },
  });
};

export const removeFromBlacklist = async (id: string) => {
  rootStore.dispatch({
    type: ActionType.REMOVE_FROM_BLACKLIST,
    userId: id,
  });

  return await client.mutate({
    mutation: REMOVE_FROM_BLACKLIST,
    variables: { id },
  });
};

export const addToBlacklist = async (id: string) => {
  rootStore.dispatch({
    type: ActionType.ADD_TO_BLACKLIST,
    userId: id,
  });

  return await client.mutate({
    mutation: ADD_TO_BLACKLIST,
    variables: { id },
  });
};
