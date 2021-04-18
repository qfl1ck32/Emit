import React from 'react'

import { View, Button, StyleSheet } from 'react-native'

import { AuthContext } from './AuthContext'

const HomeScreen = () => {

    const { signOut } = React.useContext(AuthContext)

    return (
        <View style = { styles.container }>
            <Button title = 'Sign out' onPress = { signOut } />
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