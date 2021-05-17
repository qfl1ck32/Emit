import React from 'react'

import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'

import SplashScreen from './SplashScreen'
import LoginScreen from './LoginScreen'
import SignUpScreen from './SignUpScreen'

export type RootStackParamList = {
    SplashScreen: undefined,

    LoginScreen: {
        username?: any,
        password?: any
    } | undefined,

    SignUpScreen: undefined
}

export type NavigationProps <T extends keyof RootStackParamList> = StackScreenProps <RootStackParamList, T>

const RootStack = createStackNavigator <RootStackParamList> ()

const RootStackScreen: React.FC <{}> = () => {
    return (
        <RootStack.Navigator headerMode = 'none'>
            <RootStack.Screen name = 'SplashScreen' component = { SplashScreen } />

            <RootStack.Screen name = 'LoginScreen' component = { LoginScreen } />

            <RootStack.Screen name = 'SignUpScreen' component = { SignUpScreen } />
        </RootStack.Navigator>
    )
}

export default RootStackScreen