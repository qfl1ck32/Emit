import React from 'react'
import { Controller } from 'react-hook-form'

import Input, { InputProps } from './Input'

import * as Animatable from 'react-native-animatable'

import { Text, StyleSheet, View } from 'react-native'

import { FontAwesome, Feather } from '@expo/vector-icons'

interface StyledInputWithControllerProps extends InputProps {
    name: string,

    control: any,
    errors: any,
    dirtyFields: any,
    touchedFields: any,

    title: string,
    iconName: any,
    placeholder: string,

    featherName?: any,
    onPressFeather?: any,

    doNotChangeFeatherColor?: boolean,

    onChangeCallback?: any,

    marginBottom?: boolean,

    values: any
}

interface State {
    errors: any
}

class StyledInputWithController extends React.Component <StyledInputWithControllerProps, State> {
    constructor(props: StyledInputWithControllerProps) {
        super(props),
        this.state = {
            errors: Object.assign({}, props.errors)
        }
    }

    shouldComponentUpdate(prevProps: StyledInputWithControllerProps, prevState: State) {
        const name = this.props.name

        return  this.props.values[name] != prevProps.values[name] ||
                this.props.errors[name] != prevState.errors[name] ||
                this.props.errors[name] != prevProps.errors[name] ||
                this.props.touchedFields[name] != prevProps.touchedFields[name] ||
                this.props.dirtyFields[name] != prevProps.dirtyFields[name] ||
                this.props.secureTextEntry != prevProps.secureTextEntry
    }

    render() {
        
        return (
            <View style = { [this.props.marginBottom ? styles.marginBottom : [], styles.marginTop] }>
                <Text style = { styles.text }> { this.props.title }</Text>

                <View style = { styles.action }>
                    <FontAwesome name = { this.props.iconName } color = '#05375a' size = { 20 }/>

                    <Controller
                        control = { this.props.control }
                        name = { this.props.name }
                        render = {
                            ({ field: { onChange, onBlur, value }}) => {

                                const onChangeWrapper = (e: Event) => {
                                    this.props.onChangeCallback?.()
                                    onChange(e)
                                }

                                return (
                                    <Input
                                        placeholder = { this.props.placeholder }
                                        onChangeText = { onChangeWrapper }
                                        onBlur = { onBlur }
                                        value = { value }
                                        secureTextEntry = { this.props.secureTextEntry }
                                        onKeyPress = { this.props.onKeyPress }
                                    />
                                )
                            }
                        }
                    />
                    
                    { this.props.featherName && 
                        <Feather
                            onPress = { this.props.onPressFeather }
                            name = { this.props.featherName }
                            color = { !this.props.doNotChangeFeatherColor && (this.props.errors[this.props.name] || this.props.dirtyFields[this.props.name]) ? (this.props.errors[this.props.name] ? 'red' : 'green') : 'gray' }
                            size = { 20 }
                        />
                    }

                    
                </View>

                { this.props.errors[this.props.name] && 
                    
                    <Animatable.View animation = 'fadeInLeft' duration = { 500 }>
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