import axios from 'axios'

import { SERVER_IP } from '@env'

export const signUp = async (username: string, email: string, password: string) => {
    const response = await axios.post(`${SERVER_IP}/signup`, { username, email, password })
  
    return response.data
}
