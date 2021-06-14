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
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { Loading, UserInfo } from "../../components";
import { GET_ALL_USERS } from "../../graphql";
import { User } from "../../graphql/types/User/User";
import { rootStore } from "../../Root";

export const EmitScreen: React.FC<{}> = () => {
  const { data, loading } = useQuery(GET_ALL_USERS);
  const [usersToEmit, setUsersToEmit] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const me = rootStore.getState().user;

  const whitelist = me.whitelist as string[];

  console.log(whitelist);

  if (!whitelist.length) {
    return (
      <View style={[styles.container, styles.header]}>
        <Text style={styles.text}>You have nobody to emit to.</Text>
      </View>
    );
  }

  const emit = () => {
    if (!usersToEmit.length) {
      return Alert.alert(
        "Whoops",
        "You did not choose any of your friends. :("
      );
    }

    if (!message) {
      return Alert.alert("Whoops", "Where is your message?");
    }
  };

  const users = data?.getAllUsers as User[];

  if (loading) {
    return <Loading />;
  }

  const filteredUsers = users.filter((user) => whitelist.includes(user._id));

  const userOnClick = (id: string) =>
    setUsersToEmit((oldUsers) => {
      if (oldUsers.includes(id)) return oldUsers.filter((_id) => id !== _id);

      return oldUsers.concat(id);
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView style={styles.scrollView}>
          {filteredUsers.map((user) => (
            <UserInfo
              isInWhitelist={usersToEmit.includes(user._id)}
              key={user._id}
              {...user}
              userOnClick={userOnClick}
            />
          ))}
        </ScrollView>

        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.message}
          placeholder="Emit message"
        />

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

  message: {
    maxHeight: 40,
    marginTop: 10,
    marginBottom: 10,
    width: "85%",
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
