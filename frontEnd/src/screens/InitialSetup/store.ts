import { createStore } from 'redux'
import { ActionType } from './ActionType'

export interface ReducerState {
    name: String,
    picture: String,
    hobbies: number[]
}

export type ReducerAction = {
    type: ActionType,

    name?: String,
    picture?: String,
    hobbies?: number[]
}

const initialState: ReducerState = {
    name: '',
    picture: '',
    hobbies: []
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

        case ActionType.SET_HOBBIES:
            return {
                ...prevState,
                hobbies: action.hobbies
            }
        default:
            return prevState
    }
}

export const store = createStore(reducer, initialState)

