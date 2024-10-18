import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";


const UserItem = ({ user, onViewDetails }) => (
  <View style={styles.userItem}>
    <Text style={styles.userName}>{user.name}</Text>
    <Text style={styles.userDetail}>Email: {user.email}</Text>
    <Text style={styles.userDetail}>Phone No: {user.phone}</Text>
    <Text style={styles.userDetail}>address: {user.address}</Text>
    <TouchableOpacity
      style={[styles.viewDetailsButton]}
      onPress={() => onViewDetails(user)}
    >
      <Text style={styles.buttonText}>View Bank Details</Text>
    </TouchableOpacity>
  </View>
);

const AdminPanel = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loader
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear AsyncStorage
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginOrRegister" }], // Reset to LoginRegister screen
      });
      // console.log("ho gya logout ");
    } catch (error) {
      setError("Error during logout Please try again later");
      console.error("Error during logout:", error);
    }
  };
  const selectImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      if (result.type === "success") {
        setImageUri(result.uri);
        setErrorMessage(""); // Reset error message on successful image selection
      } else {
        console.log("Document selection was cancelled.");
      }
    } catch (error) {
      console.error("Error selecting document:", error);
      setErrorMessage("Failed to select document");
    }
  };

  const handleViewDetails = (user) => {
    const userBankDetails = bankDetails.find(
      (detail) => detail._id === user._id
    );
    setSelectedUser(user);
    setSelectedBankDetails(userBankDetails || null); // Handle missing details
    setShowBankDetailsModal(true);
  };

  const handleSubmitAdmin = async () => {
    // Reset error message
    setErrorMessage("");

    // Ensure the transaction ID and QR code are provided
    if (!transactionId || !imageUri) {
      setErrorMessage("Transaction ID and QR code are required.");
      return;
    }

    setIsSubmitting(true); // Show submission loader
    try {
      // Example API request to submit transaction ID and QR code
      const response = await fetch("YOUR_BACKEND_API_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          qrCodeUri: imageUri, // Sending the image URI as QR code
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      // Handle success (e.g., show success message or clear fields)
      Alert.alert("Success", "Data submitted successfully!");
      setTransactionId("");
      setImageUri(null);
    } catch (error) {
      setErrorMessage(error.message); // Display error message if the request fails
    } finally {
      setIsSubmitting(false); // Stop submission loader
      setShowAdminModal(false); // Close the modal
    }
  };

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      try {
        setLoading(true); // Start loading

        // Check if token exists in AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          // Navigate to login screen if token doesn't exist
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginOrRegister" }],
          });
          return; // Exit the function to avoid fetching data
        }

        // Token exists, proceed to fetch data
        await fetchData();
      } catch (error) {
        console.error("Error checking token or fetching data:", error);
        setError("Failed to authenticate or load data. Please try again.");
      } finally {
        setLoading(false); // Stop loading in both success and failure cases
      }
    };

    const fetchData = async () => {
      try {
        // Fetch users
        const userResponse = await fetch(
          "https://clientbackend-yzy5.onrender.com/api/v1/users"
        );
        const usersData = await userResponse.json();

        // Fetch bank details
        const bankResponse = await fetch(
          "https://clientbackend-yzy5.onrender.com/api/v1/bankdetails"
        );
        const bankData = await bankResponse.json();

        setUsers(usersData);
        setBankDetails(bankData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      }
    };
    
    checkTokenAndFetchData();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/theme1.jpg")}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Users Detail</Text>
        </View>
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <UserItem user={item} onViewDetails={handleViewDetails} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />

        <TouchableOpacity
          onPress={() => setShowAdminModal(true)}
          style={styles.adminButton}
        >
          <Icon name="cog" size={25} color="#fff" />
          <Text style={styles.adminButtonText}>Admin Options</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Loader Modal */}
      <Modal transparent visible={loading || isSubmitting} animationType="fade">
        <View style={styles.loaderBackground}>
          <ActivityIndicator size="large" color="#f3ce09" />
          <Text style={styles.loaderText}>
            {loading ? "Loading..." : "Submitting..."}
          </Text>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showBankDetailsModal}
        animationType="slide"
        onRequestClose={() => setShowBankDetailsModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bank Details</Text>
            {selectedBankDetails ? (
              <>
                <Text>Account Number: {selectedBankDetails.accountNumber}</Text>
                <Text>IFSC Code: {selectedBankDetails.ifscCode}</Text>
                <Text>Bank Name: {selectedBankDetails.bankName}</Text>
              </>
            ) : (
              <Text style={styles.notSubmittedText}>Not submited yet</Text>
            )}

            <TouchableOpacity
              onPress={() => setShowBankDetailsModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showAdminModal}
        animationType="slide"
        onRequestClose={() => setShowAdminModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Admin Panel</Text>
            <TextInput
              style={styles.input}
              placeholder="Change Transaction ID"
              value={transactionId}
              onChangeText={setTransactionId}
            />
            <Button title="Change QR" onPress={selectImage} />
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{ width: 100, height: 100 }}
              />
            )}
            <TouchableOpacity
              onPress={handleSubmitAdmin}
              style={styles.submitButton}
              disabled={isSubmitting} // Disable button while submitting
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <TouchableOpacity
              onPress={() => setShowAdminModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Icon
                name="sign-out"
                size={20}
                color="#fff"
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row", // Aligns icon and text horizontally
    alignItems: "center", // Centers items vertically
    justifyContent: "center", // Centers both icon and text horizontally within the button
    backgroundColor: "#FF4C4C", // Red background color
    padding: 10,
    borderRadius: 5,
    marginTop: 20, // Spacing from other components
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutIcon: {
    marginRight: 10, // Space between icon and text
  },
  logoutText: {
    color: "#FFFFFF", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderText: { marginTop: 10, color: "#fff", fontSize: 18 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, marginBottom: 10 },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    color: "#f3ce09",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  listContainer: {
    padding: 16,
  },
  userItem: {
    backgroundColor: "#f3ce09",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  viewDetailsButton: {
    backgroundColor: "#3498db",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  adminButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  adminButtonText: {
    color: "#ffffff",
    marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: "5%",
    backgroundColor: "#f3ce09",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loaderContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  loaderText: {
    fontSize: 16,
  },
});

export default AdminPanel;
