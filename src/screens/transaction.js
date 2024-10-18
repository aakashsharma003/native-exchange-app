import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  Alert,
  Modal,
  ActivityIndicator,
  ImageBackground,
  Share,
  Linking,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { faHeadphones } from "@fortawesome/free-solid-svg-icons";
// import Share from "react-native-share";

const backgroundImage = require("../../assets/theme1.jpg");
const QRImage = require("../../assets/QR.jpg");

const Transaction = ({ navigation }) => {
  const [transxnId, setTransxnId] = useState(
    "TKVCn8sJbrZSucivKjR992tCrLCirBNGKF"
  );
  const [message, setMessage] = useState(""); // State for message
  const [messageColor, setMessageColor] = useState(""); // State for message color
  const [phoneNumber, setPhoneNumber] = useState("+919256935027")
  const shareToWhatsApp = async () => {
   const message = "Hello, this is a test message!";

   const shareOptions = {
     title: "Share via",
     message: message,
     // Use the following line if you want to share a URL instead of just a message
     // url: 'https://your-url.com',
   };

   try {
     const result = await Share.share(shareOptions);

     if (result.action === Share.sharedAction) {
       if (result.activityType) {
         // The message was shared successfully
         setMessage("Message shared successfully!");
         setMessageColor("green");
       } else {
         // The message was dismissed
         setMessage("Share dismissed");
         setMessageColor("orange");
       }
     } else if (result.action === Share.dismissedAction) {
       setMessage("Share dismissed");
       setMessageColor("orange");
     }
   } catch (error) {
     console.error("Error sharing to WhatsApp", error);
     setMessage("Error sharing to WhatsApp");
     setMessageColor("red");
   }

   // Clear message after a delay for better user experience
   setTimeout(() => {
     setMessage("");
   }, 3000);
  };
  const { width, height } = Dimensions.get("window");
  const copyToClipboard = (id) => {
    Clipboard.setString(id);
    setMessage(`Id Copied to Clipboard!`);
    setMessageColor("green");
  };
  // const chatToNumber = (number) => {
  //   const telUrl = `tel:${number}`;
  //   Linking.openURL(telUrl).catch((err) =>
  //     console.error("Error opening dialer", err)
  //   );
  // };

  const chatToNumber = async () => {
      const text = encodeURIComponent(message);

      // Construct the WhatsApp URL
      const url = `whatsapp://send?phone=${phoneNumber}&text=${text}`;
      const fallbackUrl = `wa://send?phone=${phoneNumber}&text=${text}`; // Fallback URL

      try {
        // Attempt to open the WhatsApp URL
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          console.log("WhatsApp opened successfully");
          setFeedbackMessage("WhatsApp opened successfully!");
        } else {
          // Try the fallback URL if the first one is not supported
          const fallbackSupported = await Linking.canOpenURL(fallbackUrl);
          if (fallbackSupported) {
            await Linking.openURL(fallbackUrl);
            console.log("WhatsApp opened successfully with fallback URL");
            setMessage(
              "WhatsApp opened successfully with fallback URL!"
            );
          } else {
            setMessage("WhatsApp is not installed on this device.");
          }
        }
      } catch (error) {
        console.error("Error opening WhatsApp:", error);
        setMessage("An error occurred while trying to open WhatsApp.");
      } finally {
        // Clear the feedback message after a delay for better user experience
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
  };

  

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.image}
      resizeMode="cover"
    >
    
      <View style={styles.outerContainer}>
        <View style={styles.box}>
          <Text style={styles.uppertext}>Min Deposit: $10</Text>
          <Text style={styles.uppertext}>Use Network: TRC 20</Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.QRImageBox}>
            <Image
              source={QRImage}
              style={styles.QRImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.copyBtn}>
            <Text style={styles.copyText}>{transxnId}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(transxnId)}>
              <Icon
                name="copy"
                size={20}
                color="#fff"
                style={styles.copyIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dialButton}
          onPress={() => chatToNumber(phoneNumber)}
        >
          <View style={styles.buttonContent1}>
            <MaterialIcons
              name="headset-mic" 
              size={25}
              color="#fff"
              style={styles.icon1}
            />
            {/* <Text style={styles.buttonText}>Chat with us</Text> */}
          </View>
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          After completing the payment, please share the payment screenshot
          here.
        </Text>

        <TouchableOpacity style={styles.button} onPress={shareToWhatsApp}>
          <View style={styles.buttonContent}>
            <FontAwesome
              name="whatsapp"
              size={25}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Share on WhatsApp</Text>
          </View>
        </TouchableOpacity>

        {/* Display message with dynamic color */}
        {message ? (
          <Text style={{ ...styles.message, color: messageColor }}>
            {message}
          </Text>
        ) : null}

        <Text style={styles.lowerText}>
          Don't forget to share your transaction ID along with your bank
          details.
        </Text>
   </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
    image: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#002046",
    },
    outerContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
      width: "100%",
      padding:"10%",
      height: "100%",
      backgroundColor: "rgba(2, 0, 36, 0.8)",
    },
    QRImageBox: {
      backgroundColor: "#fff",
      width: "80%",
      borderRadius: 10,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "10%",
    },
    box: {
      backgroundColor: "#1b263b",
      padding: 20,
      borderRadius: 8,
      alignItems: "center",
      width: "80%",
    },
    dialButton: {
      backgroundColor: "#3498db", // Blue color for the dial button
      position: "absolute",
      zIndex: 1,
      bottom: "26%",
      right: 30,
      width: 60,
      height: 60,
      borderRadius: 30, // Makes it circular
      // backgroundColor: "#007bff",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, // Shadow for Android
      // padding: 16,
      // borderRadius: 5,
      // justifyContent: "center",
      // alignItems: "center",
      // marginTop: 10, // Space between buttons
    },
    qrContainer: {
      width: "100%",
      padding: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    QRImage: {
      width: "100%",
      height: 150,
    },
    copyBtn: {
      backgroundColor: "#00b09b",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    copyText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 14,
      marginRight: 10,
    },
    instructionText: {
      color: "#f1f1f1",
      textAlign: "center",
      marginVertical: 20,
      fontSize: 14,
    },
    button: {
      backgroundColor: "#25D366",
      padding: "2%",
      fontSize:'1%',
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContent1: {
      justifyContent: "center",
      alignItems: "center",
    },
    icon1: {
      alignSelf: "center",
    },
    buttonContent: {
      flexDirection: "row",
      width: "80%", // Maintain this for responsiveness
      justifyContent: "flex-start", // Change to flex-start for proper alignment
      alignItems: "center",
      marginVertical: 10, // Optional: add vertical margin for spacing between elements
    },
    icon: {
      marginRight: 10, // Add margin to the right of the icon for spacing
    },
    buttonText: {
      fontSize: 16, // Adjust font size as needed for better visibility
      color: "#fff", // Assuming text color is white
    },
    lowerText: {
      color: "#f1f1f1",
      // fontSize: 12,
      // marginTop: "5%",
      textAlign: "center",
      // position: "absolute",
      // bottom: 0, // Adjust this value as needed
      // left: 0,
      // right: 0,
      // color: "#f1f1f1", // Updated color
      fontSize: 12,
      textAlign: "center",
      paddingBottom: 5,
    },
    uppertext: {
      color: "yellow",
      fontSize: 16,
    },
    message: {
      fontSize: 14,
      fontWeight: "bold",
      marginVertical: 10,
      textAlign: "center",
    },
  });



export default Transaction;
