import axios from 'axios'

import { SERVER_IP } from '@env'

export const checkAvailableEmail = async (email: string): Promise <boolean> => {
    return !(await axios.post(`${SERVER_IP}/checkEmailTaken`, { email })).data
}

export const checkAvailableUsername = async (username: string): Promise <boolean> => {
    return !(await axios.post(`${SERVER_IP}/checkUsernameTaken`, { username })).data
}