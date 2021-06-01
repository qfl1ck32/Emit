import { RequestType, withAutoResend } from '../Root/requestWrapperAPI'

import { SERVER_IP } from '@env'

export const getHobbies = async () => {
    const hobbies = await withAutoResend(RequestType.GET, `${SERVER_IP}/hobbies`) as { data: any }

    return hobbies.data
}
