import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { View, Button } from "react-native";

import { SetupName } from "./SetupName";
import { SetupPicture } from "./SetupPicture";
import { SetupHobbies } from "./SetupHobbies";
import { DoneSetup } from "./DoneSetup";

import { logout } from "../../services";

import { SetupStackParamList } from "./interfaces";

const SetupStack = createStackNavigator<SetupStackParamList>();

export const Setup: React.FC<{}> = () => {
  return (
    <NavigationContainer>
      <SetupStack.Navigator
        headerMode="float"
        screenOptions={{
          title: "",
          headerStyle: {
            backgroundColor: "#2a8fd0",
          },
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              <Button onPress={logout} title="Sign out" />
            </View>
          ),
        }}
      >
        <SetupStack.Screen name="SetupName" component={SetupName} />
        <SetupStack.Screen name="SetupHobbies" component={SetupHobbies} />
        <SetupStack.Screen name="SetupPicture" component={SetupPicture} />
        <SetupStack.Screen name="DoneSetup" component={DoneSetup} />
      </SetupStack.Navigator>
    </NavigationContainer>
  );
};
