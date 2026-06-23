import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export default function ErrorState({
  message,
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons
          name="alert-circle-outline"
          size={28}
          color={colors.textPrimary}
        />
      </View>

      <Text style={styles.title}>
        Algo deu errado
      </Text>

      <Text style={styles.text}>
        {message || 'Tente novamente em instantes.'}
      </Text>

      {!!onRetry && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={onRetry}
        >
          <Text style={styles.buttonText}>
            Tentar novamente
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    marginTop: 12,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  text: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: fonts.body,
  },

  button: {
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.black,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  buttonText: {
    fontSize: 13,
    color: colors.textLight,
    fontFamily: fonts.button,
  },
});
