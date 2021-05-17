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

import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'

import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { NavigationProps } from './RootStackScreen'

import signIn from '../APIs/Root/signIn'

const LoginScreen = ( { navigation, route } : NavigationProps <'LoginScreen'> ) => {

    const schema = yup.object().shape({
        username: yup.string().required('This field is required.'),
        password: yup.string().required('This field is required.')
    })

    const { control, handleSubmit, formState: { errors, dirtyFields, touchedFields }, getValues, setValue } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })

    React.useEffect(() => {
        setValue('username', route?.params?.username)
        setValue('password', route?.params?.password)
    }, [route?.params])

    const onSubmitPress = () => {
        Keyboard.dismiss()
        handleSubmit(onSubmit)()
    }

    const onSubmit = async (values: FieldValues) => {

        const trySign = await signIn(values['username'], values['password'])

        if (trySign && trySign.error)
            Alert.alert('Sign in', trySign.message)
    }

    const [passwordSettings, setPasswordSettings] = React.useState({
        secureTextEntry: true,
        featherName: 'eye-off'
    })

    const switchShowingPassword = () => {
        setPasswordSettings({
            secureTextEntry: !passwordSettings.secureTextEntry,
            featherName: passwordSettings.featherName == 'eye'? 'eye-off' : 'eye'
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

                    doNotChangeFeatherColor

                    { ...formProps }
                />

                <View style = { styles.button }>
                    <TouchableOpacity style = { styles.signIn } onPress = { onSubmitPress }>
                        <LinearGradient style = { styles.signIn } colors = { ['#3187be', '#0d5d90'] }>
                            <Text style = { styles.textSign }>Sign in</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style = { [styles.signIn, styles.border] } onPress = { () => navigation.navigate('SignUpScreen') }>
                        <Text style = { [styles.textSign, { color: 'green' }] }>Sign up</Text>
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
        marginTop: 15
    },

    error: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold'
    },

    message: {
        textAlign: 'center',
        flex: 0,
        marginTop: 15
    },

    border: {
        borderColor: '#009387',
        borderWidth: 1,
        marginTop: 15
    }
})


export default LoginScreen