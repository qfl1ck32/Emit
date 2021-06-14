import { useQuery } from "@apollo/client";
import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { Loading, UserInfo } from "../../components";
import { GET_ALL_USERS } from "../../graphql";
import { User } from "../../graphql/types/User/User";
import { rootStore } from "../../Root";

export const EmitScreen: React.FC<{}> = () => {
  const { data, loading, error } = useQuery(GET_ALL_USERS);

  const me = rootStore.getState().user;

  const [usersToEmit, setUsersToEmit] = useState<string[]>([]);

  const emit = () => {
    console.log(usersToEmit);
  };

  const whitelist = me.whitelist as string[];

  const users = (data?.getAllUsers as User[]).filter((user) =>
    whitelist.includes(user._id)
  );

  if (loading) {
    return <Loading />;
  }

  const userOnClick = (id: string) =>
    setUsersToEmit((oldUsers) => {
      if (oldUsers.includes(id)) return oldUsers.filter((_id) => id !== _id);

      return oldUsers.concat(id);
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView style={styles.scrollView}>
          {users.map((user) => (
            <UserInfo
              isInWhitelist={usersToEmit.includes(user._id)}
              key={user._id}
              {...user}
              userOnClick={userOnClick}
            />
          ))}
        </ScrollView>
        <Button onPress={emit} title="Emit" />
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

  scrollView: {
    marginTop: 64,
    marginBottom: 0,
    width: "90%",
    height: 20,
    maxHeight: Math.min(
      320,
      (rootStore.getState()?.user?.whitelist?.length as number) * 70 || 0
    ),
  },
});

export const Emit = connect((state) => state)(EmitScreen);
