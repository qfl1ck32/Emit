import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Profile } from "./Profile";
import { View, Button } from "react-native";
import {
  MainTabNavigationProps,
  MainTabParamList,
} from "../MainTab/interfaces";

const ProfileStackNav = createStackNavigator<MainTabParamList>();

export const ProfileStack: React.FC<MainTabNavigationProps<"ProfileStack">> = ({
  navigation,
}) => {
  return (
    <ProfileStackNav.Navigator
      headerMode="float"
      screenOptions={{
        title: "",
        headerStyle: {
          backgroundColor: "#2a8fd0",
        },
        headerLeft: () => (
          <View style={{ marginLeft: 8 }}>
            <Button onPress={() => navigation.goBack()} title="Back" />
          </View>
        ),
      }}
    >
      <ProfileStackNav.Screen name="Profile" component={Profile} />
    </ProfileStackNav.Navigator>
  );
};
