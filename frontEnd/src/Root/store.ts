import { createStore } from "redux";
import { User } from "../graphql/types/User/User";
import { ActionType } from "./ActionType";

export interface ReducerState {
  isLoading?: boolean;

  tokens: null | {
    accessToken: string;
    refreshToken: string;
  };

  user: Partial<User>;
}

type ReducerAction = {
  type: ActionType;

  tokens?: null | {
    accessToken: string;
    refreshToken?: string;
  };

  user?: Partial<User>;

  userId?: string;
};

const initialState: ReducerState = {
  isLoading: true,
  tokens: null,
  user: {},
};

const reducer = (prevState: any, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case ActionType.RESTORE_TOKENS:
      return {
        ...prevState,
        tokens: action.tokens,
        isLoading: false,
        user: action.user,
      };

    case ActionType.SIGN_IN:
      return {
        ...prevState,
        tokens: action.tokens,
        user: action.user,
      };

    case ActionType.SIGN_OUT:
      return {
        ...prevState,
        tokens: null,
      };

    case ActionType.UPDATE_ACCESS_TOKEN:
      return {
        ...prevState,
        tokens: {
          accessToken: action.tokens?.accessToken,
          refreshToken: prevState.userTokens?.refreshToken,
        },
      };

    case ActionType.SETUP_PROFILE:
      return {
        ...prevState,
        user: {
          isSetUp: true,
        },
      };

    case ActionType.ADD_TO_WHITELIST: {
      const whitelist = prevState.user.whitelist as string[];

      return {
        ...prevState,
        user: {
          ...prevState.user,
          whitelist: whitelist.concat(action.userId as string),
        },
      };
    }

    case ActionType.REMOVE_FROM_WHITELIST: {
      const whitelist = prevState.user.whitelist as string[];

      return {
        ...prevState,
        user: {
          ...prevState.user,
          whitelist: whitelist.filter((id) => id !== action.userId),
        },
      };
    }

    case ActionType.ADD_TO_BLACKLIST: {
      const blacklist = prevState.user.blacklist as string[];

      return {
        ...prevState,
        user: {
          ...prevState.user,
          blacklist: blacklist.concat(action.userId as string),
        },
      };
    }

    case ActionType.REMOVE_FROM_BLACKLIST: {
      const blacklist = prevState.user.blacklist as string[];

      return {
        ...prevState,
        user: {
          ...prevState.user,
          blacklist: blacklist.filter((id) => id !== action.userId),
        },
      };
    }

    default:
      return prevState;
  }
};

export const rootStore = createStore(reducer, initialState);

export default rootStore;
