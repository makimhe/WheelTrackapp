import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function LatestMovementCard({ notification }) {
  if (!notification) {
    return null;
  }

  return (
    <View style={styles.highlightCard}>
      <View style={styles.highlightIcon}>
        <Ionicons
          name="sparkles-outline"
          size={20}
          color={colors.primary}
        />
      </View>

      <View style={styles.highlightContent}>
        <Text style={styles.highlightTitle}>
          Última movimentação
        </Text>

        <Text
          style={styles.highlightText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {notification.vehicle} · {notification.step}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  highlightCard: {
    backgroundColor: '#111',
    borderRadius: 28,
    padding: 16,
    marginBottom: 20,

    flexDirection: 'row',
    alignItems: 'center',
  },

  highlightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  highlightContent: {
    flex: 1,
  },

  highlightTitle: {
    fontSize: 13,
    color: '#BDBDBD',
    fontFamily: fonts.subtitle,
  },

  highlightText: {
    fontSize: 15,
    color: '#FFF',
    marginTop: 3,
    lineHeight: 20,
    fontFamily: fonts.titleMedium,
  },
});