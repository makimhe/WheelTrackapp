import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function LatestUpdateCard({ notification }) {
  if (!notification) {
    return null;
  }

  return (
    <View style={styles.latestCard}>
      <View style={styles.latestIcon}>
        <Ionicons
          name="sparkles-outline"
          size={20}
          color={colors.primary}
        />
      </View>

      <View style={styles.latestContent}>
        <Text style={styles.latestTitle}>
          Última atualização
        </Text>

        <Text
          style={styles.latestText}
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
  latestCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },

  latestIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(53,56,235,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  latestContent: {
    flex: 1,
  },

  latestTitle: {
    fontSize: 13,
    color: '#777',
    fontFamily: fonts.subtitle,
  },

  latestText: {
    fontSize: 14,
    color: '#111',
    lineHeight: 19,
    marginTop: 2,
    fontFamily: fonts.bodySemiBold,
  },
});