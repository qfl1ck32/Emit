import { client } from '../../graphql'
import { SETUP } from '../../graphql/mutations'

interface ISetup {
    name: string,
    hobbies: string[],
    image: string | null
}

//FIXME do something?
export const setup = async (input: ISetup) => {
    const { data } = await client.mutate({
        mutation: SETUP,
        variables: { input }
    })
}