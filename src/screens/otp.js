import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState , useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  ActivityIndicator
} from "react-native";
const backgroundImage = require("../../assets/theme1.jpg");

const FAKE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkF1dGhlbnRpY2F0ZWQiLCJhZG1pbiI6dHJ1ZX0." +
  "TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
// const OtpScreen = ({
//   navigation,
//   route,
// }) => {
//   const [otp, setOtp] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const { email } = route.params;
//   const [loading, setLoading] = useState("");

//   const handleOtpVerification = async () => {
//     // Basic validation
//     if (!otp) {
//       setErrorMessage("Please enter the OTP.");
//       return;
//     }
//     try {
//       // API call to verify OTP
//       const response = await fetch(
//         "https://clientbackend-yzy5.onrender.com/api/v1/verify-otp",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: route.params.email, // Passing the email from params
//             otp: otp, // OTP entered by the user
//           }),
//         }
//       );
//       console.log(email, otp);
//       const data = await response.json();
//       console.log(data);

//       if (response.status === 200) {
//         // If OTP verification is successful, navigate to the home screen
//         console.log("true");
//         // setIsloggedIn(true);
//         await AsyncStorage.setItem("token", FAKE_TOKEN);
//         // const route = data.isAdmin?"admin":"home";
//         const route = data.role === "User" ? "home" : "admin";
//         navigation.reset({
//           index: 0,
//           routes: [{ name: route }],
//         });
//       } else {
//         // console.log("ayyyyyyaaa")
//         // Show an error if OTP verification fails
//         //  alert(data.message || "Invalid OTP, please try again.");
//         setErrorMessage(data.message || "Invalid OTP, please try again.");
//         //  if(cnt = 3)
//         // navigation.navigate("LoginOrRegister"); // Navigate back to the OTP input screen if needed
//       }
//     } catch (error) {
//       console.log(error)
//       // Handle any network or other errors
//       //  alert("An error occurred. Please try again.");
//       setErrorMessage("Request timeout. Please try again.");
//        navigation.reset({
//          index: 0,
//          routes: [{ name: "LoginOrRegister" }],
//        });
//     }
//   };
//    useEffect(() => {
//      const checkToken = async () => {
//        try {
//          setLoading(true);
//          const storedToken = await AsyncStorage.getItem("token");
//          if (storedToken) {
//            // If token exists, navigate to home
//            navigation.reset({
//              index: 0,
//              routes: [{ name: "home" }],
//            });
//          }
//        } catch (error) {
//          console.error("Error checking token:", error);
//        } finally {
//          setLoading(false);
//        }
//      };

//      checkToken();
//    }, []);

//   return (
//     <ImageBackground
//       source={backgroundImage}
//       style={styles.image}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>Enter OTP sent to {email}</Text>
//         <TextInput
//           placeholder="Enter OTP"
//           value={otp}
//           onChangeText={setOtp}
//           style={styles.input}
//         />
//         {errorMessage ? (
//           <Text style={styles.errorText}>{errorMessage}</Text>
//         ) : null}
//         <TouchableOpacity style={styles.button} onPress={handleOtpVerification}>
//           <Text style={styles.buttonText}>Verify OTP</Text>
//         </TouchableOpacity>

//         {/* Loader Modal */}
//         {loading && (
//           <Modal transparent={true} animationType="fade" visible={loading}>
//             <View style={styles.loaderContainer}>
//               <ActivityIndicator size="large" color="#fff" />
//             </View>
//           </Modal>
//         )}
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   image: {
//     flex: 1, // Cover the entire screen
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#002046",
//   },
//   container: {
//     width: "90%", // Make sure the container is properly aligned
//     backgroundColor: "rgba(0,0,0,0.7)", // Add semi-transparent background for readability
//     padding: 20,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center", // Added "#" to make it a valid hex color
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#fff", // Optional: Set text color for better visibility
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     color: "#fff",
//     marginBottom: 10,
//     borderRadius: 20,
//     width: "100%",
//   },
//   button: {
//     backgroundColor: "#ed2f2f",
//     padding: 10,
//     borderRadius: 20,
//     width: "100%",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   errorText: {
//     color: "red", // Error message in red
//     fontSize: 16,
//     marginBottom: 10, // Space between the error and the rest of the form
//     textAlign: "center",
//   },
// });

// export default OtpScreen;
