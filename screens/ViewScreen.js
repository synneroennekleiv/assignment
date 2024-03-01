import React, { useEffect, useState } from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text, ScrollView, Alert, Dimensions} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { db } from '../firebaseConfig';

const ViewScreen = () => {
    const navigation = useNavigation();
    const [studentData, setStudentData] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const dataCollectionRef = collection(db, "data");
        // Listening for changes in the collection
        return onSnapshot(dataCollectionRef, snapshot => {
            const updatedData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            // Updating state with fetched data and chart data
            if (updatedData && Array.isArray(updatedData)) {
                setStudentData(updatedData);
            }
        }, error => {
            console.error("Error fetching documents: ", error);
            Alert.alert("Error", "Failed to fetch data. Please try again.");
        });
    }, []);

    // Deleting document from Firestore
    const handleDeleteData = async (id) => {
        try {
            await deleteDoc(doc(db, "data", id)); // Corrected deleteDoc usage
        } catch (error) {
            console.error("Error deleting document: ", error);
            Alert.alert("Error", "Failed to delete data. Please try again.");
        }
    };

    // Convert the timestamp to a human-readable value
    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const renderActions = (rowData) => (
        <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('EditScreen', { id: rowData.id, data: rowData })}>
                <Image source={require('../assets/edit.png')} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteData(rowData.id)}>
                <Image source={require('../assets/bin.png')} style={styles.image} />
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView horizontal={true}>
            <View style={styles.container}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                    <Row data={['Class ID', 'First Name', 'Last Name', 'D.O.B', 'Class Name', 'Score', 'Grade', 'Actions']} style={styles.head} textStyle={styles.headerText} />
                    {studentData.map((rowData, index) => (
                        <Row
                            key={index}
                            data={[
                                rowData.classId,
                                rowData.fName,
                                rowData.lName,
                                formatDate(rowData.DOB),
                                rowData.className,
                                rowData.Score.toString(),
                                rowData.Grade,
                                renderActions(rowData)
                            ]}
                            style={styles.row}
                            textStyle={{ ...styles.text, textAlign: 'center' }}
                        />
                    ))}
                </Table>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#adaca2'
    },
    head: {
        height: 50,
        backgroundColor: '#57564e'
    },
    classInfo: {
        alignItems: 'center',
        marginTop: 10,
    },
    className: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerText: {
        margin: 6,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14
    },
    row: {
        height: 40,
        backgroundColor: '#E7E6E1'
    },
    text: {
        margin: 6,
        textAlign: 'center',
        fontSize: 12
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    image: {
        width: 24,
        height: 24,
        marginHorizontal: 5
    },
});

export default ViewScreen;
