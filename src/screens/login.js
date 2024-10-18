import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ActivityIndicator,
  Modal, // Modal for loader
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import the local image
const backgroundImage = require("../../assets/theme1.jpg");

const LoginScreen = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [adharNumber, setAdharNumber] = useState("");
  const [address, setAddress] = useState("");
  const [login, setLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

  const handleRegister = async () => {
    // Basic validation
    if (!email || !name || !phoneNumber || !adharNumber || !address || !password) {
      // Alert.alert("Error", "All fields are required!");
      setErrorMessage("All fields are required!");
      setTimeout(() => {
        setErrorMessage("");

      }, 2000);
      return;
    }

    // Navigate to the loader route before starting the registration request
    setLoading(true);

    try {
      // Perform the API call for registration
      const response = await fetch(
        "https://clientbackend-yzy5.onrender.com/api/v1/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone: phoneNumber,
            password,
            adhaar: adharNumber,
            address,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);

      // Handle the API response
      if (response.ok) {
        // Alert.alert("Success", "Registration successful!");

        // Reset fields after successful registration
        setEmail("");
        setName("");
        setPhoneNumber("");
        setPassword("");
        setAdharNumber("");
        setAddress("");

        // Navigate to login screen after successful registration
        setLogin(true);
        navigation.navigate("LoginOrRegister");
      } else {
        // Alert.alert(
        //   "Error",

        // );
        setErrorMessage(
          data.message || "Registration failed. Please try again."
        );
        // Optionally navigate back to the registration screen if there was an error
        // navigation.goBack();
      }
    } catch (error) {
      // Handle any network or other errors
      // Alert.alert("Error", "An error occurred. Please try again.");
      setErrorMessage("An error occurred. Please try again.");
      // navigation.goBack();
    }
  };

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      //  Alert.alert("Error", ;
      setErrorMessage("Email or password can't be empty");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    // Navigate to the loader screen
    setLoading(true);

    try {
      // API call to generate OTP
      const response = await fetch(
        "https://clientbackend-yzy5.onrender.com/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // If OTP generation is successful, navigate to the OTP verification screen
        // and pass the email and OTP as parameters
        // navigation.navigate("", { email: email });
         await AsyncStorage.setItem("token", data.token);
         // const route = data.isAdmin?"admin":"home";
         const route = data.role === "Admin" ? "admin" : "home";
         navigation.reset({
           index: 0,
           routes: [{ name: route }],
         });
      } else {
        // Show an error if OTP generation fails
        //  Alert.alert(
        //    "Error",
        //    data.message || "Failed to generate OTP. Please try again."
        //  );
        setErrorMessage(data.message || "Invalid OTP, please try again.");

        //  navigation.goBack(); // Navigate back to the login screen if needed
      }
    } catch (error) {
      // Handle any network or other errors
      //  Alert.alert("Error", );
      setErrorMessage("Request timeout. Please try again.");

      navigation.goBack();
    }finally{
      setLoading(false);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        setLoading(true);
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          // If token exists, navigate to home
          navigation.reset({
            index: 0,
            routes: [{ name: "home" }],
          });
        }
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        setLoading(false);
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
      <View style={styles.outerContainer}>
        {login ? (
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Login</Text>

            {/* Email Input with Icon */}
            <View style={styles.inputContainer}>
              <Icon
                name="email"
                size={20}
                color="#595716"
                style={styles.icon}
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#595716" style={styles.icon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible} // Toggle visibility
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={20}
                  color="#595716"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>login</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.buttonText}>
                Don’t have an account?{" "}
                <Text
                  style={styles.registerText}
                  onPress={() => setLogin(false)}
                >
                  Register
                </Text>
              </Text>
            </TouchableOpacity>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Register</Text>

            {/* Name Input with Icon */}
            <View style={styles.inputContainer}>
              <Icon
                name="person"
                size={20}
                color="#595716"
                style={styles.icon}
              />
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>

            {/* Phone Number Input with Icon */}
            <View style={styles.inputContainer}>
              <Icon
                name="phone"
                size={20}
                color="#595716"
                style={styles.icon}
              />
              <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            {/* Email Input with Icon */}
            <View style={styles.inputContainer}>
              <Icon
                name="email"
                size={20}
                color="#595716"
                style={styles.icon}
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#595716" style={styles.icon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible} // Toggle visibility
                style={styles.input}
              />
              {/* <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={20}
                  color="#595716"
                />
              </TouchableOpacity> */}
            </View>

            {/* Aadhar Card Input with Icon */}
            <View style={styles.inputContainer}>
              <Icon
                name="credit-card"
                size={20}
                color="#595716"
                style={styles.icon}
              />
              <TextInput
                placeholder="Aadhar Card Number (12 digits)"
                value={adharNumber}
                onChangeText={setAdharNumber}
                keyboardType="numeric"
                maxLength={12}
                style={styles.input}
              />
            </View>

            {/* Address Input with Icon */}
            <View style={styles.inputContainer}>
              <Icon name="home" size={20} color="#595716" style={styles.icon} />
              <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
              />
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.buttonText}>
                Already have an account?{" "}
                <Text
                  style={styles.registerText}
                  onPress={() => setLogin(true)}
                >
                  Login here
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Loader Modal */}
        {loading && (
          <Modal transparent={true} animationType="fade" visible={loading}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
  },
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  errorText: {
    color: "red", // Error message in red
    fontSize: 16,
    marginBottom: 10, // Space between the error and the rest of the form
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 24,
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#7C7C7C", // Added a white background for better visibility
  },
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.49)", // Adjusted transparency for better readability
    width: "90%",
    maxWidth: 400,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#002046",
  },
  title: {
    color: "#f3ce09",
    fontSize: 30,
    fontWeight: "bold", // Changed font property to fontWeight for consistency
    marginBottom: 20,
  },
  input: {
    color: "#fff",
    flex: 1, // Allow input to take up remaining space
    height: "100%", // Match the height of the input container
    borderColor: "transparent", // Remove border for a cleaner look
    paddingHorizontal: 10, // Add padding for text
    fontSize: 16,
    borderBottomColor: "gray",
    padding: 10,
  },
  button: {
    backgroundColor: "#ed2f2f",
    padding: 10,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    marginTop: 10, // Added margin for spacing
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  registerText: {
    color: "blue",
  },
});

export default LoginScreen;