export default /* GraphQL */ `
extend type Query {
    Hobbies: [Hobby]
}

type Hobby {
    title: String
    activities: [String]
}
`