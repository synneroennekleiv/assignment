import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

import ViewScreen from "../screens/ViewScreen";
import AddScreen from "../screens/AddScreen";

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
        screenOptions={{
            showLabel: false,
            style: {
                position: 'absolute',
                bottom: 25,
                left: 20,
                right: 20,
                elevation: 0,
                backgroundColor: '#ffffff',
                borderRadius: 15,
                height: 90,
                ... styles.shadow
            }
        }}
        >
            <Tab.Screen name={"Student Dashboard"} component={ViewScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image
                            source={require('../assets/home.png')}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? '#57564e' : '#748c94'
                            }}
                        />
                        <Text style={{color: focused ? '#57564e' : '#748c94', fontSize: 12}}></Text>
                    </View>
                ),
            }}></Tab.Screen>
            <Tab.Screen name={"Add"} component={AddScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image
                            source={require('../assets/plus.png')}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? '#57564e' : '#748c94'
                            }}
                        />
                        <Text style={{color: focused ? '#57564e' : '#748c94', fontSize: 12}}></Text>
                    </View>
                ),
            }}></Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#57564e',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
});

export default Tabs;