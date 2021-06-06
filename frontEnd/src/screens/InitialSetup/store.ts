import { createStore } from 'redux'
import { ActionType } from './ActionType'

export interface ReducerState {
    name: string,
    image: string,
    hobbies: string[]
}

export type ReducerAction = {
    type: ActionType,

    name?: String,
    image?: String | null,
    hobbies?: string[]
}

const initialState: ReducerState = {
    name: '',
    image: '',
    hobbies: []
}

const reducer = (prevState: any, action: ReducerAction): ReducerState => {
    switch(action.type) {
        case ActionType.SET_NAME:
            return {
                ...prevState,
                name: action.name
            }

        case ActionType.SET_IMAGE:
            return {
                ...prevState,
                image: action.image
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

