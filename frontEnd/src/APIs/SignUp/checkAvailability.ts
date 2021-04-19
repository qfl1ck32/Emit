import authServerIP from '../IPs/authServerIP.json'
import axios from 'axios'

export const checkAvailableEmail = async (email: string): Promise <boolean> => {
    return (await axios.post(`${authServerIP}/checkEmailTaken`, { email })).data
}

export const checkAvailableUsername = async (username: string): Promise <boolean> => {
    return (await axios.post(`${authServerIP}/checkUsernameTaken`, { username })).data
}