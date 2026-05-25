import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function ProgressHeader({
  onBack,
  headerFade,
  headerSlide,
}) {
  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: headerFade,
          transform: [{ translateY: headerSlide }],
        },
      ]}
    >
      {/* Botão de voltar */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.85}
        onPress={onBack}
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      {/* Título da tela */}
      <View style={styles.headerTextBox}>
        <Text style={styles.headerSmall}>
          Acompanhamento
        </Text>

        <Text style={styles.headerTitle}>
          Progresso
        </Text>
      </View>

      {/* Ícone do canto direito */}
      <View style={styles.headerIcon}>
        <Ionicons
          name="analytics-outline"
          size={22}
          color={colors.textLight}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 20,
    backgroundColor: colors.surface,
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

  headerTextBox: {
    flex: 1,
    marginLeft: 14,
  },

  headerSmall: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.body,
  },

  headerTitle: {
    fontSize: 30,
    color: colors.textPrimary,
    marginTop: 2,
    fontFamily: fonts.titleExtra,
  },

  headerIcon: {
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
});