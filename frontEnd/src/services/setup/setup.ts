import { client } from "../../graphql";
import { SETUP } from "../../graphql/mutations";
import { ActionType, rootStore } from "../../Root";

interface ISetup {
  name: string;
  hobbies: string[];
  image: string | null;
}

export const setup = async (input: ISetup) => {
  const answer = await client.mutate({
    mutation: SETUP,
    variables: { input },
  });

  const user = rootStore.getState().user;

  rootStore.dispatch({
    type: ActionType.SETUP_PROFILE,
    isSetUp: true,
    user: {
      ...user,
      image: input.image,
    },
  });

  return answer;
};
