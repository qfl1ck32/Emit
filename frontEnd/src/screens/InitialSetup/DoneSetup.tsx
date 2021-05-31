import React from 'react'
import { SetupNavigationProps } from './index'
import store from './store'

import { View, Text } from 'react-native'

export const DoneSetup = ({ navigation }: SetupNavigationProps <'SetupPicture'>) => {
    console.log(store.getState())
    
    return (
       <View>
           <Text>Salut!</Text>
       </View>
    )
}
