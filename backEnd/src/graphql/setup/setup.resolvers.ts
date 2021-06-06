interface ISetup {
    input: {
        name: string,
        hobbies: string[],
        image: null | string
    }
}

//FIXME add logic
export default {
    Mutation: {
        setup: async (_: any, data, _3: any) => {
            const { input: { name, hobbies, image } } = data as ISetup

            return true
        }
    }
}