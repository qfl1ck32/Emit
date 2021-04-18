import React from 'react'

import { View, Button, StyleSheet } from 'react-native'

import signOut from './Root/signOut'
import sendGetRequest from './Root/sendGetRequest'

const HomeScreen = () => {

    const test = async () => {
        const resp = await sendGetRequest({})

        console.log(resp)
    }

    return (
        <View style = { styles.container }>
            <Button title = 'Sign out' onPress = { signOut } />
            <Button title = 'Test restricted API' onPress = { test } />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2a8fd0'
    }
})

export default HomeScreen