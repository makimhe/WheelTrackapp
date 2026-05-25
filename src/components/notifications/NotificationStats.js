import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function NotificationsStats({
  totalCount,
  unreadCount,
  readCount,
}) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <View style={styles.statIconBlack}>
          <Ionicons
            name="notifications"
            size={18}
            color="#FFF"
          />
        </View>

        <Text style={styles.statValue}>{totalCount}</Text>

        <Text style={styles.statLabel}>Total</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statIconPrimary}>
          <Ionicons
            name="flash-outline"
            size={18}
            color={colors.primary}
          />
        </View>

        <Text style={styles.statValue}>{unreadCount}</Text>

        <Text style={styles.statLabel}>Novas</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statIconLight}>
          <Ionicons
            name="checkmark-done"
            size={18}
            color="#111"
          />
        </View>

        <Text style={styles.statValue}>{readCount}</Text>

        <Text style={styles.statLabel}>Lidas</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 10,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  statIconBlack: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconPrimary: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconLight: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 22,
    color: colors.textPrimary,
    marginTop: 8,
    fontFamily: fonts.title,
  },

  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.body,
  },
});