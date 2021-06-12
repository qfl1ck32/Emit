import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import { StyleSheet } from "react-native";

import { Home } from "../Home";
import { Emit } from "../Emit";
import { Profile } from "../Profile";
import { Settings } from "../Settings";

import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

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
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "Profile",
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a8fd0",
  },

  header: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    alignItems: "flex-end",
    marginTop: 30,
  },

  text: {
    color: "white",
    fontWeight: "bold",
  },

  largerText: {
    fontSize: 24,
  },
});
