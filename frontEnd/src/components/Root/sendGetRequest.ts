import serverIP from '../../assets/serverIP.json'

import withAutoResend, { RequestType } from './requestWrapperAPI'

const sendGetRequest = async (data: any) => {
    const response = await withAutoResend(RequestType.GET, `${serverIP}/restrictedAPI`)

    if (!response)
      return

    return response.data
}

export default sendGetRequest