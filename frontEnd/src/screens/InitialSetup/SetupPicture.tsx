import React, { useState } from 'react'

import { View, Image, Button, StyleSheet } from 'react-native'

import * as Animatable from 'react-native-animatable'

const duck = require('../../assets/images/duck.jpg')

import * as ImagePicker from 'expo-image-picker'

import { store, ActionType, SetupNavigationProps } from './'

export const SetupPicture = ({ navigation }: SetupNavigationProps <'SetupPicture'>) => {

    const duckImage = Image.resolveAssetSource(duck).uri

    const [image, setImage] = useState <string> (duckImage)

    const onSubmitPress = () => {
        store.dispatch({
            type: ActionType.SET_PICTURE,
            picture: image
        })

        navigation.navigate('DoneSetup')
    }

    const handleCamera = () => {
        ImagePicker.launchCameraAsync().then((res: any) => {
            setImage(res.uri)
        })
    }

    const handleGallery = () => {
        ImagePicker.launchImageLibraryAsync().then((res: any) => {
            setImage(res.uri)
        })
    }

    return (
        <View style = { styles.container }>

            <Animatable.View animation = 'fadeInUpBig' duration = { 800 } style = { styles.footer } >

                <View style = { styles.image }>
                    <Image source = { { uri: image } } style = { { width: 200, height: 200 } } />
                </View>

                <View style = { styles.buttons }>
                    <Button onPress = { handleCamera } title = 'Take picture'/>
                    <Button onPress = { handleGallery } title = 'Choose from gallery'/>
                </View>

            <View style = { styles.button }>
                <Button title = { 'I\'m fine with this picture!' } onPress = { onSubmitPress } />
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

    footer: {
        flex: 5,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop: -150
    },

    button: {
        marginTop: 25   
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    image: {
        alignSelf: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 4,
        marginBottom: 12,
    }
})
