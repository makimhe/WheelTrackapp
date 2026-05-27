import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function HomeSummaryCard({ inProgressVehicles }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTextBox}>
        <Text style={styles.summaryTitle}>
          {inProgressVehicles > 0
            ? `${inProgressVehicles} veículo em andamento`
            : 'Tudo finalizado'}
        </Text>

        <Text style={styles.summaryText}>
          Acompanhe o status da blindagem e veja cada etapa do processo.
        </Text>
      </View>

      <View style={styles.summaryIcon}>
        <Ionicons
          name="car-sport-outline"
          size={30}
          color={colors.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.black,
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },

  summaryTextBox: {
    flex: 1,
    paddingRight: 14,
  },

  summaryTitle: {
    fontSize: 23,
    color: colors.textLight,
    fontFamily: fonts.title,
  },

  summaryText: {
    fontSize: 13,
    color: colors.textLightMuted,
    lineHeight: 18,
    marginTop: 6,
    fontFamily: fonts.body,
  },

  summaryIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});