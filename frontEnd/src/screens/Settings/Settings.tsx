import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { rootStore } from "../../Root";
import { logout } from "../../services";

export const Settings: React.FC<{}> = () => {
  const userImage = rootStore.getState().user.image;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button onPress={logout} title="Logout" />
      </View>
    </View>
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
