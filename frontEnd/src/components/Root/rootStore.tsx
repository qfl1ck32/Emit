import { createStore } from 'redux'
import ActionType from './ActionType'

interface ReducerState {
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
        case ActionType.RESTORE_TOKEN:
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

        default:
            return prevState
    }
}

const rootStore = createStore(reducer, initialState)

export default rootStore