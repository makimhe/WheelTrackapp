// Tela de Notificações — lista de atualizações das etapas

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { notifications } from '../services/mockData';
import colors from '../styles/colors';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  // Filtra entre "Todas", "Não Lidas", "Lidas"
  const [filter, setFilter] = useState('all');

  // Aplica o filtro escolhido
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Renderiza cada notificação da lista
  const renderItem = ({ item }) => (
    <View style={[styles.notifCard, !item.read && styles.notifCardUnread]}>
      {/* Ícone de status */}
      <View style={[styles.notifIcon, !item.read && styles.notifIconUnread]}>
        <Ionicons
          name={item.read ? 'checkmark-circle' : 'notifications'}
          size={18}
          color={item.read ? colors.textMuted : colors.primary}
        />
      </View>

      {/* Conteúdo */}
      <View style={styles.notifContent}>
        <Text style={styles.notifVehicle}>{item.vehicle}</Text>
        <Text style={styles.notifStep}>{item.step}</Text>
        <View style={styles.notifFooter}>
          <Text style={styles.notifLabel}>{item.label}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
      </View>

      {/* Indicador de não lida */}
      {!item.read && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <Header title="Notificações" />

      {/* Veículo atual */}
      <View style={styles.vehicleTag}>
        <Ionicons name="car-sport" size={14} color={colors.primary} />
        <Text style={styles.vehicleTagText}>Porsche 911</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        {[
          { key: 'all', label: 'Todas' },
          { key: 'unread', label: 'Não Lidas' },
          { key: 'read', label: 'Lidas' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  vehicleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vehicleTagText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    fontSize: 11,
    color: colors.background,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  notifCardUnread: {
    borderColor: colors.primary + '40',
    backgroundColor: colors.primaryGlow,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifIconUnread: {
    backgroundColor: colors.primary + '22',
  },
  notifContent: {
    flex: 1,
  },
  notifVehicle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  notifStep: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  notifFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notifLabel: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
  },
  notifTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
  },
});