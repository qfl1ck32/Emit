import { StackScreenProps } from '@react-navigation/stack'

export type SetupStackParamList = {
    SetupName: undefined,
    SetupPicture: undefined,
    SetupHobbies: undefined,
    DoneSetup: undefined
}

export type SetupNavigationProps <T extends keyof SetupStackParamList> = StackScreenProps <SetupStackParamList, T>
