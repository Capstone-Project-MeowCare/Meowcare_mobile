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
import BookingStep3 from "./BookingStep3";
import BookingStep4 from "./BookingStep4"; // Add Step 4
import BookingStep5 from "./BookingStep5"; // Add Step 5

const { width, height } = Dimensions.get("window");

export default function SwipeStep({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);

  const onSwipeLeft = () => {
    if (currentStep < 5) {
      // Set limit to 5 steps
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
        return <BookingStep2 onGoBack={() => setCurrentStep(1)} />;
      case 3:
        return <BookingStep3 onGoBack={() => setCurrentStep(2)} />;
      case 4:
        return <BookingStep4 onGoBack={() => setCurrentStep(3)} />;
      case 5:
        return <BookingStep5 onGoBack={() => setCurrentStep(4)} />;
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
        {currentStep < 5 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setCurrentStep(currentStep + 1)}
          >
            <Text style={styles.nextText}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
        {currentStep === 5 && (
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
