import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { postData } from "../../api/api";
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
  const [isValid, setIsValid] = useState(false);

  // Tạo các state lưu trữ thông tin từ từng bước
  const [step1Info, setStep1Info] = useState({
    petName: "",
    species: "",
  });
  const [step2Info, setStep2Info] = useState({
    breed: "",
  });
  const [step3Info, setStep3Info] = useState({
    weight: "",
  });
  const [step4Info, setStep4Info] = useState({
    gender: "",
  });
  const [step5Info, setStep5Info] = useState({
    age: "",
  });
  const [step6Info, setStep6Info] = useState({
    description: "",
    medicalConditions: [],
  });
  const [step7Info, setStep7Info] = useState({
    profilePicture: "",
  });

  // Hàm gọi API tạo pet
  const createPetProfile = async () => {
    const petProfileData = {
      petName: step1Info.petName,
      species: step1Info.species,
      breed: step2Info.breed,
      weight: parseInt(step3Info.weight),
      gender: step4Info.gender,
      age: parseInt(step5Info.age),
      description: step6Info.description,
      medicalConditions: step6Info.medicalConditions.map(
        ({ id, conditionName }) => ({
          id,
          conditionName,
        })
      ),
      profilePicture: step7Info.profilePicture,
    };

    try {
      const response = await postData("/pet-profiles", petProfileData);
      if (response) {
        console.log("Pet profile created successfully", response);
        navigation.navigate("MyPets"); // Chuyển hướng về MyPets
      }
    } catch (error) {
      console.error("Error creating pet profile:", error);
      console.log("Response status:", error.response?.status);
      console.log("Response data:", error.response?.data);
    }
  };

  const onSwipeLeft = () => {
    if (currentStep < 7 && isValid) {
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
        return (
          <CreatePetStep1
            step1Info={step1Info}
            setStep1Info={setStep1Info}
            setIsValid={setIsValid}
          />
        );
      case 2:
        return (
          <CreatePetStep2
            step2Info={step2Info}
            setStep2Info={setStep2Info}
            setIsValid={setIsValid}
            onGoBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <CreatePetStep3
            step3Info={step3Info}
            setStep3Info={setStep3Info}
            setIsValid={setIsValid}
            onGoBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <CreatePetStep4
            step4Info={step4Info}
            setStep4Info={setStep4Info}
            setIsValid={setIsValid}
            onGoBack={() => setCurrentStep(3)}
          />
        );
      case 5:
        return (
          <CreatePetStep5
            step5Info={step5Info}
            setStep5Info={setStep5Info}
            setIsValid={setIsValid}
            onGoBack={() => setCurrentStep(4)}
          />
        );
      case 6:
        return (
          <CreatePetStep6
            step6Info={step6Info}
            setStep6Info={setStep6Info}
            setIsValid={setIsValid}
            onGoBack={() => setCurrentStep(5)}
          />
        );
      case 7:
        return (
          <CreatePetStep7
            step7Info={step7Info}
            setStep7Info={setStep7Info}
            setIsValid={setIsValid}
            onGoBack={() => setCurrentStep(6)}
          />
        );
      default:
        return <CreatePetStep1 setIsValid={setIsValid} />;
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
            style={[styles.nextButton, !isValid && styles.disabledButton]}
            onPress={() => {
              if (isValid) {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={!isValid}
          >
            <Text
              style={[styles.nextText, !isValid && styles.disabledNextText]}
            >
              Tiếp tục
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.nextButton,
              !step7Info.profilePicture && styles.disabledButton,
            ]}
            onPress={() => {
              if (step7Info.profilePicture) {
                createPetProfile(); // Gọi hàm tạo hồ sơ pet khi nhấn "Hoàn thành"
              }
            }}
            disabled={!step7Info.profilePicture}
          >
            <Text
              style={[
                styles.nextText,
                !step7Info.profilePicture && styles.disabledNextText,
              ]}
            >
              Hoàn thành
            </Text>
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
  disabledButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  disabledNextText: {
    color: "rgba(0, 8, 87, 0.5)",
  },
});
