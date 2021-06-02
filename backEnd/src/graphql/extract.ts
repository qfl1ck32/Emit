import { readdirSync } from 'fs'
import { resolve } from 'path'

const getDirectories = () => {
    return readdirSync(__dirname, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}

export const extract = () => {
    let typeDefs = []
    let resolvers = []

    const directoryNames = getDirectories()

    for (const dir of directoryNames) {
        const path = resolve(__dirname, dir)
        const tdefs = require(resolve(path, `./${dir}.typeDefs`)).default
        const res = require(resolve(path, `./${dir}.resolvers`)).default

        typeDefs.push(tdefs)
        resolvers.push(res)
    }

    return [typeDefs, resolvers]
}
