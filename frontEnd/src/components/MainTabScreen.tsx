import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingsScreen'
import EmitScreen from './EmitScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabScreen: React.FC <{}> = () => {

    useEffect(() => {
        console.log('ceva');
    }, []);

    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                activeTintColor: '#e91e63',
            }}
        >
            <Tab.Screen
                name="Home"
                component={ HomeScreen }
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="house" size={24} color="black" />                    
                    ),
                }}
            />
            <Tab.Screen
                name="Emit"
                component={ EmitScreen }
                options={{
                    tabBarLabel: 'Emit',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="signal-wifi-4-bar" size={24} color="black" />                    
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ ProfileScreen }
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={24} color="black" />                    
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={ SettingsScreen }
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" size={24} color="black" />                    
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default MainTabScreen