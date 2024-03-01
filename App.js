import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/tabs";
import EditScreen from './screens/EditScreen';

const Stack = createStackNavigator(); // Declare the Stack variable

export default function App() {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tabs" component={Tabs} />
                <Stack.Screen name="EditScreen" component={EditScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
