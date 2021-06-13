import { useQuery } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  FlatListProps,
} from "react-native";
import { connect } from "react-redux";
import { GET_USER } from "../../graphql";
import { User } from "../../graphql/types/User/User";
import { rootStore } from "../../Root";
import {
  addToBlacklist,
  addToWhitelist,
  removeFromBlacklist,
  removeFromWhitelist,
} from "../../services";
import { MainTabNavigationProps } from "../MainTab/interfaces";

export const ProfileComponent: React.FC<MainTabNavigationProps<"Profile">> = ({
  route,
}) => {
  const me = rootStore.getState().user;
  const myId = me._id;

  const userId = route.params?.id || myId;

  const { data, loading, error } = useQuery(GET_USER, {
    variables: {
      id: userId,
    },
  });

  const user = data?.getUser as User;

  const itsMe = route.params?.id === undefined;

  const { whitelist, blacklist } = me;

  const isInWhitelist = whitelist?.includes(userId);
  const isInBlacklist = blacklist?.includes(userId);

  const AddWhitelistButton = (
    <ButtonD title="Add to whitelist" onPress={() => addToWhitelist(userId)} />
  );
  const AddBlacklistButton = (
    <ButtonD title="Add to blacklist" onPress={() => addToBlacklist(userId)} />
  );

  const RemoveWhitelistButton = (
    <ButtonD
      title="Remove from whitelist"
      onPress={() => removeFromWhitelist(userId)}
    />
  );
  const RemoveBlacklistButton = (
    <ButtonD
      title="Remove from blacklist"
      onPress={() => removeFromBlacklist(userId)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: route.params?.id ? 0 : 64 }]}>
      <View style={styles.header}>
        {!loading && !error && (
          <View style={styles.profile}>
            <View style={styles.imageAndUsername}>
              <Image
                style={styles.image}
                source={{
                  uri: `data:image/jpg;base64,${user.image}`,
                  height: 64,
                  width: 64,
                }}
              />
              <Text style={styles.name}>{user.username}</Text>
            </View>

            <ScrollView style={styles.scrollView} horizontal={true}>
              <FlatList
                data={user.hobbies}
                renderItem={renderHobby}
                keyExtractor={(item) => item.title}
              />
            </ScrollView>

            <View style={styles.buttons}>
              {!itsMe &&
                (!isInWhitelist && !isInBlacklist ? (
                  <>
                    {AddWhitelistButton}
                    {AddBlacklistButton}
                  </>
                ) : isInWhitelist ? (
                  RemoveWhitelistButton
                ) : isInBlacklist ? (
                  RemoveBlacklistButton
                ) : (
                  AddWhitelistButton
                ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const renderHobby = ({ item }: { item: { title: string } }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>{item.title}</Text>
    </View>
  );
};

const ButtonD = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => (
  <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
    <LinearGradient
      style={styles.linearGradient}
      colors={["#3187be", "#0d5d90"]}
    >
      <Text style={styles.text}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#2a8fd0",
  },

  buttons: {
    flex: 15,
  },

  linearGradient: {
    padding: 4,
  },

  item: {},

  imageAndUsername: {
    flexDirection: "row",
  },

  name: {
    fontSize: 26,
    color: "white",
    textAlignVertical: "center",
    marginLeft: 18,
    marginTop: 8,
  },

  scrollView: {},

  image: {
    width: 128,
    height: 128,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
  },

  profile: {
    flex: 1,
    marginTop: 32,
    marginLeft: 32,
    alignSelf: "flex-start",
  },

  header: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "white",
    fontWeight: "bold",
  },

  touchableOpacity: {
    alignSelf: "center",
    marginLeft: "auto",
  },
});

export const Profile = connect((state) => state)(ProfileComponent);
