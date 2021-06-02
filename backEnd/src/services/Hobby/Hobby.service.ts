import { HobbyModel, IHobby } from '../../models'
import { FilterQuery } from 'mongodb'

export const addMock = () => {
    const titles = ['Sports', 'Arts', 'Mooscles']
    const activities = [
        ['Football', 'Basketball', 'Gumball'],
        ['Painting', 'Drawing', 'Bob Ross'],
        ['Bodybuilding', 'Calisthenics', 'Watching Chris Heria']
    ]

    for (let i = 0; i < titles.length; ++i) {
        HobbyModel.create({
            title: titles[i],
            activities: activities[i]
        })
    }
}