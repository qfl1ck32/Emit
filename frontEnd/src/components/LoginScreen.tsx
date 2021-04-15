import React from 'react'

import {
    StyleSheet,
    View,
    Text
} from 'react-native'

import StyledInput from './StyledInput'

import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'

const LoginScreen = () => {

    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        secureTextEntry: true
    })

    const switchShowingPassword = () => {
        setFormData({
        ...formData,
        secureTextEntry: !formData.secureTextEntry
    })
}

    return (
        <View style = { styles.container }>
            
            <View style = { styles.header } >
                <Text style = { styles.textHeader }>Welcome!</Text>
            </View>

            <View style = { styles.footer }>
                <StyledInput
                    text = 'E-mail'
                    iconName = 'user-o'
                    textPlaceholder = 'Your e-mail'
                    featherName = 'check-circle'
                    featherColor = 'green'  />

                <StyledInput 
                    secureTextEntry = { formData.secureTextEntry }
                    marginTop = { true }
                    text = 'Password'
                    iconName = 'lock'
                    textPlaceholder = 'Your password'
                    featherName = 'lock'
                    featherColor = 'grey'
                    
                    onPressFeather = { switchShowingPassword }/>
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
    }
})


export default LoginScreen