import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function HomeStats({
  totalVehicles,
  inProgressVehicles,
  completedVehicles,
}) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <View style={styles.statIconBlack}>
          <Ionicons
            name="car-sport"
            size={18}
            color={colors.textLight}
          />
        </View>

        <Text style={styles.statValue}>
          {totalVehicles}
        </Text>

        <Text style={styles.statLabel}>
          Veículos
        </Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statIconPrimary}>
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.white}
          />
        </View>

        <Text style={styles.statValue}>
          {inProgressVehicles}
        </Text>

        <Text style={styles.statLabel}>
          Em andamento
        </Text>
      </View>

      <View style={styles.statCardLast}>
        <View style={styles.statIconLight}>
          <Ionicons
            name="checkmark-done"
            size={18}
            color={colors.white}
          />
        </View>

        <Text style={styles.statValue}>
          {completedVehicles}
        </Text>

        <Text style={styles.statLabel}>
          Concluídos
        </Text>
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
    borderRadius: 20,
    paddingVertical: 15,
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

  statCardLast: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',

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
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconLight: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.black,
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
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    fontFamily: fonts.body,
  },
});