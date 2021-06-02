import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'

import { Home } from '../Home'
import { Emit } from '../Emit'
import { Profile } from '../Profile'
import { Settings } from '../Settings'

import { NavigationContainer } from '@react-navigation/native'

const Tab = createBottomTabNavigator()

export const MainTab: React.FC <{}> = () => {

    useEffect(() => {
        console.log('ceva');
    }, []);

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Home"
                tabBarOptions={{
                    activeTintColor: '#e91e63',
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={ Home }
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="house" size={24} color="black" />                    
                        ),
                    }}
                />
                <Tab.Screen
                    name="Emit"
                    component={ Emit }
                    options={{
                        tabBarLabel: 'Emit',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="signal-wifi-4-bar" size={24} color="black" />                    
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ Profile }
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="person" size={24} color="black" />                    
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={ Settings }
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="settings" size={24} color="black" />                    
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
