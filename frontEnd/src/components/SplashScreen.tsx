import React from 'react'

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { MaterialIcons } from '@expo/vector-icons'

const SplashScreen = ( { navigation:  { navigate } } ) => {
    return (
        <View style = { styles.container }>
            <View style = { styles.header }>
                <Animatable.Image
                    source = { require('../assets/images/logo.png') }
                    style = { styles.logo }
                    resizeMode = 'contain' 
                    animation = 'bounceIn'
                    duration = { 1500 }
                />
            </View>

            <Animatable.View style = { styles.footer } animation = 'fadeInUpBig' duration = { 500 }>
                <Text style = { [styles.text, styles.largerText] }>
                    Get started
                </Text>

                <View style = { styles.button }>
                    <TouchableOpacity onPress = { () => navigate('LoginScreen') }>
                        <LinearGradient colors = { ['#3187be', '#0d5d90'] }  style = { styles.signIn }>
                            <Text style = { styles.text }>
                                Log in
                            </Text>
                            <MaterialIcons name = 'navigate-next' color = '#FFF' size = { 20 }/>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

const { height } = Dimensions.get("screen")

const logoSize = height * 0.28

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a8fd0'
      },

      logo: {
          width: logoSize,
          height: logoSize
      },

      header: {
          flex: 2,
          justifyContent: 'center',
          alignItems: 'center'
      },

      footer: {
          flex: 1,
          backgroundColor: '#143d55',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingVertical: 50,
          paddingHorizontal: 30
      },

      button: {
          alignItems: 'flex-end',
          marginTop: 30
      },

      signIn: {
          width: 150,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 50,
          flexDirection: 'row'
      },

      text: {
          color: 'white',
          fontWeight: 'bold'
      },

      largerText: {
          fontSize: 16
      }
})

export default SplashScreen