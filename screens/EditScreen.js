import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Pressable, Platform } from 'react-native';
import {collection, addDoc, updateDoc, doc, getDoc} from 'firebase/firestore'; // Import updateDoc and doc
import { db } from "../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useNavigation, useRoute} from "@react-navigation/native";

const EditScreen = () => {
    const dataCollectionRef = collection(db, "data");
    const navigation = useNavigation();
    const route = useRoute();
    const { data } = route.params;
    const { id } = route.params;

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

    // Fetch existing data from the database for editing
    useEffect(() => {
        // Assuming you have a method to fetch existing data by document ID from the database
        const fetchData = async () => {
            try {
                const documentSnapshot = await getDoc(doc(db, 'data', id));
                const data = documentSnapshot.data();
                setClassId(data.classId);
                setFName(data.fName);
                setLName(data.lName);
                setDOB(formatDate(data.DOB.toDate())); // Format the date
                setClassName(data.className);
                setScore(data.Score);
                setGrade(data.Grade);
            } catch (error) {
                console.error("Error fetching document: ", error);
                Alert.alert("Error", "Failed to fetch data. Please try again.");
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = ({ type }, selectedDate) => {
        if (type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate);

            if (Platform.OS === "android") {
                togglePicker();
                setDOB(currentDate.toDateString());
            }
        } else {
            togglePicker();
        }
    };

    const handleUpdateData = async () => {
        try {
            // Update the document with the new data
            await updateDoc(doc(db, 'data', id), {
                classId: classId,
                fName: fName,
                lName: lName,
                DOB: new Date(DOB),
                className: className,
                Score: Score,
                Grade: Grade
            });

            // Reset state after updating data
            setClassId('');
            setFName('');
            setLName('');
            setDOB('D.O.B');
            setClassName('');
            setScore(0);
            setGrade('');

            Alert.alert("Success", "Data updated successfully.");
            navigation.goBack();
        } catch (error) {
            console.error("Error updating document: ", error);
            Alert.alert("Error", "Failed to update data. Please try again.");
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
            <Button title="Update Data" onPress={handleUpdateData} />
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

export default EditScreen;
