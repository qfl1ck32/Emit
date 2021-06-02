import { createStore } from 'redux'
import { ActionType } from './ActionType'

export interface ReducerState {
    isLoading?: boolean,
    isSignout?: boolean,
    userTokens?: null | {
      accessToken: string,
      refreshToken: string
    },
    isSetUp?: boolean
}

type ReducerAction = {
    type: ActionType,
    tokens: null | {
      accessToken: string,
      refreshToken?: string
    },
    isSetUp?: boolean
}

const initialState: ReducerState = {
    isLoading: true,
    userTokens: null,
    isSetUp: false
}

const reducer = (prevState: any, action: ReducerAction): ReducerState => {
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
                isSetUp: action.isSetUp
            }

        case ActionType.SIGN_OUT:
            return {
                ...prevState,
                userTokens: null
            }

        case ActionType.UPDATE_ACCESS_TOKEN:
            return {
                ...prevState,
                userTokens: {
                    accessToken: action.tokens?.accessToken,
                    refreshToken: prevState.userTokens?.refreshToken
                }
            }

        default:
            return prevState
    }
}

const rootStore = createStore(reducer, initialState)

export default rootStore