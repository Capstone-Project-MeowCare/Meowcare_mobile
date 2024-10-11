import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import BookingStep1 from "./BookingStep1";
import BookingStep2 from "./BookingStep2";

const { width, height } = Dimensions.get("window");

export default function SwipeStep({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);

  const onSwipeLeft = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onSwipeRight = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BookingStep1 />;
      case 2:
        return <BookingStep2 onGoBack={() => setCurrentStep(1)} />; // Truyền onGoBack để quay lại step 1
      default:
        return <BookingStep1 />;
    }
  };

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={styles.container}
    >
      {renderStep()}
      <View style={styles.fixedFooter}>
        {currentStep === 1 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setCurrentStep(2)}
          >
            <Text style={styles.nextText}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
        {currentStep === 2 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.nextText}>Hoàn thành</Text>
          </TouchableOpacity>
        )}
      </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  fixedFooter: {
    width: width,
    height: height * 0.067,
    backgroundColor: "#FFE3D5",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    width: width,
    height: height * 0.067,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE3D5",
  },
  nextText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#902C6C",
  },
});
