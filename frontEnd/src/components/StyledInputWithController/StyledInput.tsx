import React from 'react'

import {
    StyleSheet,
    TextInput,
    Platform
} from 'react-native'

export interface InputProps {
    placeholder: string,
    secureTextEntry?: boolean,

    onChangeText?: any,
    onBlur?: any,
    onKeyPress?: any,

    value?: any,

    color?: string
}

export const StyledInput: React.FC <InputProps> = ( { onBlur, value, onChangeText, secureTextEntry, placeholder, onKeyPress, color } ) => (
    <TextInput
        onBlur = { onBlur }
        value = { value }
        onChangeText = { onChangeText } 
        secureTextEntry = { secureTextEntry }
        placeholder = { placeholder }
        style = { [styles.textInput, { color: color || '#000000' }] }
        autoCapitalize = 'none'
        onKeyPress = { onKeyPress }
    />
)

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 0 : -12,
        paddingLeft: 10
    }
})
