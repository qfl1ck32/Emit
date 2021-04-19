import React from 'react'

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Keyboard,
    Alert
} from 'react-native'

import StyledInputWithController from './StyledInputWIthController'

import PasswordStrengthMeter from './PasswordStrengthMeter'

import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'

import { useDebouncedCallback } from 'use-debounce'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { NavigationProps } from './RootStackScreen'

import {
    checkAvailableEmail as checkEmail,
    checkAvailableUsername as checkUsername
} from '../APIs/SignUp/checkAvailability'

const SignUpScreen = ( { navigation }: NavigationProps <'SignUpScreen'> ) => {

    const schema = yup.object().shape({
        username: yup.string().required('This field is required.').min(4, 'Should be at least 4 characters long.').max(32, 'Should be at most 32 characters long.'),
        email: yup.string().required('This field is required.').email('Invalid e-mail.').max(32, 'Should be at most 32 characters long.'),

        password: yup.string().required('This field is required.').min(8, 'Should be at least 8 characters long.'),
        confirmPassword: yup.string().required('This field is required.').oneOf([yup.ref('password'), null], 'Passwords do not match.')
    })

    const usernameAPIValidation = yup.object().shape({
        username: yup.string().test('is-taken', 'Username is already used.', async (username: any) => {
            return await checkUsername(username)
        })
    })

    const emailAPIValidation = yup.object().shape({
        email: yup.string().test('is-taken', 'Email is already used.', async (email: any) => {
            return await checkEmail(email)
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


        const trySignUp = await signUp(values['username'], values['email'], values['password'])

        if (trySignUp && trySignUp.error)
            return Alert.alert('Sign up', trySignUp.message)

        return navigation.navigate('LoginScreen', {
            username: values['username'],
            password: values['password']
        })
    }

    const [passwordSettings, setPasswordSettings] = React.useState({
        secureTextEntry: true,
        featherName: 'eye-off'
    })

    const [confirmPasswordSettings, setConfirmPasswordSettings] = React.useState({
        secureTextEntry: true,
        featherName: 'eye-off'
    })


    const switchShowingPassword = () => {
        setPasswordSettings({
            secureTextEntry: !passwordSettings.secureTextEntry,
            featherName: passwordSettings.featherName == 'eye'? 'eye-off' : 'eye'
        })
    }


    const switchShowingConfirmPassword = () => {
        setConfirmPasswordSettings({
            secureTextEntry: !confirmPasswordSettings.secureTextEntry,
            featherName: confirmPasswordSettings.featherName == 'eye'? 'eye-off' : 'eye'
        })
    }

    const values = getValues()

    const formProps = { errors, control, dirtyFields, values, touchedFields }

    return (
        <View style = { styles.container }>
            
            <View style = { styles.header } >
                <Text style = { styles.textHeader }>Welcome!</Text>
            </View>

            <Animatable.View animation = 'fadeInUpBig' duration = { 500 } style = { styles.footer }>

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

                <PasswordStrengthMeter password = { watch('password') || watch('confirmPassword') } />

                <View style = { styles.button }>
                    <TouchableOpacity style = { styles.signIn } onPress = { onSubmitPress }>
                        <LinearGradient style = { styles.signIn } colors = { ['#3187be', '#0d5d90'] }>
                            <Text style = { styles.textSign }>Sign up</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style = { [styles.signIn, styles.border] } onPress = { () => navigation.navigate('LoginScreen') }>
                        <Text style = { [styles.textSign, { color: 'green' }] }>Log in</Text>
                    </TouchableOpacity>
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

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },

    footer: {
        flex: 5 ,
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
        fontWeight: 'bold',
        color: 'white'
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
    },

    border: {
        borderColor: '#009387',
        borderWidth: 1,
        marginTop: 15
    }
})


export default SignUpScreen