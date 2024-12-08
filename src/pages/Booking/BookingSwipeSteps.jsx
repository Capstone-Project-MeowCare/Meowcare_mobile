import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import BookingStep1 from "./BookingStep1";
import BookingStep2 from "./BookingStep2";
import BookingStep3 from "./BookingStep3";
import BookingStep4 from "./BookingStep4";
import BookingStep5 from "./BookingStep5";
import { useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function SwipeStep({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const [additionalServices, setAdditionalServices] = useState([]);
  const route = useRoute();
  const sitterId = route.params?.sitterId;
  useEffect(() => {
    console.log("SwipeStep received sitterId:", sitterId);
  }, [sitterId]);

  // State lưu thông tin từ Step 1
  const [step1Info, setStep1Info] = useState({
    selectedService: "Gửi thú cưng tại nhà người chăm sóc",
    selectedServiceId: "",
    selectedFood: "NATURAL CORE Bene Chicken Salmon",
    isChecked: false,
    selectedLocation: "Tỉnh/Thành phố",
    isCustomFoodChecked: false,
    customFood: "",
    childServices: [],
    selectedAdditionalServices: [],
  });
  const [selectedExtras, setSelectedExtras] = useState([]);
  // State lưu thông tin từ Step 2
  const [step2Info, setStep2Info] = useState({
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });

  // State lưu thông tin từ Step 3
  const [step3Info, setStep3Info] = useState({
    selectedCats: [],
    isChecked: false,
  });

  // State lưu thông tin từ Step 4
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phoneNumber: "",
    note: "",
  });

  // State lưu thông tin từ Step 5 (checkbox)
  const [step5Checked, setStep5Checked] = useState(false);

  // const onSwipeLeft = () => {
  //   if (currentStep < 5 && isValid) {
  //     setCurrentStep(currentStep + 1);
  //   }
  // };
  const onSwipeLeft = () => {
    if (currentStep === 2) {
      if (step2Info.startDate && !step2Info.endDate) {
        setStep2Info((prev) => ({ ...prev, endDate: prev.startDate })); // Gán endDate = startDate
      }
    }
    if (currentStep < 5 && isValid) {
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
          <BookingStep1
            step1Info={step1Info}
            setStep1Info={setStep1Info}
            setIsValid={setIsValid}
            selectedExtras={selectedExtras}
            setSelectedExtras={setSelectedExtras}
            additionalServices={additionalServices} // Truyền vào đây nếu cần
            setAdditionalServices={setAdditionalServices} // Thêm dòng này
            userId={sitterId}
          />
        );
      case 2:
        return (
          <BookingStep2
            step2Info={step2Info}
            setStep2Info={setStep2Info}
            setIsValid={setIsValid}
            onGoBack={() => setCurrentStep(1)}
            step1Info={step1Info}
          />
        );
      case 3:
        return (
          <BookingStep3
            step3Info={step3Info}
            setStep3Info={setStep3Info}
            setIsValid={setIsValid}
            onGoBack={() => setCurrentStep(2)}
            step1Info={step1Info}
          />
        );
      case 4:
        return (
          <BookingStep4
            onGoBack={() => setCurrentStep(3)}
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            setIsValid={setIsValid}
          />
        );
      case 5:
        return (
          <BookingStep5
            onGoBack={() => setCurrentStep(4)}
            step5Checked={step5Checked}
            setStep5Checked={setStep5Checked}
          />
        );
      default:
        return <BookingStep1 setIsValid={setIsValid} />;
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
        )}
        {currentStep === 5 && (
          <TouchableOpacity
            style={[styles.nextButton, !step5Checked && styles.disabledButton]}
            onPress={() => {
              if (step5Checked) {
                console.log(
                  "Final step1Info:",
                  JSON.stringify(step1Info, null, 2)
                );
                navigation.navigate("ServicePayment", {
                  step1Info: {
                    ...step1Info,
                    additionalServices: step1Info.additionalServices.map(
                      (service) => ({
                        ...service,
                        ...(step1Info.selectedServiceTime?.[service.id] || {}), // Gộp startTime và endTime
                      })
                    ),
                  },
                  selectedExtras: selectedExtras.filter(
                    (extra) => extra.isSelected
                  ),
                  step2Info,
                  step3Info,
                  contactInfo,
                  sitterId,
                });
              }
            }}
            disabled={!step5Checked}
          >
            <Text
              style={[
                styles.nextText,
                !step5Checked && styles.disabledNextText,
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
