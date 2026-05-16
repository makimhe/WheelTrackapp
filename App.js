// App.js — ponto de entrada do aplicativo
// Aqui configuramos a navegação principal entre Login e as telas internas

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importa as telas
import LoginScreen from './src/screens/LoginScreen';
import MainTabNavigator from './src/screens/MainTabNavigator';
import ProgressScreen from './src/screens/ProgressScreen';

// Cria o navegador de pilha (Stack)
// Pilha = quando você vai de uma tela para outra, a anterior fica "embaixo"
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // SafeAreaProvider: garante que o app respeite bordas do celular (notch, etc.)
    <SafeAreaProvider>
      {/* StatusBar escura para combinar com o tema dark */}
      <StatusBar style="light" />

      {/* NavigationContainer: envolve toda a navegação do app */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"  // Tela inicial
          screenOptions={{
            headerShown: false,     // Sem header padrão do React Navigation
            animation: 'fade',      // Animação suave entre telas
          }}
        >
          {/* Tela de Login */}
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* Telas principais (com tab bar) */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Tela de Progresso (acessada ao clicar em um veículo na Home) */}
          <Stack.Screen
            name="Progress"
            component={ProgressScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}