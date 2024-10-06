import React from "react";
import { Text } from "react-native";

export const FieldError = ({ children, style = {}, ...props }) => {
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
};
