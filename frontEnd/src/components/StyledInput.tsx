import React from 'react'

import {
    StyleSheet,
    View,
    TextInput,
    Text,
    Platform
} from 'react-native'

import { FontAwesome, Feather } from '@expo/vector-icons'

export interface Props {
    marginTop?: boolean,
    text: string
    iconName: any,
    textPlaceholder: string,
    secureTextEntry?: boolean,
    featherName: any,
    featherColor: string,
    onChangeText?: any,
    onPressFeather?: any
}


const StyledInput = ({ marginTop, text, iconName, textPlaceholder, secureTextEntry, featherName, featherColor, onChangeText, onPressFeather } : Props) => {
    return (
        <>
            <Text style = { [styles.text, (marginTop ? styles.marginTop : [])] }>{ text }</Text>
            
            <View style = { styles.action }>
                <FontAwesome name = { iconName } color = '#05375a' size = { 20 }/>
                <TextInput onChangeText = { onChangeText }  secureTextEntry = { secureTextEntry } placeholder = { textPlaceholder } style = { styles.textInput } autoCapitalize = 'none' />
                <Feather onPress = { onPressFeather } name = { featherName } color = { featherColor } size = { 20 } />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a'
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },

    text: {
        color: '#05375a',
        fontSize: 18
    },

    marginTop: {
        marginTop: 15
    }
})

export default StyledInput