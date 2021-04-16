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

    value?: any,
}

const StyledInput: React.FC <InputProps> = ( { onBlur, value, onChangeText, secureTextEntry, placeholder } ) => (
    <TextInput
        onBlur = { onBlur }
        value = { value }
        onChangeText = { onChangeText } 
        secureTextEntry = { secureTextEntry }
        placeholder = { placeholder }
        style = { styles.textInput }
        autoCapitalize = 'none'
    />
)

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a'
    }
})

export default StyledInput