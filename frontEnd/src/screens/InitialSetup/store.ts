import { createStore } from 'redux'
import ActionType from './ActionType'

export interface ReducerState {
    name: String,
    picture: String
}

export type ReducerAction = {
    type: ActionType,

    name?: String,
    picture?: String
}

const initialState: ReducerState = {
    name: '',
    picture: ''
}

const reducer = (prevState: any, action: ReducerAction): ReducerState => {
    switch(action.type) {
        case ActionType.SET_NAME:
            return {
                ...prevState,
                name: action.name
            }

        case ActionType.SET_PICTURE:
            return {
                ...prevState,
                picture: action.picture
            }

        default:
            return prevState
    }
}

export const store = createStore(reducer, initialState)

