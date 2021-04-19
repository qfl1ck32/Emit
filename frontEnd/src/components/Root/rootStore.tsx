import { createStore } from 'redux'
import ActionType from './ActionType'

export interface ReducerState {
    isLoading: boolean,
    isSignout: boolean,
    userTokens: null | {
      accessToken: string,
      refreshToken: string
    }
}
  
type ReducerAction = {
    type: ActionType,
    tokens: null | {
      accessToken: string,
      refreshToken: string
    }
}
  
const initialState: ReducerState = {
    isLoading: true,
    isSignout: false,
    userTokens: null
}
  
const reducer = (prevState, action: ReducerAction): ReducerState => {
    switch(action.type) {
        case ActionType.RESTORE_TOKENS:
            return {
                ...prevState,
                userTokens: action.tokens,
                isLoading: false
            }

        case ActionType.SIGN_IN:
            return {
                ...prevState,
                userTokens: action.tokens,
            }

        case ActionType.SIGN_OUT:
            return {
                ...prevState,
                userTokens: null
            }

        case ActionType.UPDATE_TOKENS:
            return {
                ...prevState,
                userTokens: {
                    accessToken: action.tokens?.accessToken || prevState.accessToken,
                    refreshToken: action.tokens?.refreshToken || prevState.refreshToken
                }
            }

        default:
            return prevState
    }
}

const rootStore = createStore(reducer, initialState)

export default rootStore