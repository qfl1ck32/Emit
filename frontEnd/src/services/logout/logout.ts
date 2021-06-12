import { getItemAsync, deleteItemAsync } from "expo-secure-store";
import rootStore from "../../Root/store";
import { client } from "../../graphql/client";
import { LOGOUT } from "../../graphql/mutations";

import { ActionType } from "../../Root/ActionType";

export const logout = async () => {
  const accessToken = await getItemAsync("accessToken");
  const refreshToken = await getItemAsync("refreshToken");

  await client.mutate({
    mutation: LOGOUT,
    variables: {
      accessToken,
      refreshToken,
    },
  });

  await deleteItemAsync("accessToken");
  await deleteItemAsync("refreshToken");

  rootStore.dispatch({
    type: ActionType.SIGN_OUT,
    tokens: null,
  });
};
