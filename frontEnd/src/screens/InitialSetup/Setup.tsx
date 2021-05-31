import React, { useState } from 'react'

import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import { View, Button } from 'react-native'

import { SetupName, SetupPicture, DoneSetup } from './index'

export type SetupStackParamList = {
    SetupName: undefined,
    SetupPicture: undefined,
    DoneSetup: undefined
}

import signOut from '../../APIs/Root/signOut'

export type SetupNavigationProps <T extends keyof SetupStackParamList> = StackScreenProps <SetupStackParamList, T>

const SetupStack = createStackNavigator <SetupStackParamList> ()

export const Setup: React.FC <{}> = () => {

    return (
        <NavigationContainer>
            <SetupStack.Navigator headerMode = 'float' screenOptions = { {
                title: '',
                headerStyle: {
                    backgroundColor: '#2a8fd0'
                },
                headerRight: () => (
                    <View style = { { marginRight: 8} }>
                        <Button onPress = { signOut } title = 'Sign out' />
                    </View>
                )
            } }>

                <SetupStack.Screen name = 'SetupName' component = { SetupName } />
                <SetupStack.Screen name = 'SetupPicture' component = { SetupPicture } />
                <SetupStack.Screen name = 'DoneSetup' component = { DoneSetup } />

            </SetupStack.Navigator>
        </NavigationContainer>
    )
}
