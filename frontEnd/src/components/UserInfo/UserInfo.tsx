import { User as IUser } from "../../graphql/types/User/User";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import React from "react";
import { rootStore } from "../../Root";
import { LinearGradient } from "expo-linear-gradient";

interface UserInfoMethod {
  userOnClick: (id: string) => void;
}

export const UserInfo = ({
  username,
  image,
  _id,
  userOnClick,
}: IUser & UserInfoMethod) => {
  return (
    <TouchableOpacity onPress={() => userOnClick(_id)} style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: `data:image/jpg;base64,${image}`,
        }}
      />
      <Text style={styles.name}>{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 18,
    borderColor: "white",
    borderRadius: 8,
    borderWidth: 2,
    padding: 2,
  },

  name: {
    fontSize: 18,
    color: "white",
    textAlignVertical: "center",
    marginLeft: 18,
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
  },
});
