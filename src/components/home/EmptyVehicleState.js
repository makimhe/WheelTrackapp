import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function EmptyVehicleState() {
  return (
    <View style={styles.emptyBox}>
      <Ionicons
        name="car-outline"
        size={32}
        color={colors.textMuted}
      />

      <Text style={styles.emptyTitle}>
        Nenhum veículo encontrado
      </Text>

      <Text style={styles.emptyText}>
        Tente buscar por outro modelo ou placa.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },

  emptyTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 12,
    fontFamily: fonts.title,
  },

  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: fonts.body,
  },
});