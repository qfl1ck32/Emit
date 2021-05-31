import React from 'react'

import { ProgressBar } from 'react-native-paper'
import { View, Text, StyleSheet } from 'react-native'

import { PasswordStrengthChecker } from './PasswordStrengthChecker'

interface Props {
    password: string
}

interface State {
    color: string,
    message: String,
    progress: number
}


export class PasswordStrengthMeter extends React.PureComponent <Props, State> {

    constructor(props: Props) {
        super(props),
        this.state = {
            color: 'lightgreen',
            message: '',
            progress: 0
        }
    }

    componentDidUpdate() {
        this.setState(PasswordStrengthChecker.getInstance().getStrength(this.props.password))
    }

    render() {
        return (
            <View style = { styles.container } >
                <ProgressBar style = { { height: 16 } } color = { this.state.color } progress = { this.state.progress }/>
                <Text style = { [styles.text, { color: this.state.color } ] }> { this.state.message } </Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        marginTop: 8
    },

    text: {
        textAlign: 'right'
    }
})
