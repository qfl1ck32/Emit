import React from 'react'

import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { IHobby, Hobby } from '../Hobby'

export interface IHobbiesWithDomain {
    title: string,
    activities: IHobby[]
}

export interface SetChosenHobbies {
    addHobby: (id: number) => void,
    removeHobby: (id: number) => void
}

export const HobbiesWithDomain: React.FC <IHobbiesWithDomain & SetChosenHobbies> = ({ title, activities, addHobby, removeHobby }) => {

    return (
        <View style = { styles.container }>
            <Text style = { styles.title }>{ title }</Text>

            <ScrollView horizontal = { true } style = { styles.activities }>
                {
                    activities.map((hobby, index) => (
                        <Hobby key = { index } addHobby = { addHobby } removeHobby = { removeHobby } { ...hobby}  />
                    ))
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
    },

    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24
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
