import { client } from "../../graphql/client";
import { LOGIN } from "../../graphql/mutations";

import { setItemAsync } from "expo-secure-store";
import rootStore from "../../Root/store";
import { ActionType } from "../../Root/ActionType";
import { User } from "../../graphql/types/User/User";

interface LoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
}

export const login = async (username: string, password: string) => {
  const {
    errors,
    data: { login },
  } = await client.mutate({
    mutation: LOGIN,
    variables: {
      username,
      password,
    },
  });

  if (!errors) {
    const { tokens, user } = login as LoginResponse;

    const { accessToken, refreshToken } = tokens;

    await setItemAsync("accessToken", accessToken);
    await setItemAsync("refreshToken", refreshToken);

    rootStore.dispatch({
      type: ActionType.SIGN_IN,
      tokens,
      user,
    });
  }

  return { err: errors?.[0].message };
};
