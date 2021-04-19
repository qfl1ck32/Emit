import React from 'react'

import { View, Button, StyleSheet, Alert } from 'react-native'

import signOut from '../APIs/Root/signOut'
import sendGetRequest from '../APIs/Root/sendGetRequest'

const HomeScreen = () => {

    const test = async () => {
        const resp = await sendGetRequest({})

        if (resp)
            Alert.alert('Test', resp.message)
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