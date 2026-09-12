import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { sendData } from "./services/sendDate";

export default function App() {
  const [activePicker, setActivePicker] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      roomType: "standard",
      checkInDate: new Date(),
      checkOutDate: null,
    },
  });

  const onSubmit = (data) => {
    sendData({
      userName: data.userName,
      email: data.email,
      roomType: data.roomType,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.formHeader}>Booking form</Text>

        {/* Name Input */}
        <Text style={styles.formTitle}>Name</Text>
        <Controller
          control={control}
          name="userName"
          rules={{
            required: "Name is required",
            pattern: {
              value: /^[A-Z][a-zA-Z\s]{2,}$/,
              message:
                "Name must start with a capital letter and contain at least 3 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID="user-name-input"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.userName && (
          <Text style={styles.errorText}>{errors.userName.message}</Text>
        )}

        {/* Email Input */}
        <Text style={styles.formTitle}>email</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "e-mail is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address. Please enter a valid email",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID="email-input"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* Check-In Date */}
        <Text style={styles.formTitle}>Check-In Date</Text>
        <Controller
          control={control}
          name="checkInDate"
          rules={{
            required: "Check-In Date is required",
            validate: (value) => {
              const checkOut = getValues("checkOutDate");
              if (checkOut && value && new Date(value) >= new Date(checkOut)) {
                return "The Check-Out Date must be later than the Check-In Date";
              }
              return true;
            },
          }}
          render={({ field: { value } }) => (
            <TouchableOpacity
              onPress={() => setActivePicker("checkIn")}
              style={styles.input}
            >
              <Text>
                {value ? new Date(value).toLocaleDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>
          )}
        />
        {errors.checkInDate && (
          <Text style={styles.errorText}>{errors.checkInDate.message}</Text>
        )}

        {/* Check-Out Date */}
        <Text style={styles.formTitle}>Check-Out Date</Text>
        <Controller
          control={control}
          name="checkOutDate"
          rules={{
            required: "Check-Out Date is required",
            validate: (value) => {
              const checkIn = getValues("checkInDate");
              if (checkIn && value && new Date(value) <= new Date(checkIn)) {
                return "The Check-Out Date must be later than the Check-In Date";
              }
              return true;
            },
          }}
          render={({ field: { value } }) => (
            <TouchableOpacity
              onPress={() => setActivePicker("checkOut")}
              style={styles.input}
            >
              <Text>
                {value ? new Date(value).toLocaleDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>
          )}
        />
        {errors.checkOutDate && (
          <Text style={styles.errorText}>{errors.checkOutDate.message}</Text>
        )}

        {/* Dynamic DateTimePicker */}
        {activePicker && (
          <Controller
            control={control}
            name={activePicker === "checkIn" ? "checkInDate" : "checkOutDate"}
            render={({ field: { value } }) => (
              <DateTimePicker
                testID="date-time-picker"
                value={value ? new Date(value) : new Date()}
                mode="date"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setValue(
                      activePicker === "checkIn"
                        ? "checkInDate"
                        : "checkOutDate",
                      selectedDate
                    );
                    trigger(["checkInDate", "checkOutDate"]);
                  }
                }}
              />
            )}
          />
        )}

        {/* Room Type */}
        <Text style={styles.formTitle}>Choose the room type:</Text>
        <Controller
          control={control}
          name="roomType"
          render={({ field: { onChange, value } }) => (
            <Picker selectedValue={value} onValueChange={onChange}>
              <Picker.Item label="Standard" value="standard" />
              <Picker.Item label="Luxury" value="luxury" />
              <Picker.Item label="Family" value="family" />
            </Picker>
          )}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={{ ...styles.button, marginTop: 50 }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
  },
  button: {
    backgroundColor: "#0056b3",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  formHeader: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: 20,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});