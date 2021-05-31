import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import { RootStackParamList } from './interfaces'

import { Splash } from '../Splash'
import { Login } from '../Login'
import { SignUp } from '../SignUp'

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
