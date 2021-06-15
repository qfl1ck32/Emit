import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, Button } from "react-native";
import { connect } from "react-redux";
import { Loading, UserInfo } from "../../components";
import { GET_ALL_USERS } from "../../graphql/queries/user/getAllUsers";
import { Emit, User } from "../../graphql/types/User/User";
import { rootStore } from "../../Root";
import { MainTabNavigationProps } from "../MainTab/interfaces";

type ICurrentTab = "users" | "emits";

export const HomeComponent: React.FC<MainTabNavigationProps<"Home">> = ({
  navigation,
}) => {
  const { data, loading, error } = useQuery(GET_ALL_USERS);
  const [currentTab, setCurrentTab] = useState<ICurrentTab>("users");

  const users = data?.getAllUsers as User[];

  const me = rootStore.getState().user;

  const emits = me.emits;

  const myEmits = emits?.filter((emit) => emit.byUserId === me._id) as Emit[];
  const otherEmits = emits?.filter(
    (emit) => emit.byUserId !== me._id
  ) as Emit[];

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
            <View style={styles.buttons}>
              <Button onPress={() => setCurrentTab("users")} title="Users" />
              <Button onPress={() => setCurrentTab("emits")} title="Emits" />
            </View>

            {currentTab === "users" ? (
              <UsersTab {...{ users, userOnClick, whitelist, blacklist }} />
            ) : (
              <EmitsTab {...{ myEmits, otherEmits, users }} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const UsersTab = ({
  users,
  whitelist,
  blacklist,
  userOnClick,
}: {
  users: User[];
  whitelist: string[];
  blacklist: string[];
  userOnClick: (id: string) => void;
}) => (
  <>
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
  </>
);

const EmitsTab = ({
  myEmits,
  otherEmits,
  users,
}: {
  myEmits: Emit[];
  otherEmits: Emit[];
  users: User[];
}) => {
  const [currentlyShowing, setCurrentlyShowing] =
    useState<"myEmits" | "otherEmits">("myEmits");
  console.log(myEmits);
  console.log(users);
  return (
    <>
      <Text style={styles.textHeader}>Emits</Text>
      <ScrollView style={styles.scrollView}>
        {currentlyShowing === "myEmits" &&
          myEmits.map((emit) => (
            <Text key={emit._id as unknown as string}>Salut</Text>
          ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a8fd0",
  },

  buttons: {
    marginTop: 64,
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
