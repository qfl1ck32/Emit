import { StackScreenProps } from "@react-navigation/stack";

interface ProfileParams {
  id: string;
}

export type MainTabParamList = {
  Profile: ProfileParams;
  Home: undefined;
  Emit: undefined;
  MyProfile: undefined;
  Settings: undefined;
  ProfileStack: {
    screen: "Profile";
    params?: ProfileParams;
  };
};

export type MainTabNavigationProps<T extends keyof MainTabParamList> =
  StackScreenProps<MainTabParamList, T>;
