import React, { useState } from 'react'

import { View, Text, Button, StyleSheet } from 'react-native'

import * as Animatable from 'react-native-animatable'

import { store } from './store'
import { SetupNavigationProps } from './interfaces'
import { ActionType } from './ActionType'

import { HobbiesWithCategory, IHobbiesWithCategory } from '../../components/HobbiesWithCategory'

import { useQuery } from '@apollo/react-hooks'
import { GET_HOBBIES } from '../../graphql'

export const SetupHobbies = ({ navigation }: SetupNavigationProps <'SetupName'>) => {

    const [chosenHobbies, setChosenHobbies] = useState <string[]> ([])

    const { data: hobbies, loading } = useQuery <{ "hobbiesFind": IHobbiesWithCategory[] }> (GET_HOBBIES)

    const onSubmit = () => {
        store.dispatch({
            type: ActionType.SET_HOBBIES,
            hobbies: chosenHobbies
        })
        
        navigation.navigate('SetupPicture')
    }

    const chooseHobby = (_id: string) => {
        setChosenHobbies(prevHobbies => prevHobbies.concat(_id))
    }

    const unchooseHobby = (_id: string) => {
        setChosenHobbies(prevHobbies => prevHobbies.filter(item_id => item_id !== _id))
    }

    if (loading) {
        return null
    }

    return (
        <View style = { styles.container }>

            <View style = { styles.header }>
                <Text style = { styles.textHeader }>Complete your profile</Text>
            </View>

            <Animatable.View animation = 'fadeInUpBig' duration = { 500 } style = { styles.footer } >

            { hobbies?.hobbiesFind.map((hobby, index) => (
                    <HobbiesWithCategory key = { index } addHobby = { chooseHobby } removeHobby = { unchooseHobby } { ...hobby } />
                ))
            }

            <View style = { styles.button }>
                <Button title = 'Continue' onPress = { onSubmit } />
            </View>

        </Animatable.View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a8fd0'
    },

    textHeader: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 30
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },

    footer: {
        flex: 5,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop: -150
    },

    button: {
        width: '50%',
        left: 100,
        marginTop: 25   
    }
})
