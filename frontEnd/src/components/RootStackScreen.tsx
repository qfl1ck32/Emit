import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import SplashScreen from './SplashScreen'
import LoginScreen from './LoginScreen'

const RootStack = createStackNavigator()

const RootStackScreen = () => {
    return (
        <RootStack.Navigator headerMode = 'none'>
            <RootStack.Screen name = 'SplashScreen' component = { SplashScreen } />
            <RootStack.Screen name = 'LoginScreen' component = { LoginScreen } />
        </RootStack.Navigator>
    )
}

export default RootStackScreen