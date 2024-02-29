import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Pressable, Platform } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useNavigation} from "@react-navigation/native";

const AddScreen = () => {
    const navigation = useNavigation();
    const dataCollectionRef = collection(db, "data");

    const formatDate = (date) => {
        const dob = new Date(date);
        return `${dob.getDate()}-${dob.getMonth() + 1}-${dob.getFullYear()}`; // Format: DD-MM-YYYY
    };

    const [classId, setClassId] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');

    // Handlers for timestamp
    const [DOB, setDOB] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [className, setClassName] = useState('');
    const [Score, setScore] = useState(0);
    const [Grade, setGrade] = useState('');

    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = ({ type }, selectedDate) => {
        if(type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate);

            if(Platform.OS === "android") {
                togglePicker();
                setDOB(currentDate.toDateString());
            }
        }
        else {
            togglePicker();
        }
    };

    const handleAddData = async () => {
        try {
            // submit the data
            await addDoc(dataCollectionRef, {
                classId: classId,
                fName: fName,
                lName: lName,
                DOB: new Date(DOB),
                className: className,
                Score: Score,
                Grade: Grade
            });

            // Clear input fields after adding data
            setClassId('');
            setFName('');
            setLName('');
            setDOB(''); // Reset DOB to empty string
            setClassName('');
            setScore(0);
            setGrade('');

            navigation.goBack();

        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert("Error", "Failed to add data. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Class ID"
                onChangeText={(classId) => { setClassId(classId) }}
                value={classId}
            />
            <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={(fName) => { setFName(fName) }}
                value={fName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={(lName) => { setLName(lName) }}
                value={lName}
            />
            <TextInput
                style={styles.input}
                placeholder="Class Name"
                onChangeText={(className) => { setClassName(className) }}
                value={className}
            />
            <View>
                {showPicker && (
                <DateTimePicker
                    mode={"date"}
                    display={"spinner"}
                    value={date}
                    onChange={onChange}
                    />
                )}
                {!showPicker && (
                    <Pressable onPress={togglePicker}>
                        <TextInput
                            style={styles.input}
                            placeholder="Date of Birth"
                            onChangeText={setDOB}
                            value={DOB}
                            editable={false}
                        />
                    </Pressable>
                )}
            </View>
            <TextInput
                style={styles.input}
                placeholder="Score"
                onChangeText={(Score) => { setScore(Number(Score)) }} // Convert input string to number
                value={Score.toString()} // Convert number to string
            />
            <TextInput
                style={styles.input}
                placeholder="Grade"
                onChangeText={(Grade) => { setGrade(Grade) }}
                value={Grade}
            />
            <Button title="Add Data" onPress={handleAddData} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '80%',
    },
});

export default AddScreen;
