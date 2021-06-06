import React, { useState } from 'react'

import { View, Text, Button, StyleSheet } from 'react-native'

import * as Animatable from 'react-native-animatable'

import { store } from './store'
import { SetupNavigationProps } from './interfaces'
import { ActionType } from './ActionType'

import { HobbiesWithDomain, IHobbiesWithDomain } from '../../components/HobbiesWithDomain'

import { useQuery } from '@apollo/react-hooks'
import { GET_HOBBIES } from '../../graphql'

export const SetupHobbies = ({ navigation }: SetupNavigationProps <'SetupName'>) => {

    const [chosenHobbies, setChosenHobbies] = useState <number[]> ([])

    const { data: hobbies, loading, error } = useQuery <{ "Hobbies": IHobbiesWithDomain[] }> (GET_HOBBIES)

    const onSubmit = () => {
        store.dispatch({
            type: ActionType.SET_HOBBIES,
            hobbies: chosenHobbies
        })
        
        navigation.navigate('SetupPicture')
    }

    const chooseHobby = (id: number) => {
        setChosenHobbies(prevHobbies => prevHobbies.concat(id))
    }

    const unchooseHobby = (id: number) => {
        setChosenHobbies(prevHobbies => prevHobbies.filter(itemId => itemId !== id))
    }

    if (loading) {
        return null
    }

    if (error) {
        console.log(error)
        return null
    }

    console.log(hobbies)

    return (
        <View style = { styles.container }>

            <View style = { styles.header }>
                <Text style = { styles.textHeader }>Complete your profile</Text>
            </View>


            <Animatable.View animation = 'fadeInUpBig' duration = { 500 } style = { styles.footer } >

            { hobbies?.Hobbies.map((hobby, index) => (
                    <HobbiesWithDomain key = { index } addHobby = { chooseHobby } removeHobby = { unchooseHobby } { ...hobby } />
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
