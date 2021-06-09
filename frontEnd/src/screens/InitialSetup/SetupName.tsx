import React, { useEffect } from 'react'

import { View, Text, Button, StyleSheet } from 'react-native'

import * as Animatable from 'react-native-animatable'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'

import { StyledInputWithController } from '../../components/StyledInputWithController'

import { store } from './store'
import { SetupNavigationProps } from './interfaces'
import { ActionType } from './ActionType'

export const SetupName = ({ navigation }: SetupNavigationProps <'SetupName'>) => {

    const schema = yup.object().shape({
        name: yup.string().required('This field is required.')
    })

    const { control, handleSubmit, formState: { errors, dirtyFields, touchedFields }, getValues, setValue } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })

    const onSubmitPress = () => {
        handleSubmit(() => {
            store.dispatch({
                type: ActionType.SET_NAME,
                name: getValues()['name']
            })
            
            navigation.navigate('SetupHobbies')
        })()
    }

    const values = getValues()

    const formProps = { errors, control, dirtyFields, values, touchedFields }

    //TODO remove this (only for dev)
    useEffect(() => {
        setValue('name', 'Marcel')
    }, [])

    return (
        <View style = { styles.container }>

            <View style = { styles.header }>
                <Text style = { styles.textHeader }>Complete your profile</Text>
            </View>


            <Animatable.View animation = 'fadeInUpBig' duration = { 500 } style = { styles.footer } >

                <StyledInputWithController
                    title = 'Name'
                    name = 'name'
                    placeholder = 'Mark'

                    iconName = 'user'
                    color = '#FFFFFF'

                    errorColor = '#FFFFFF'

                    { ...formProps }
                />

            <View style = { styles.button }>
                <Button title = 'Continue' onPress = { onSubmitPress } />
            </View>

        </Animatable.View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a8fd0'
    },

    textHeader: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 30
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },

    footer: {
        flex: 5,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop: -150
    },

    button: {
        width: '50%',
        left: 100,
        marginTop: 25   
    }
})
