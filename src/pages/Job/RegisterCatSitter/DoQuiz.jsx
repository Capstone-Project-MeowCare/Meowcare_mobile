import React, { useState, useEffect  } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const questions = [
  { id: 1, question: 'Câu hỏi 1', answers: ['Đáp án 1', 'Đáp án 2', 'Đáp án 3'] },
  { id: 2, question: 'Câu hỏi 2', answers: ['Đáp án 1', 'Đáp án 2', 'Đáp án 3'] },
  { id: 3, question: 'Câu hỏi 3', answers: ['Đáp án 1', 'Đáp án 2', 'Đáp án 3'] },
  { id: 4, question: 'Câu hỏi 4', answers: ['Đáp án 1', 'Đáp án 2', 'Đáp án 3'] },
  // Thêm nhiều câu hỏi ở đây
];
export default function DoQuiz({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Dừng timer khi component bị hủy
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answerIndex });
  };
  const confirmSubmit = () => {
    Alert.alert(
      "Kết thúc bài kiểm tra", // Tiêu đề thông báo
      "Bạn có chắc chắn muốn kết thúc kiểm tra không?", // Nội dung thông báo
      [
        {
          text: "Không", // Nút 'No'
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Có", // Nút 'Yes'
          onPress: () => navigation.navigate("Kết quả bài kiểm tra"), // Điều hướng tới trang kết quả khi nhấn 'Yes'
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kiểm tra</Text>
      </View>

      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Hiển thị thời gian */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Thời gian còn lại: {formatTime(timeLeft)}</Text>
      </View>
      {/* Vuốt lên xuống */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
     {/* Nội dung chính */}
     <View style={styles.formContainer}>
        <Text style={styles.questionText}>
          {questions[currentQuestionIndex].question}
        </Text>
        {questions[currentQuestionIndex].answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={selectedAnswers[currentQuestionIndex] === index ? styles.selectedAnswer : styles.answer}
            onPress={() => handleAnswer(index)}
          >
            <Text>{answer}</Text>
          </TouchableOpacity>
        ))}

          {/* Nút "Quay lại" và "Next" */}
          <View style={styles.navigation}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious} disabled={currentQuestionIndex === 0}>
            <Text style={currentQuestionIndex === 0 ? styles.disabledText : styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
            <Text style={currentQuestionIndex === questions.length - 1 ? styles.disabledText : styles.buttonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị danh sách câu hỏi đã làm */}
        {/* Hiển thị danh sách câu hỏi đã làm */}
        <View style={styles.questionList}>
          {questions.map((q, index) => (
            <TouchableOpacity
              key={index}
              style={
                currentQuestionIndex === index
                  ? styles.currentQuestion // Màu bạc cho câu hỏi hiện tại
                  : selectedAnswers[index] !== undefined
                  ? styles.completedQuestion // Màu xanh cho câu đã hoàn thành
                  : styles.questionItem
              }
              onPress={() => setCurrentQuestionIndex(index)}
            >
              <Text>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
     </View> 
      </ScrollView>   
      <TouchableOpacity style={styles.continueButton}  onPress={confirmSubmit}>
        <Text style={styles.continueButtonText}>Nộp bài kiểm tra</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    textAlign: "center",
    flex: 1,
  },
  divider: {
    borderBottomColor: "#D3D3D3", // Màu của đường kẻ ngang
    borderBottomWidth: 1, // Độ dày của đường kẻ   
  }, 
  formContainer: {
    backgroundColor: "#FFFAF5",
    paddingBottom: 20,
  },
  timerContainer: { padding: 20, backgroundColor: '#FDD7D7', alignItems: 'center' },
  timerText: { color: '#902C6C', fontSize: 20 },
 scrollContent: { paddingVertical: 20, paddingHorizontal: 15 },
  questionText: { fontSize: 18, marginBottom: 20 },
  answer: { padding: 10, borderWidth: 1, borderRadius: 5, marginVertical: 5 },
  selectedAnswer: { padding: 10, borderWidth: 1, borderRadius: 5, marginVertical: 5, backgroundColor: 'green' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  navButton: { padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
  buttonText: { fontSize: 16, color: '#000' },
  disabledText: { fontSize: 16, color: '#999' },
  questionList: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 },
  questionItem: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, justifyContent: 'center', alignItems: 'center', margin: 5 },
  completedQuestion: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', margin: 5 },
  currentQuestion: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'silver', justifyContent: 'center', alignItems: 'center', margin: 5 },
  continueButton: {
    backgroundColor: "#FDD7D7",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  continueButtonText: {
    fontSize: 16,
    color: "#902C6C",
    fontWeight: "bold",
  },
});
