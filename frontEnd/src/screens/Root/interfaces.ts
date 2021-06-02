import { StackScreenProps } from '@react-navigation/stack'

export type RootStackParamList = {
    SplashScreen: undefined,

    LoginScreen: {
        username?: any,
        password?: any
    } | undefined,

    SignUpScreen: undefined
}

export type RootNavigationProps <T extends keyof RootStackParamList> = StackScreenProps <RootStackParamList, T>