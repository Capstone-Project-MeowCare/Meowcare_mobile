import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import CreatePetStep1 from "./CreatePetStep1";
import CreatePetStep2 from "./CreatePetStep2";
import CreatePetStep3 from "./CreatePetStep3";
import CreatePetStep4 from "./CreatePetStep4";
import CreatePetStep5 from "./CreatePetStep5";
import CreatePetStep6 from "./CreatePetStep6";
import CreatePetStep7 from "./CreatePetStep7";

const { width, height } = Dimensions.get("window");

export default function CreatePet({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);

  const onSwipeLeft = () => {
    if (currentStep < 7) {
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
        return <CreatePetStep1 />;
      case 2:
        return <CreatePetStep2 onGoBack={() => setCurrentStep(1)} />;
      case 3:
        return <CreatePetStep3 onGoBack={() => setCurrentStep(2)} />;
      case 4:
        return <CreatePetStep4 onGoBack={() => setCurrentStep(3)} />;
      case 5:
        return <CreatePetStep5 onGoBack={() => setCurrentStep(4)} />;
      case 6:
        return <CreatePetStep6 onGoBack={() => setCurrentStep(5)} />;
      case 7:
        return <CreatePetStep7 onGoBack={() => setCurrentStep(6)} />;
      default:
        return <CreatePetStep1 />;
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
        {currentStep < 7 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setCurrentStep(currentStep + 1)}
          >
            <Text style={styles.nextText}>Tiếp tục</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate("ServicePayment")}
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
