import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import fonts from '../../styles/fonts';

export default function EmptyVehicleState() {
  return (
    <View style={styles.emptyBox}>
      <Ionicons
        name="car-outline"
        size={32}
        color="#999"
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
    backgroundColor: '#F8F8F8',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',

    shadowColor: '#000',
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
    color: '#111',
    marginTop: 12,
    fontFamily: fonts.title,
  },

  emptyText: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: fonts.body,
  },
});