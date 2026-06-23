// Tela de Notificações — lista de atualizações das etapas

import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { notifications, vehicles } from '../services/mockData';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

// Card animado de cada notificação
function AnimatedNotificationCard({
  item,
  index,
  onPress,
  onOpenProgress,
}) {
  // Animações de entrada e toque
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Verifica se a notificação ainda não foi lida
  const isUnread = !item.read;

  // Verifica se a notificação é de etapa em andamento
  const isInProgress = item.label?.toLowerCase().includes('andamento');

  useEffect(() => {
    // Reseta a animação quando o item mudar
    fadeAnim.setValue(0);
    slideAnim.setValue(18);

    // Faz as notificações aparecerem uma por uma
    Animated.sequence([
      Animated.delay(index * 80),

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),

        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [item.id, item.read, index]);

  // Diminui levemente o card ao pressionar
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  // Volta o card ao tamanho normal
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.notificationCard,
          isUnread && styles.notificationCardUnread,
        ]}
      >
       

        {/* Conteúdo da notificação */}
        <View style={styles.notificationContent}>
          <View style={styles.notificationTop}>
            <View style={styles.vehicleInfo}>
              <Text
                style={styles.vehicleName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.vehicle}
              </Text>

              <Text style={styles.notificationTime}>
                Hoje · {item.time}
              </Text>
            </View>

            {isUnread ? (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>Nova</Text>
              </View>
            ) : (
              <View style={styles.readBadge}>
                <Text style={styles.readBadgeText}>Lida</Text>
              </View>
            )}
          </View>

          <Text
            style={styles.notificationStep}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.step}
          </Text>

          <View style={styles.notificationBottom}>
            <View
              style={[
                styles.labelPill,
                isUnread && styles.labelPillUnread,
              ]}
            >
              <Ionicons
                name={
                  isInProgress
                    ? 'time-outline'
                    : 'checkmark-circle-outline'
                }
                size={13}
                color={isUnread ? colors.primaryDark : colors.textLight}
              />

              <Text
                style={[
                  styles.labelText,
                  isUnread && styles.labelTextUnread,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>

            {/* Abre a tela de progresso do carro */}
            <TouchableOpacity
              style={styles.progressButton}
              activeOpacity={0.85}
              onPress={onOpenProgress}
            >
              <Text style={styles.progressButtonText}>
                Progresso
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Filtro ativo da tela
  const [filter, setFilter] = useState('all');

  // Lista local para conseguir marcar notificações como lidas
  const [notificationList, setNotificationList] = useState(notifications);

  // Contadores principais
  const unreadCount = notificationList.filter((n) => !n.read).length;
  const readCount = notificationList.filter((n) => n.read).length;
  const totalCount = notificationList.length;

  // Pega a última notificação não lida ou a primeira da lista
  const latestNotification =
    notificationList.find((n) => !n.read) || notificationList[0];

  // Aplica o filtro escolhido
  const filteredNotifications = notificationList.filter((notification) => {
    if (filter === 'unread') {
      return !notification.read;
    }

    if (filter === 'read') {
      return notification.read;
    }

    return true;
  });

  // Marca uma notificação como lida
  const handlePressNotification = (id) => {
    setNotificationList((currentList) =>
      currentList.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Marca todas as notificações como lidas
  const markAllAsRead = () => {
    setNotificationList((currentList) =>
      currentList.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // Abre a tela de progresso do veículo ligado à notificação
  const openVehicleProgress = (notification) => {
    const selectedVehicle =
      vehicles.find((vehicle) => vehicle.model === notification.vehicle) ||
      vehicles[0];

    navigation.navigate('Progresso', {
      vehicle: selectedVehicle,
    });
  };

  // Opções dos filtros
  const filters = [
    {
      key: 'all',
      label: 'Todas',
      count: totalCount,
    },
    {
      key: 'unread',
      label: 'Novas',
      count: unreadCount,
    },
    {
      key: 'read',
      label: 'Lidas',
      count: readCount,
    },
  ];

  return (
    <View style={styles.screen}>
      

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        bounces={false}
        extraData={notificationList}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 120,
          },
        ]}
        ListHeaderComponent={
          <View>
            {/* Cabeçalho */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Home')}
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>

              <View style={styles.headerTextBox}>
                <Text style={styles.headerSmall}>
                  Central de atualizações
                </Text>

                <Text style={styles.headerTitle}>
                  Notificações
                </Text>
              </View>

              
            </View>

            {/* Resumo principal */}
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

              <TouchableOpacity
                style={[
                  styles.markButton,
                  unreadCount === 0 && styles.markButtonDisabled,
                ]}
                activeOpacity={0.85}
                onPress={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={17}
                  color={unreadCount === 0 ? colors.white : colors.textLight}
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

            {/* Cards de resumo */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIconBlack}>
                  <Ionicons
                    name="notifications"
                    size={21}
                    color={colors.textLight}
                  />
                </View>

                <Text style={styles.statValue}>{totalCount}</Text>

                <Text style={styles.statLabel}>Total</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconPrimary}>
                  <Ionicons
                    name="flash-outline"
                    size={21}
                    color={colors.surface}
                  />
                </View>

                <Text style={styles.statValue}>{unreadCount}</Text>

                <Text style={styles.statLabel}>Novas</Text>
              </View>

              <View style={styles.statCardLast}>
                <View style={styles.statIconLight}>
                  <Ionicons
                    name="checkmark-done"
                    size={21}
                    color={colors.surface}
                  />
                </View>

                <Text style={styles.statValue}>{readCount}</Text>

                <Text style={styles.statLabel}>Lidas</Text>
              </View>
            </View>

            

            {/* Filtros */}
            <View style={styles.filters}>
              {filters.map((item) => {
                const isActive = filter === item.key;

                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.filterButton,
                      isActive && styles.filterButtonActive,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setFilter(item.key)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        isActive && styles.filterTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>

                    <View
                      style={[
                        styles.filterCount,
                        isActive && styles.filterCountActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterCountText,
                          isActive && styles.filterCountTextActive,
                        ]}
                      >
                        {item.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Título da lista */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {filter === 'all'
                  ? 'Todas as notificações'
                  : filter === 'unread'
                    ? 'Atualizações novas'
                    : 'Notificações lidas'}
              </Text>

              <Text style={styles.sectionHint}>
                Toque para marcar como lida
              </Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <AnimatedNotificationCard
            item={item}
            index={index}
            onPress={() => handlePressNotification(item.id)}
            onOpenProgress={() => openVehicleProgress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons
              name="notifications-off-outline"
              size={38}
              color={colors.textMuted}
            />

            <Text style={styles.emptyTitle}>
              Nenhuma notificação
            </Text>

            <Text style={styles.emptyText}>
              Quando houver uma atualização, ela aparecerá aqui.
            </Text>
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

  content: {
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
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

  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    position: 'absolute',
    top: 12,
    right: 12,
  },

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
    color: colors.primary,
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
    color: colors.red,
    marginLeft: 6,
    fontFamily: fonts.button,
  },

  markButtonTextDisabled: {
    color: colors.white,
  },

  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 10,

    shadowColor: colors.shadow,
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
    backgroundColor: colors.surfaceSoft,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  statIconBlack: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconPrimary: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconLight: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 22,
    color: colors.textPrimary,
    marginTop: 8,
    fontFamily: fonts.title,
  },

  statLabel: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
    fontFamily: fonts.body,
  },

  highlightCard: {
    backgroundColor: colors.black,
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
    backgroundColor: colors.surfacedark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  highlightContent: {
    flex: 1,
  },

  highlightTitle: {
    fontSize: 13,
    color: colors.textLightMuted,
    fontFamily: fonts.subtitle,
  },

  highlightText: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 3,
    lineHeight: 20,
    fontFamily: fonts.titleMedium,
  },

  filters: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 10,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
  },

  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.subtitle,
  },

  filterTextActive: {
    color: colors.textLight,
  },

  filterCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },

  filterCountActive: {
    backgroundColor: colors.surface,
  },

  filterCountText: {
    fontSize: 11,
    color: colors.textLight,
    fontFamily: fonts.button,
  },

  filterCountTextActive: {
    color: colors.black,
  },

  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  sectionHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.body,
  },

  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 28,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },

  notificationCardUnread: {
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.surface,
  },

  notificationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },

  notificationIconUnread: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  vehicleInfo: {
    flex: 1,
    paddingRight: 10,
  },

  vehicleName: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fonts.subtitle,
  },

  notificationTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: fonts.body,
  },

  newBadge: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  newBadgeText: {
    fontSize: 11,
    color: colors.black,
    fontFamily: fonts.button,
  },

  readBadge: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  readBadgeText: {
    fontSize: 11,
    color: colors.textLight,
    fontFamily: fonts.subtitle,
  },

  notificationStep: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
    fontFamily: fonts.body,
  },

  notificationBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  labelPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },

  labelPillUnread: {
    backgroundColor: colors.primarySoft,
  },

  labelText: {
    flex: 1,
    fontSize: 11,
    color: colors.textLight,
    marginLeft: 5,
    fontFamily: fonts.subtitle,
  },

  labelTextUnread: {
    color: colors.primaryDark,
  },

  progressButton: {
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.black,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressButtonText: {
    fontSize: 11,
    color: colors.textLight,
    fontFamily: fonts.button,
  },

  emptyBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 28,
    padding: 30,
    alignItems: 'center',
    marginTop: 18,

    shadowColor: colors.shadow,
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
    color: colors.textPrimary,
    marginTop: 12,
    fontFamily: fonts.title,
  },

  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
    fontFamily: fonts.body,
  },
});