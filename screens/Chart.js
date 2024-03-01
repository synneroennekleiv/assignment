// Chart.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from "firebase/firestore";

const Chart = () => {
    // State to store the chart data
    const [charts, setCharts] = useState({});

    useEffect(() => {
        // Listen for real-time updates to the 'data' collection
        const unsubscribe = onSnapshot(collection(db, 'data'), (snapshot) => {
            const updatedCharts = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                const { className, Grade } = data;
                if (!updatedCharts[className]) {
                    updatedCharts[className] = {};
                }
                updatedCharts[className][Grade] = (updatedCharts[className][Grade] || 0) + 1;
            });
            // Set the updated chart data to state
            setCharts(updatedCharts);
        });

        return () => unsubscribe();
    }, []);

    return (
        <ScrollView>
            {/* Render each chart */}
            {Object.keys(charts).map(className => (
                <View key={className}>
                    {/* Display the className as the chart title */}
                    <Text style={{ textAlign: 'center', marginTop: 10, marginBottom: 5, fontSize: 18 }}>{className}</Text>
                    {/* Render LineChart component for each className */}
                    <LineChart
                        data={{
                            labels: ['A', 'B', 'C', 'D', 'E', 'F'],
                            datasets: [{
                                // Map grade distribution data to the LineChart
                                data: ['A', 'B', 'C', 'D', 'E', 'F'].map(grade => charts[className]?.[grade] || 0)
                            }]
                        }}
                        width={350}
                        height={220}
                        yAxisSuffix=""
                        xAxisLabel=""
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16
                            }
                        }}
                        bezier
                    />
                </View>
            ))}
        </ScrollView>
    );
}

export default Chart;
