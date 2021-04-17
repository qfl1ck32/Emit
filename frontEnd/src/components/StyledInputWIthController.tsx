import React from 'react'
import { Controller } from 'react-hook-form'

import Input, { InputProps } from './Input'

import * as Animatable from 'react-native-animatable'

import { Text, StyleSheet, View, Button } from 'react-native'

import { FontAwesome, Feather } from '@expo/vector-icons'

export interface StyledInputWithControllerProps extends InputProps {
    name: string,

    control: any,
    errors: any,
    dirtyFields: any,

    title: string,
    iconName: any,
    placeholder: string,

    featherName: any,
    onPressFeather?: any,

    marginBottom?: boolean
}

const StyledInputWithController: React.FC <StyledInputWithControllerProps> = ( { name, control, errors, dirtyFields, secureTextEntry, title, iconName, placeholder, featherName, onPressFeather, marginBottom } ) => (
    <View style = { [marginBottom ? styles.marginBottom : [], styles.marginTop] }>
        <Text style = { styles.text }> { title }</Text>

        <View style = { styles.action }>
            <FontAwesome name = { iconName } color = '#05375a' size = { 20 }/>

            <Controller
                control = { control }
                name = { name }
                render = {
                    ({ field: { onChange, onBlur, value }}) => 
                        <Input
                            placeholder = { placeholder }
                            onChangeText = { onChange }
                            onBlur = { onBlur }
                            value = { value }
                            secureTextEntry = { secureTextEntry }
                        />
                }
            />
            
            <Feather
                onPress = { onPressFeather }
                name = { featherName }
                color = { errors[name] || dirtyFields[name] ? (errors[name] ? 'red' : 'green') : 'gray' }
                size = { 20 }
            />

            
        </View>

        { errors[name] && 
            
            <Animatable.View animation = 'fadeIn' duration = { 500 }>
                <Text style = { styles.error }>
                    { errors[name].message }
                </Text>
            </Animatable.View>
        }

    </View>
)

const styles = StyleSheet.create({
    error: {
        color: 'red'
    },

    success: {
        color: 'green'
    },

    marginBottom: {
        marginBottom: 15
    },
   
    text: {
        color: '#05375a',
        fontSize: 18
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },

    marginTop: {
        marginTop: 15
    }
})


export default StyledInputWithController