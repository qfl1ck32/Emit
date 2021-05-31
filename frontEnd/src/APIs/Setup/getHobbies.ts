import { RequestType, withAutoResend } from '../Root/requestWrapperAPI'
import serverIP from '../../APIs/IPs/serverIP.json'

export const getHobbies = async () => {
    const hobbies = await withAutoResend(RequestType.GET, `${serverIP}/hobbies`) as { data: any }

    return hobbies.data
}
