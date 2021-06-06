import { HobbyModel, HobbyCategoryModel } from '../../models'

export const addMock = async () => {
    await HobbyCategoryModel.remove()
    await HobbyModel.remove()

    const titles = ['Sports', 'Arts', 'Mooscles']
    const activities = [
        ['Football', 'Basketball', 'Tennis', 'Badminton', 'Gumball'],
        ['Painting', 'Drawing', 'Dancing', 'Photography', 'Bob Ross'],
        ['Bodybuilding', 'Calisthenics', 'Powerlifting', 'Crossfit',
            'Watching Chris Heria']
    ]

    for (let i = 0; i < titles.length; ++i) {
        const { _id } = await HobbyCategoryModel.create({
            category: titles[i]
        })

        for (const activity of activities[i]) {
            await HobbyModel.create({
                title: activity,
                categoryId: _id
            });
        }
    }
}
