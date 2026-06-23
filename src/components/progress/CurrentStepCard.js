import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function CurrentStepCard({ activeStep }) {
  // Se não existir etapa ativa, não mostra o card
  if (!activeStep) {
    return null;
  }

  return (
    <View style={styles.currentCard}>
      <View style={styles.currentIcon}>
        <Ionicons
          name="flash-outline"
          size={20}
          color={colors.black}
        />
      </View>

      <View style={styles.currentTextBox}>
        <Text style={styles.currentTitle}>
          Etapa atual
        </Text>

        <Text
          style={styles.currentText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {activeStep.title}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  currentCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },

  currentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  currentTextBox: {
    flex: 1,
  },

  currentTitle: {
    fontSize: 13,
    color: colors.textLight,
    fontFamily: fonts.subtitle,
  },

  currentText: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 3,
    lineHeight: 20,
    fontFamily: fonts.titleMedium,
  },
});