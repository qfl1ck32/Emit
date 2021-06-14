import { useQuery } from "@apollo/client";
import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { connect } from "react-redux";
import { Loading, UserInfo } from "../../components";
import { GET_ALL_USERS } from "../../graphql/queries/user/getAllUsers";
import { User } from "../../graphql/types/User/User";
import { rootStore } from "../../Root";
import { MainTabNavigationProps } from "../MainTab/interfaces";

export const HomeComponent: React.FC<MainTabNavigationProps<"Home">> = ({
  navigation,
}) => {
  const { data, loading, error } = useQuery(GET_ALL_USERS);

  const users = data?.getAllUsers as User[];

  const me = rootStore.getState().user;

  const whitelist = me.whitelist as string[];
  const blacklist = me.blacklist as string[];

  const userOnClick = (id: string) => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: {
        id,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {loading || error ? (
          <Loading />
        ) : (
          <View>
            <Text style={styles.textHeader}>Users</Text>
            <ScrollView style={styles.scrollView}>
              {users.map((user) => (
                <UserInfo
                  isInWhitelist={whitelist?.includes(user._id)}
                  isInBlacklist={blacklist?.includes(user._id)}
                  key={user._id}
                  {...user}
                  userOnClick={userOnClick}
                />
              ))}
            </ScrollView>
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

  scrollView: {
    flex: 1,
    marginTop: 64,
    marginBottom: 48,
    width: "90%",
  },

  textHeader: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 30,
    paddingTop: 64,
  },
});

export const Home = connect((state) => state)(HomeComponent);
