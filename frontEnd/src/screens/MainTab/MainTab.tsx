import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import { StyleSheet } from "react-native";

import { Home } from "../Home";
import { Emit } from "../Emit";
import { Profile, ProfileStack } from "../Profile";
import { Settings } from "../Settings";

import { NavigationContainer } from "@react-navigation/native";
import { MainTabParamList } from "./interfaces";

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTab: React.FC<{}> = () => {
  const materialIconProps = {
    size: 24,
    color: "#00aedc",
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: "black",
          inactiveBackgroundColor: "white",
          activeBackgroundColor: "#29dfae",
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: () => (
              <MaterialIcons name="house" {...materialIconProps} />
            ),
          }}
        />

        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{ tabBarButton: () => null }}
        />

        <Tab.Screen
          name="Emit"
          component={Emit}
          options={{
            tabBarLabel: "Emit",
            tabBarIcon: () => (
              <MaterialIcons name="signal-wifi-4-bar" {...materialIconProps} />
            ),
          }}
        />
        <Tab.Screen
          name="MyProfile"
          component={Profile}
          options={{
            tabBarLabel: "My profile",
            tabBarIcon: () => (
              <MaterialIcons name="person" {...materialIconProps} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: () => (
              <MaterialIcons name="settings" {...materialIconProps} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
