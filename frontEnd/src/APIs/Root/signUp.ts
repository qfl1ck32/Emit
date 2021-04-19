import axios from 'axios'

import authServerIP from '../IPs/authServerIP.json'

export const signUp = async (username: string, email: string, password: string) => {
    const response = await axios.post(`${authServerIP}/signup`, { username, email, password })
  
    return response.data
}