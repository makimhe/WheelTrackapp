import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import fonts from '../../styles/fonts';

export default function NotificationsSummaryCard({
  unreadCount,
  onMarkAllAsRead,
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTextBox}>
        <Text style={styles.summaryTitle}>
          {unreadCount > 0
            ? `${unreadCount} novas atualizações`
            : 'Tudo em dia'}
        </Text>

        <Text style={styles.summaryText}>
          {unreadCount > 0
            ? 'Você tem movimentações recentes nas etapas da blindagem.'
            : 'Nenhuma atualização pendente no momento.'}
        </Text>
      </View>

      {/* Botão para marcar tudo como lido */}
      <TouchableOpacity
        style={[
          styles.markButton,
          unreadCount === 0 && styles.markButtonDisabled,
        ]}
        activeOpacity={0.85}
        onPress={onMarkAllAsRead}
        disabled={unreadCount === 0}
      >
        <Ionicons
          name="checkmark-done-outline"
          size={17}
          color={unreadCount === 0 ? '#999' : '#FFF'}
        />

        <Text
          style={[
            styles.markButtonText,
            unreadCount === 0 && styles.markButtonTextDisabled,
          ]}
        >
          Ler tudo
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 34,
    padding: 22,
    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 5,
  },

  summaryTextBox: {
    flex: 1,
    paddingRight: 14,
  },

  summaryTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  summaryText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 18,
    fontFamily: fonts.body,
  },

  markButton: {
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.black,
    paddingHorizontal: 13,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  markButtonDisabled: {
    backgroundColor: colors.surfaceMuted,
  },

  markButtonText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 6,
    fontFamily: fonts.button,
  },

  markButtonTextDisabled: {
    color: colors.textMuted,
  },
});