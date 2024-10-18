import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import background images
const backgroundImage = require("../../assets/theme1.jpg");
const backgroundImage2 = require("../../assets/theme3.jpg");

const HomeScreen = ({ navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false); // Loading state
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");

  const { width, height } = Dimensions.get("window"); // Get device dimensions

  // Navigate to the transaction screen
  const handleSell = () => {
    navigation.navigate("transaction");
  };

  // Handle logout
  const handleLogout = async () => {
    console.log("Logging out...");
    setLoading(true);
    await AsyncStorage.removeItem("token");
    // setToken(null);
    // setIsloggedIn(false);
    // setTimeout(() => {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginOrRegister" }],
      });
    // }, 2000);
    // console.log("Navigation reset to LoginOrRegister");
  };

  // Show modal for adding a bank account
  const handleAddBankAccount = () => {
    setModalVisible(true);
  };

  // Handle bank account submission
    const handleSubmit = async () => {
      const payload = {
        accountHolder,
        accountNumber,
        ifscCode,
        bankName,
      };

      try {
        setSubmissionMessage("Wait...");
        const response = await fetch(
          "https://clientbackend-yzy5.onrender.com/api/v1/bankdetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        // const jsondata = await response.json(); 
        // const jsondata = wait response.json();
        // console.log("ok", jsondata);

        if (response.ok) {
          // Display success message
          setSubmissionMessage("Bank details submitted successfully!");
          
          // Resetting the input fields
          setAccountHolder("");
          setAccountNumber("");
          setIfscCode("");
          setBankName("");

          // Close the modal after submission
          setModalVisible(false);
        } else {
          throw new Error("Failed to submit bank details");
        }
      } catch (error) {
        console.error("Error submitting bank details:", error);
        setSubmissionMessage(
          "Failed to submit bank details. Please try again."
        );
      }
    };



  // Check for authentication token on component mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginOrRegister" }],
          });
        }
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        setLoading(false); // Stop loading after checking token
      }
    };

    checkToken();
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.image}
      resizeMode="cover"
      onLoad={() => console.log("Image loaded")}
      onError={() => console.log("Error loading image")}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Icon name="sign-out" size={30} color="#f3ce09" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddBankAccount}
        >
          <Text style={styles.addbtntext}>+ Add Bank</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.innerbox}>
          <Text style={styles.title}>Currency Exchange</Text>
          <Text style={styles.price}>$ Today's Price</Text>
        </View>

        <View style={styles.box}>
          <ImageBackground
            source={backgroundImage2}
            style={styles.image2}
            resizeMode="cover"
            onLoad={() => console.log("Image loaded")}
            onError={() => console.log("Error loading image")}
          >
            <View style={styles.logo}>
              <View style={styles.icon}>
                <View style={styles.infoCir4le}>
                  <Icon name="info-circle" size={20} color="#FFD700" />
                </View>
                <Text style={styles.boxTitle}>Pursa Exchange</Text>
              </View>
            </View>
            <View>
              <Text style={styles.exchangeRate}>1 USDT = 102 INR</Text>
            </View>
            <TouchableOpacity style={styles.sellButton} onPress={handleSell}>
              <Text style={styles.buttonText}>$ Sell USDT</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={["rgba(0,0,0,1)", "rgba(246,191,9,1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalView}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="times" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Bank Account</Text>
              <TextInput
                style={styles.input}
                placeholder="Account Holder"
                placeholderTextColor="#ccc"
                value={accountHolder}
                onChangeText={setAccountHolder}
              />
              <TextInput
                style={styles.input}
                placeholder="Account Number"
                placeholderTextColor="#ccc"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="IFSC Code"
                placeholderTextColor="#ccc"
                value={ifscCode}
                onChangeText={setIfscCode}
              />
              <TextInput
                style={styles.input}
                placeholder="Bank Name"
                placeholderTextColor="#ccc"
                value={bankName}
                onChangeText={setBankName}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              {submissionMessage && (
                <Text
                  style={{
                    color: submissionMessage.includes("successfully")
                      ? "green"
                      : "red",
                    fontWeight: "bold",
                    marginTop: 10,
                    textAlign: "center", // Center the text
                  }}
                >
                  {submissionMessage}
                </Text>
              )}
            </LinearGradient>
          </View>
        </Modal>

        <View style={styles.footerContainer}>
          <View style={styles.termsContainer}>
            <View style={styles.infoCircle}>
              <Icon name="info-circle" size={20} color="#FFD700" />
            </View>
            <Text style={styles.footerText}>
              It's 100% safe and secure wallet. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1, // Ensures the container takes full screen
    justifyContent: "center", // Center the modal vertically
    alignItems: "center", // Center the modal horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Background color for loading screen
  },
  image: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#002046",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    width: "100%",
  },
  iconButton: {
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#f3ce09",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  addbtntext: {
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  innerbox: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  price: {
    fontSize: 32,
    color: "#FFD700",
  },
  box: {
    height: 200,
    width: 300,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, // For Android el
  },
  image2: {
    flex: 1,
    padding: "8%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  logo: {
    alignItems: "center",
    padding: 4,
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
  },
  boxTitle: {
    fontSize: 23,
    color: "#FFD700",
    marginLeft: 10,
  },
  exchangeRate: {
    fontSize: 13,
    color: "#fff",
    marginBottom: 15,
  },
  sellButton: {
    backgroundColor: "hsl(0, 85%, 63%)",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  modalView: {
    width: "80%", // Restrict width to 80% of the screen
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#f3ce09",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    marginLeft: 5,
  },
  infoCircle: {
    backgroundColor: "rgba(246, 191, 9, 0.2)",
    borderRadius: 50,
    padding: 5,
    marginRight: 5,
  },
});

export default HomeScreen;
