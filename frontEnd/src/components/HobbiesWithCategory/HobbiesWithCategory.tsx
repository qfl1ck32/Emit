import React from 'react'

import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { IHobby, Hobby } from '../Hobby'

export interface IHobbiesWithCategory {
    category: string,
    hobbies: IHobby[]
}

export interface SetChosenHobbies {
    addHobby: (_id: string) => void,
    removeHobby: (_id: string) => void
}

export const HobbiesWithCategory: React.FC <IHobbiesWithCategory & SetChosenHobbies> = ({ category, hobbies, addHobby, removeHobby }) => {

    return (
        <View style = { styles.container }>
            <Text style = { styles.title }>{ category }</Text>

            <ScrollView horizontal = { true } style = { styles.activities }>
                {
                    hobbies.map((hobby, index) => (
                        <Hobby key = { index } addHobby = { addHobby } removeHobby = { removeHobby } { ...hobby}  />
                    ))
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },

    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 8,
    },

    item: {
        marginLeft: 10,
        padding: 8
    },

    itemTitle: {
        fontSize: 16,
    },

    activities: {
        display: 'flex',
        marginLeft: 8,
        flexDirection: 'row',
        alignContent: 'space-between'
    }
})
