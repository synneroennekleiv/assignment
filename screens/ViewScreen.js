import React, { useEffect, useState } from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text, ScrollView, Alert, Dimensions} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { db } from '../firebaseConfig';
import { BarChart } from 'react-native-chart-kit';

const ViewScreen = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const unsubscribe = getRealtimeData();
        return () => unsubscribe();
    }, []);

    const getRealtimeData = () => {
        const dataCollectionRef = collection(db, "data");
        return onSnapshot(dataCollectionRef, snapshot => {
            const updatedData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setData(updatedData);

            calculateGradeDistributions(updatedData);
        }, error => {
            console.error("Error fetching documents: ", error);
            Alert.alert("Error", "Failed to fetch data. Please try again.");
        });
    };

    const calculateGradeDistributions = (data) => {
        const gradeDistributions = {};
        data.forEach(item => {
            if (!gradeDistributions[item.className]) {
                gradeDistributions[item.className] = {};
            }
            gradeDistributions[item.className][item.Grade] = (gradeDistributions[item.className][item.Grade] || 0) + 1;
        });
        setChartData(gradeDistributions);
    };

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
                    {data.map((rowData, index) => (
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
            <View style={styles.container}>
                {Object.entries(chartData).map(([className, distribution], index) => (
                    <View key={index}>
                        <BarChart
                            data={{
                                labels: Object.keys(distribution),
                                datasets: [{
                                    data: Object.values(distribution)
                                }]
                            }}
                            width={Dimensions.get('window').width - 32}
                            height={300}
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: '#1cc910',
                                backgroundGradientFrom: '#eff3ff',
                                backgroundGradientTo: '#efefef',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                        <View style={styles.classInfo}>
                            <Text style={styles.className}>{className}</Text>
                        </View>
                    </View>
                ))}
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
