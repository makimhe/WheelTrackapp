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
          color={colors.primary}
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
    backgroundColor: '#111',
    borderRadius: 28,
    padding: 16,
    marginBottom: 20,

    flexDirection: 'row',
    alignItems: 'center',
  },

  currentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  currentTextBox: {
    flex: 1,
  },

  currentTitle: {
    fontSize: 13,
    color: '#BDBDBD',
    fontFamily: fonts.subtitle,
  },

  currentText: {
    fontSize: 15,
    color: '#FFF',
    marginTop: 3,
    lineHeight: 20,
    fontFamily: fonts.titleMedium,
  },
});