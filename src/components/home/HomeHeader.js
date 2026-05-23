import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function HomeHeader({
  firstName,
  unread,
  onPressNotifications,
}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.smallText}>
          Olá, {firstName}
        </Text>

        <Text style={styles.title}>
          Seus veículos{'\n'}
          blindados
        </Text>
      </View>

      <TouchableOpacity
        style={styles.notificationButton}
        activeOpacity={0.85}
        onPress={onPressNotifications}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={colors.textLight}
        />

        {unread > 0 && <View style={styles.dot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  smallText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.body,
    marginBottom: 6,
  },

  title: {
    fontSize: 32,
    color: colors.textPrimary,
    lineHeight: 38,
    fontFamily: fonts.titleExtra,
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    position: 'absolute',
    top: 12,
    right: 12,
  },
});