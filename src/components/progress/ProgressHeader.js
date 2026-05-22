import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

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
        <Ionicons name="chevron-back" size={22} color="#111" />
      </TouchableOpacity>

      {/* Título da tela */}
      <View style={styles.headerTextBox}>
        <Text style={styles.headerSmall}>Acompanhamento</Text>
        <Text style={styles.headerTitle}>Progresso</Text>
      </View>

      {/* Ícone do canto direito */}
      <View style={styles.headerIcon}>
        <Ionicons name="analytics-outline" size={22} color="#FFF" />
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
    borderRadius: 23,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
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
    color: '#555',
    fontFamily: fonts.body,
  },

  headerTitle: {
    fontSize: 30,
    color: '#111',
    marginTop: 2,
    fontFamily: fonts.titleExtra,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
});