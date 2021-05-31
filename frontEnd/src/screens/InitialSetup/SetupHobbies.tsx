import React, { useEffect, useState } from 'react'

import { View, Text, Button, StyleSheet, FlatList } from 'react-native'

import * as Animatable from 'react-native-animatable'

import { store } from './store'
import { SetupNavigationProps } from './interfaces'
import { ActionType } from './ActionType'

import { getHobbies } from '../../APIs/Setup/getHobbies'

const renderItem = ({ item }: any) => {
    console.log(item)
    return (
        <Text>{ item.title }</Text>
    )
}

export const SetupHobbies = ({ navigation }: SetupNavigationProps <'SetupName'>) => {

    const [hobbies, setHobbies] = useState([])

    useEffect(() => {
        getHobbies().then(hobbies => {
            console.log('dap')
            console.log(hobbies)
            setHobbies(hobbies)
        })
    }, [])

    const onSubmit = () => {
        store.dispatch({
            type: ActionType.SET_HOBBIES,
            hobbies: []
        })
        
        navigation.navigate('SetupPicture')
    }

    return (
        <View style = { styles.container }>

            <View style = { styles.header }>
                <Text style = { styles.textHeader }>Complete your profile</Text>
            </View>


            <Animatable.View animation = 'fadeInUpBig' duration = { 500 } style = { styles.footer } >

            <FlatList data = { hobbies } renderItem = { renderItem } />

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
