// Navegador de abas (Tab Bar) — a barra inferior do app
// Cada aba é uma tela diferente

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import HomeScreen from './HomeScreen';
import ProgressScreen from './ProgressScreen';
import NotificationsScreen from './NotificationsScreen';
import DocumentsScreen from './DocumentsScreen';
import MaintenanceScreen from './MaintenanceScreen';

import colors from '../styles/colors';

// Cria o navegador de abas
const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Esconde o header padrão (usamos o nosso)

        // Ícone de cada aba
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Progresso: focused ? 'layers' : 'layers-outline',
            Notificações: focused ? 'notifications' : 'notifications-outline',
            Documentos: focused ? 'folder' : 'folder-outline',
            Manutenção: focused ? 'construct' : 'construct-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },

        // Cores e estilo da tab bar
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Progresso" component={ProgressScreen} />
      <Tab.Screen name="Notificações" component={NotificationsScreen} />
      <Tab.Screen name="Documentos" component={DocumentsScreen} />
      <Tab.Screen name="Manutenção" component={MaintenanceScreen} />
    </Tab.Navigator>
  );
}