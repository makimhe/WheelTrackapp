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
          size={24}
          color={colors.white}
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
    backgroundColor: colors.black,
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: colors.shadow,
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
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  latestContent: {
    flex: 1,
  },

  latestTitle: {
    fontSize: 13,
    color: colors.textLight,
    fontFamily: fonts.subtitle,
  },

  latestText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 19,
    marginTop: 2,
    fontFamily: fonts.bodySemiBold,
  },
});