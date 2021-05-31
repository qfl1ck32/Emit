import React from 'react'

import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import { Splash, Login, SignUp } from '../index'

export type RootStackParamList = {
    SplashScreen: undefined,

    LoginScreen: {
        username?: any,
        password?: any
    } | undefined,

    SignUpScreen: undefined
}

export type RootNavigationProps <T extends keyof RootStackParamList> = StackScreenProps <RootStackParamList, T>

const RootStack = createStackNavigator <RootStackParamList> ()

export const Root: React.FC <{}> = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator headerMode = 'none'>
                <RootStack.Screen name = 'SplashScreen' component = { Splash } />

                <RootStack.Screen name = 'LoginScreen' component = { Login } />

                <RootStack.Screen name = 'SignUpScreen' component = { SignUp } />
            </RootStack.Navigator>
        </NavigationContainer>
    )
}
