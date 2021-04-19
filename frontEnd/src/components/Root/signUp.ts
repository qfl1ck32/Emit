import axios from 'axios'

import IP from '../../assets/authServerIP.json'

export const signUp = async (username: string, email: string, password: string) => {
    const response = await axios.post(`${IP}/signup`, { username, email, password })
  
    return response.data
}