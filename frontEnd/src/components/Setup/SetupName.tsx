import React from 'react'

import { View, Text, Button, StyleSheet } from 'react-native'

import { NavigationProps } from '../SetupStackScreen'

import * as Animatable from 'react-native-animatable'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'

import StyledInputWithController from '../StyledInputWIthController'

const SetupName = ({ navigation }: NavigationProps <'SetupName'>) => {
    const schema = yup.object().shape({
        name: yup.string().required('This field is required.')
    })

    const { control, handleSubmit, formState: { errors, dirtyFields, touchedFields }, getValues } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })

    const onSubmitPress = () => {
        handleSubmit(() => navigation.navigate('SetupPicture'))()
    }

    const values = getValues()

    const formProps = { errors, control, dirtyFields, values, touchedFields }

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
        marginTop: 25   
    }
})

export default SetupName