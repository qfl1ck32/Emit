import { useQuery } from "@apollo/client";
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import { UserInfo } from "../../components";
import { client } from "../../graphql";
import { ADD_TO_WHITELIST } from "../../graphql/mutations/user";
import { GET_ALL_USERS } from "../../graphql/queries/user/getAllUsers";
import { User } from "../../graphql/types/User/User";
import { ActionType, rootStore } from "../../Root";

export const HomeComponent: React.FC<{}> = () => {
  const { data, loading, error } = useQuery(GET_ALL_USERS);

  const addToWhitelist = async (id: string) => {
    await client.mutate({
      mutation: ADD_TO_WHITELIST,
      variables: {
        id,
      },
    });

    rootStore.dispatch({
      type: ActionType.ADD_TO_WHITELIST,
      userId: id,
    });
  };

  const users = data?.getAllUsers as User[];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView style={styles.scrollView}>
          {!loading &&
            !error &&
            users.map((user, index) => (
              <UserInfo addToWhitelist={addToWhitelist} key={index} {...user} />
            ))}
        </ScrollView>
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
    borderColor: "red",
    borderWidth: 2,
    flexGrow: 1,
    marginTop: 128,
    marginBottom: 128,
    width: "90%",
  },

  footer: {
    flex: 3,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  textHeader: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 30,
  },

  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  textFooter: {
    color: "#05375a",
    fontSize: 18,
  },

  login: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  button: {
    alignItems: "center",
    marginTop: 15,
  },

  error: {
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
  },

  message: {
    textAlign: "center",
    flex: 0,
    marginTop: 15,
  },

  border: {
    borderColor: "#009387",
    borderWidth: 1,
    marginTop: 15,
  },
});

export const Home = connect((state) => state)(HomeComponent);
