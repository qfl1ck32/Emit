export interface IContext {
    user: null | {
        username: string,
        email: string,
        iat: number,
        exp: number
    }
}
