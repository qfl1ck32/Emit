import React from 'react'

import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import { View, Button } from 'react-native'

import SetupName from './Setup/SetupName'
import SetupPicture from './Setup/SetupPicture'

export type SetupStackParamList = {
    SetupName: undefined,

    SetupPicture: undefined
}

import signOut from '../APIs/Root/signOut'

export type NavigationProps <T extends keyof SetupStackParamList> = StackScreenProps <SetupStackParamList, T>

const SetupStack = createStackNavigator <SetupStackParamList> ()

const SetupStackScreen: React.FC <{}> = () => {
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

            </SetupStack.Navigator>
        </NavigationContainer>
    )
}

export default SetupStackScreen