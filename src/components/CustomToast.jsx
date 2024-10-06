import React from "react";
import Toast from "react-native-root-toast";

const CustomToast = ({
  text = "",
  duration = 1500,
  position = 0,
  shadow = true,
  animation = true,
  hideOnPress = true,
  delay = 0,
}) => {
  Toast.show(text, {
    duration,
    position,
    shadow,
    animation,
    hideOnPress,
    delay,
  });
};

export default CustomToast;
