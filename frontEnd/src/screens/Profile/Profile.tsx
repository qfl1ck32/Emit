import { useQuery } from "@apollo/client";
import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { GET_MY_IMAGE } from "../../graphql";

export const Profile: React.FC<{}> = () => {
  const { data, loading, error } = useQuery(GET_MY_IMAGE);

  if (!loading && !error) {
    console.log(data.getMyImage);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {!loading && !error && (
          <View>
            <Text>Avem!</Text>
            <Image
              source={{
                uri: `data:image/jpg;base64,${data.getMyImage}`,
                height: 64,
                width: 64,
              }}
            />
          </View>
        )}
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
