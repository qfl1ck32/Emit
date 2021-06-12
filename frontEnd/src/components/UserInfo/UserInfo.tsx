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

interface UserMethods {
  addToWhitelist: (id: string) => void;
}

export const UserInfo = ({
  username,
  image,
  _id,
  addToWhitelist,
}: IUser & UserMethods) => {
  const user = rootStore.getState().user;

  const { whitelist, blacklist } = user;

  const isInWhitelist = whitelist?.includes(_id);
  const isInBlacklist = blacklist?.includes(_id);

  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: `data:image/jpg;base64,${image}`,
          }}
        />
        <Text style={styles.name}>{username}</Text>

        {!isInWhitelist && (
          <Button
            onPress={() => addToWhitelist(_id)}
            title="Add to whitelist"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 18,
  },

  name: {
    fontSize: 18,
    color: "white",
    textAlignVertical: "center",
    marginLeft: 18,
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
  },
});
