import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function ProgressStats({
  completed,
  activeStep,
  pending,
}) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <View style={styles.statIconDone}>
          <Ionicons
            name="checkmark-done"
            size={18}
            color="#FFF"
          />
        </View>

        <Text style={styles.statValue}>{completed}</Text>
        <Text style={styles.statLabel}>Concluídas</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statIconActive}>
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.primary}
          />
        </View>

        <Text style={styles.statValue}>
          {activeStep ? 1 : 0}
        </Text>

        <Text style={styles.statLabel}>
          Em andamento
        </Text>
      </View>

      <View style={styles.statCardLast}>
        <View style={styles.statIconPending}>
          <Ionicons
            name="ellipse-outline"
            size={18}
            color="#111"
          />
        </View>

        <Text style={styles.statValue}>{pending}</Text>
        <Text style={styles.statLabel}>Pendentes</Text>
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
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 10,

    shadowColor: '#000',
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
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  statIconDone: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconActive: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(53,56,235,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconPending: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 22,
    color: '#111',
    marginTop: 8,
    fontFamily: fonts.title,
  },

  statLabel: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
    textAlign: 'center',
    fontFamily: fonts.body,
  },
});