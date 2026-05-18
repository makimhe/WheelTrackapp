import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "./HomeScreen";
import ProgressScreen from "./ProgressScreen";
import NotificationsScreen from "./NotificationsScreen";
import DocumentsScreen from "./DocumentsScreen";
import MaintenanceScreen from "./MaintenanceScreen";

import colors from "../styles/colors";

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.tabWrapper,
        { bottom: insets.bottom + 14 },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const icons = {
            Home: focused ? "home" : "home-outline",
            Progresso: focused ? "analytics" : "analytics-outline",
            Notificações: focused ? "notifications" : "notifications-outline",
            Documentos: focused ? "document-text" : "document-text-outline",
            Manutenção: focused ? "construct" : "construct-outline",
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={styles.tabItem}
            >
              <View style={[styles.iconBox, focused && styles.activeIcon]}>
                <Ionicons
                  name={icons[route.name]}
                  size={20}
                  color={focused ? colors.white : colors.textMuted}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Progresso" component={ProgressScreen} />
      <Tab.Screen name="Notificações" component={NotificationsScreen} />
      <Tab.Screen name="Documentos" component={DocumentsScreen} />
      <Tab.Screen name="Manutenção" component={MaintenanceScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabWrapper: {
    position: "absolute",
    left: 0,
    right: 0,

    alignItems: "center",
  },

  tabBar: {
    width: 280,
    height: 60,

    borderRadius: 30,

    backgroundColor: colors.surface,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    paddingHorizontal: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 18,

    elevation: 10,
  },

  tabItem: {
    width: 48,
    height: 48,

    alignItems: "center",
    justifyContent: "center",
  },

  iconBox: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",
  },

  activeIcon: {
    backgroundColor: colors.primary,

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.28,
    shadowRadius: 8,

    elevation: 5,
  },
});