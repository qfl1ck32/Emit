import React from "react";
import { Controller } from "react-hook-form";

import { StyledInput, InputProps } from "./StyledInput";

import * as Animatable from "react-native-animatable";

import { Text, StyleSheet, View } from "react-native";

import { FontAwesome, Feather } from "@expo/vector-icons";

interface StyledInputWithControllerProps extends InputProps {
  name: string;

  control: any;
  errors: any;
  dirtyFields: any;
  touchedFields: any;

  title: string;
  iconName: any;
  placeholder: string;

  featherName?: any;
  onPressFeather?: any;

  doNotChangeFeatherColor?: boolean;

  marginBottom?: boolean;

  values: any;

  color?: string;

  errorColor?: string;
}

interface State {
  errors: any;
}

export class StyledInputWithController extends React.Component<
  StyledInputWithControllerProps,
  State
> {
  constructor(props: StyledInputWithControllerProps) {
    super(props),
      (this.state = {
        errors: Object.assign({}, props.errors),
      });
  }

  shouldComponentUpdate(
    prevProps: StyledInputWithControllerProps,
    prevState: State
  ) {
    const name = this.props.name;

    return (
      this.props.values[name] != prevProps.values[name] ||
      this.props.errors[name] != prevState.errors[name] ||
      this.props.errors[name] != prevProps.errors[name] ||
      this.props.touchedFields[name] != prevProps.touchedFields[name] ||
      this.props.dirtyFields[name] != prevProps.dirtyFields[name] ||
      this.props.secureTextEntry != prevProps.secureTextEntry
    );
  }

  render() {
    return (
      <View
        style={[
          this.props.marginBottom ? styles.marginBottom : [],
          styles.marginTop,
        ]}
      >
        <Text style={[styles.text, { color: this.props.color || "#000000" }]}>
          {" "}
          {this.props.title}
        </Text>

        <View style={styles.action}>
          <FontAwesome name={this.props.iconName} color="#05375a" size={20} />

          <Controller
            control={this.props.control}
            name={this.props.name}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <StyledInput
                  placeholder={this.props.placeholder}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={this.props.secureTextEntry}
                  onKeyPress={this.props.onKeyPress}
                  color={this.props.color}
                />
              );
            }}
          />

          {this.props.featherName && (
            <Feather
              onPress={this.props.onPressFeather}
              name={this.props.featherName}
              color={
                !this.props.doNotChangeFeatherColor &&
                (this.props.errors[this.props.name] ||
                  this.props.dirtyFields[this.props.name])
                  ? this.props.errors[this.props.name]
                    ? "red"
                    : "green"
                  : "gray"
              }
              size={20}
            />
          )}
        </View>

        {this.props.errors[this.props.name] && (
          <Animatable.View
            style={styles.errorView}
            animation="fadeInLeft"
            duration={500}
          >
            <Text
              style={[
                styles.error,
                { color: this.props.errorColor || "#FF0033" },
              ]}
            >
              {this.props.errors[this.props.name].message}
            </Text>
          </Animatable.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorView: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  error: {
    fontWeight: "bold",
    fontSize: 14,
  },

  marginBottom: {
    marginBottom: 15,
  },

  text: {
    fontSize: 18,
  },

  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },

  marginTop: {
    marginTop: 15,
  },
});

export default StyledInputWithController;