import authServerIP from '../IPs/authServerIP.json'

import withAutoResend, { RequestType } from './requestWrapperAPI'

const sendGetRequest = async (data: any) => {
    const response = await withAutoResend(RequestType.GET, `${authServerIP}/restrictedAPI`)

    if (!response)
      return

    return response.data
}

export default sendGetRequest