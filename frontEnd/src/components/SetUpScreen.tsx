import React from 'react'

import { View, StyleSheet, Text } from 'react-native'

const SetUpScreen = () => {

    return (
        <View style = { styles.container }>
            <Text>Hi!</Text>
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

export default SetUpScreen