import React, { useState } from 'react'

import { TouchableOpacity, Text, StyleSheet } from 'react-native'

import { SetChosenHobbies } from '../HobbiesWithDomain'

export interface IHobby {
    title: string
}

export const Hobby: React.FC <IHobby & SetChosenHobbies> = ({ title, addHobby, removeHobby }) => {

    const [chosen, setChosen] = useState(false)

    const onPress = () => {
        if (chosen) {
            setChosen(false)
            removeHobby(id)
            return
        }

        setChosen(true)
        addHobby(id)
    }

    return (
        <TouchableOpacity onPress = { onPress } style = { [styles.item, chosen ? styles.chosen : styles.notChosen ] } >
            <Text style = { styles.itemTitle }>{ title }</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    item: {
        marginLeft: 10,
        padding: 8,
        borderRadius: 8,
    },

    itemTitle: {
        fontSize: 16,

    },

    chosen: {
        backgroundColor: 'turquoise'
    },

    notChosen: {
        backgroundColor: 'white'
    }
})
