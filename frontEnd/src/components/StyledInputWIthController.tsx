import React from 'react'
import { Controller } from 'react-hook-form'

import Input, { InputProps } from './Input'

import * as Animatable from 'react-native-animatable'

import { Text, StyleSheet, View } from 'react-native'

import { FontAwesome, Feather } from '@expo/vector-icons'

export interface StyledInputWithControllerProps extends InputProps {
    name: string,

    control: any,
    errors: any,
    dirtyFields: any,
    touchedFields: any,

    title: string,
    iconName: any,
    placeholder: string,

    featherName: any,
    onPressFeather?: any,

    marginBottom?: boolean,

    values: any
}

class StyledInputWithController extends React.Component <StyledInputWithControllerProps> {
    constructor(props: StyledInputWithControllerProps) {
        super(props)
    }

    shouldComponentUpdate(nextProps: StyledInputWithControllerProps) {
        const name = this.props.name

        const ans = this.props.values[name] != nextProps.values[name] ||
                this.props.errors[name] != nextProps.errors[name] ||
                this.props.touchedFields[name] != nextProps.touchedFields[name] ||
                this.props.dirtyFields[name] != nextProps.dirtyFields[name] ||
                this.props.secureTextEntry != nextProps.secureTextEntry

        console.log(name + ' | ' + ans)
        return ans
    }

    render() {
        
        //console.log(this.props.values)
        
        return (
            <View style = { [this.props.marginBottom ? styles.marginBottom : [], styles.marginTop] }>
                <Text style = { styles.text }> { this.props.title }</Text>

                <View style = { styles.action }>
                    <FontAwesome name = { this.props.iconName } color = '#05375a' size = { 20 }/>

                    <Controller
                        control = { this.props.control }
                        name = { this.props.name }
                        render = {
                            ({ field: { onChange, onBlur, value}}) => 
                                <Input
                                    placeholder = { this.props.placeholder }
                                    onChangeText = { onChange }
                                    onBlur = { onBlur }
                                    value = { value }
                                    secureTextEntry = { this.props.secureTextEntry }
                                />
                        }
                    />

                    <Feather
                        onPress = { this.props.onPressFeather }
                        name = { this.props.featherName }
                        color = { this.props.errors[this.props.name] || this.props.dirtyFields[this.props.name] ? (this.props.errors[this.props.name] ? 'red' : 'green') : 'gray' }
                        size = { 20 }
                    />
                </View>

                { this.props.errors[this.props.name] && 
                    
                    <Animatable.View animation = 'fadeIn' duration = { 500 }>
                        <Text style = { styles.error }>
                            { this.props.errors[this.props.name].message }
                        </Text>
                    </Animatable.View>
                }

            </View>
        )
    }
}


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