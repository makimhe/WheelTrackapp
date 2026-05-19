import React, { useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "./HomeScreen";
import ProgressScreen from "./ProgressScreen";
import NotificationsScreen from "./NotificationsScreen";
import DocumentsScreen from "./DocumentsScreen";
import MaintenanceScreen from "./MaintenanceScreen";

import colors from "../styles/colors";

const Tab = createBottomTabNavigator();

function TabIcon({ routeName, focused }) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      friction: 7,
      tension: 90,
    }).start();
  }, [focused]);

  const icons = {
    Home: focused ? "home" : "home-outline",
    Progresso: focused ? "analytics" : "analytics-outline",
    Notificações: focused ? "notifications" : "notifications-outline",
    Documentos: focused ? "document-text" : "document-text-outline",
    Manutenção: focused ? "construct" : "construct-outline",
  };

  const scale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  const translateY = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <View style={styles.iconWrapper}>
      <Animated.View
        style={[
          styles.iconBox,
          focused && styles.activeIcon,
          {
            transform: [
              {
                scale,
              },
              {
                translateY,
              },
            ],
          },
        ]}
      >
        <Ionicons
          name={icons[routeName]}
          size={20}
          color={focused ? colors.white : colors.textMuted}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.activeDot,
          {
            opacity: scaleAnim,
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      />
    </View>
  );
}

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.tabWrapper,
        {
          bottom: insets.bottom + 14,
        },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

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
              activeOpacity={0.9}
              style={styles.tabItem}
            >
              <TabIcon routeName={route.name} focused={focused} />
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
    height: 58,

    borderRadius: 70,

    backgroundColor: colors.surface,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    paddingHorizontal: 4,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 20,

    elevation: 12,
  },

  tabItem: {
    width: 50,
    height: 54,

    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
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
      height: 5,
    },
    shadowOpacity: 0.32,
    shadowRadius: 10,

    elevation: 8,
  },

  activeDot: {
    width: 4,
    height: 4,

    borderRadius: 2,

    backgroundColor: colors.primary,

    marginTop: 3,
  },
});