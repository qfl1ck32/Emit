import React, { useState } from 'react'

import { View, Image, Button, StyleSheet } from 'react-native'

import * as Animatable from 'react-native-animatable'

import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'

import { store } from './store'
import { SetupNavigationProps } from './interfaces'
import { ActionType } from './ActionType'

const duck = require('../../assets/images/duck.jpg')

import { setup } from '../../services'

interface ImagePickerResult {
    uri: string
}

export const SetupPicture = ({ navigation }: SetupNavigationProps <'SetupPicture'>) => {

    const duckImage = Image.resolveAssetSource(duck).uri

    const [image, setImage] = useState <string> (duckImage)

    const saveImagePickerResult = async (result: ImagePicker.ImagePickerResult) => {
        const { uri } = result as ImagePickerResult

        const { base64 } = await manipulateAsync(uri, [
            {
                resize: { height: 200, width: 200 }
            }
        ],
        {
            format: SaveFormat.JPEG,
            base64: true
        })

        setImage(base64 as string)
    }

    const imagePickerSettings = {
        base64: true,
        quality: 0.8,
        allowsEditing: true,
        
    } as ImagePicker.ImagePickerOptions

    const onSubmitPress = () => {
        store.dispatch({
            type: ActionType.SET_IMAGE,
            image: image == duckImage ? null : image
        })

        setup(store.getState())

        // navigation.navigate('DoneSetup')
    }

    //FIXME add some kind of error handling
    const handleCamera = () => {
        ImagePicker.launchCameraAsync(imagePickerSettings).then(saveImagePickerResult).catch()
    }

    const handleGallery = () => {
        ImagePicker.launchImageLibraryAsync(imagePickerSettings).then(saveImagePickerResult).catch()
    }

    return (
        <View style = { styles.container }>

            <Animatable.View animation = 'fadeInUpBig' duration = { 800 } style = { styles.footer } >

                <View style = { styles.image }>
                    <Image source = { { uri: image == duckImage ? duckImage : `data:image/png;base64,${image}` } } style = { { width: 200, height: 200 } } />
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
