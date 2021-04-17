import React from 'react'

import {
    StyleSheet,
    View,
    Text,
    Button,
    Keyboard,
    TextInput
} from 'react-native'

import StyledInputWithController from './StyledInputWIthController'

import PasswordStrengthMeter from './PasswordStrengthMeter'

import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'

import { useDebouncedCallback } from 'use-debounce'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import axios from 'axios'

import IP from '../assets/serverIP.json'

const LoginScreen = () => {

    const schema = yup.object().shape({
        username: yup.string().required('This field is required.').min(4, 'Should be at least 4 characters long.').max(32, 'Should be at most 32 characters long.'),
        email: yup.string().required('This field is required.').email('Invalid e-mail.').max(32, 'Should be at most 32 characters long.'),

        password: yup.string().required('This field is required.').min(8, 'Should be at least 8 characters long.'),
        confirmPassword: yup.string().required('This field is required.').oneOf([yup.ref('password'), null], 'Passwords do not match.')
    })

    const usernameAPIValidation = yup.object().shape({
        username: yup.string().test('is-taken', 'Username is already used.', async (username: any) => {
            return (await axios.post(`${IP}/checkUsernameTaken`, { username })).data
        })
    })

    const emailAPIValidation = yup.object().shape({
        email: yup.string().test('is-taken', 'Email is already used.', async (email: any) => {
            return (await axios.post(`${IP}/checkEmailTaken`, { email })).data
        })
    })


    const checkAvailableUsername = async () => {
        if (!errors['username'])
            return await validate('username')
    }

    const checkAvailableEmail = async () => {
        if (!errors['email'])
            return await validate('email')
    }


    const validate = async (field: string) => {
        try {
            await (field == 'username' ? usernameAPIValidation : emailAPIValidation).validate({
                [field]: watch(field)
            })
        }

        catch(err) {
            setError(field, {
                message: err.message
            })

            return false
        }

        return true
    }

    const { control, handleSubmit, formState: { errors, dirtyFields, touchedFields }, getValues, setError, watch } = useForm({
        resolver: yupResolver(schema),
        mode: 'all'
    })
    

    const onSubmitPress = () => {
        Keyboard.dismiss()
        handleSubmit(onSubmit)()
    }

    const onSubmit = async (values: object) => {

        const checkUsername = await validate('username')
        const checkEmail = await validate('email')

        if (!(checkUsername && checkEmail))
            return

        const response = await axios.post(`${IP}/signup`, values)
        const data = response.data

        if (data.error)
            return setMessage({
                show: true,
                message: data.message
            })

        // add logic for going back to login screen + create login screen
    }

    const [passwordSettings, setPasswordSettings] = React.useState({
        secureTextEntry: true,
        featherName: 'lock'
    })

    const [message, setMessage] = React.useState({
        show: false,
        message: ''
    })

    const switchShowingPassword = () => {
        setPasswordSettings({
            secureTextEntry: !passwordSettings.secureTextEntry,
            featherName: passwordSettings.featherName == 'lock'? 'unlock' : 'lock'
        })
    }

    const [confirmPasswordSettings, setConfirmPasswordSettings] = React.useState({
        secureTextEntry: true,
        featherName: 'lock'
    })

    const switchShowingConfirmPassword = () => {
        setConfirmPasswordSettings({
            secureTextEntry: !confirmPasswordSettings.secureTextEntry,
            featherName: confirmPasswordSettings.featherName == 'lock'? 'unlock' : 'lock'
        })
    }

    const values = getValues()

    const formProps = { errors, control, dirtyFields, values, touchedFields }

    return (
        <View style = { styles.container }>
            
            <View style = { styles.header } >
                <Text style = { styles.textHeader }>Welcome!</Text>
            </View>

            <View style = { styles.footer }>

                <StyledInputWithController
                    title = 'Username'
                    name = 'username'
                    placeholder = 'funnyguy23'

                    iconName = 'user-o'
                    featherName = 'check-circle'

                    onKeyPress = { useDebouncedCallback(checkAvailableUsername, 500) }

                    { ...formProps }
                />


                <StyledInputWithController
                    title = 'Email'
                    name = 'email'
                    placeholder = 'imsofunny@haha.com'

                    iconName = 'envelope'
                    featherName = 'check-circle'

                    onKeyPress = { useDebouncedCallback(checkAvailableEmail, 500) }

                    { ...formProps }
                />

                <StyledInputWithController
                    title = 'Password'
                    name = 'password'
                    placeholder = '●●●●●●●●'

                    iconName = 'lock'
                    featherName = { passwordSettings.featherName }
                    secureTextEntry = { passwordSettings.secureTextEntry }

                    onPressFeather = { switchShowingPassword }

                    { ...formProps }
                />

                <StyledInputWithController
                    title = 'Confirm password'
                    name = 'confirmPassword'
                    placeholder = '●●●●●●●●'

                    iconName = 'lock'
                    featherName = { confirmPasswordSettings.featherName }
                    secureTextEntry = { confirmPasswordSettings.secureTextEntry }

                    onPressFeather = { switchShowingConfirmPassword }

                    { ... formProps}

                    marginBottom
                />

                <Button title = 'Sign up' onPress = { onSubmitPress } />

                { message.show && 
                    <View style = { styles.message }>
                        <Text style = { styles.error }>
                            { message.message }
                        </Text>
                    </View>
                }

            </View>

        </View>
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#009387'
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },

    footer: {
        flex: 3,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },

    textHeader: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 30
    },

    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    textFooter: {
        color: '#05375a',
        fontSize: 18
    },

    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    button: {
        alignItems: 'center',
        marginTop: 50
    },

    error: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold'
    },

    message: {
        textAlign: 'center',
        flex: 1,
        marginTop: 5
    }
})


export default LoginScreen