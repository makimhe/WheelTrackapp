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
        {/* Ícone da notificação */}
        <View
          style={[
            styles.notificationIcon,
            isUnread && styles.notificationIconUnread,
          ]}
        >
          <Ionicons
            name={
              isUnread
                ? 'notifications'
                : isInProgress
                  ? 'time-outline'
                  : 'checkmark'
            }
            size={18}
            color={isUnread ? '#FFF' : '#111'}
          />
        </View>

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
                color={isUnread ? colors.primary : '#777'}
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
      {/* Luzes decorativas do fundo */}
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

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
                  color="#111"
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

              <View style={styles.headerIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#FFF"
                />

                {unreadCount > 0 && (
                  <View style={styles.headerDot} />
                )}
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

            {/* Cards de resumo */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIconBlack}>
                  <Ionicons
                    name="notifications"
                    size={18}
                    color="#FFF"
                  />
                </View>

                <Text style={styles.statValue}>{totalCount}</Text>

                <Text style={styles.statLabel}>Total</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconPrimary}>
                  <Ionicons
                    name="flash-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <Text style={styles.statValue}>{unreadCount}</Text>

                <Text style={styles.statLabel}>Novas</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconLight}>
                  <Ionicons
                    name="checkmark-done"
                    size={18}
                    color="#111"
                  />
                </View>

                <Text style={styles.statValue}>{readCount}</Text>

                <Text style={styles.statLabel}>Lidas</Text>
              </View>
            </View>

            {/* Última movimentação */}
            {latestNotification && (
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
                    {latestNotification.vehicle} · {latestNotification.step}
                  </Text>
                </View>
              </View>
            )}

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
              color="#999"
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
    backgroundColor: '#E9E9E9',
  },

  glowOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(53,56,235,0.13)',
    top: 90,
    right: -100,
  },

  glowTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.55)',
    top: 360,
    left: -90,
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

  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4D',
    position: 'absolute',
    top: 12,
    right: 12,
  },

  summaryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 34,
    padding: 22,
    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
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
    color: '#111',
    fontFamily: fonts.title,
  },

  summaryText: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
    lineHeight: 18,
    fontFamily: fonts.body,
  },

  markButton: {
    height: 42,
    borderRadius: 21,
    backgroundColor: '#111',
    paddingHorizontal: 13,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  markButtonDisabled: {
    backgroundColor: '#EFEFEF',
  },

  markButtonText: {
    fontSize: 12,
    color: '#FFF',
    marginLeft: 6,
    fontFamily: fonts.button,
  },

  markButtonTextDisabled: {
    color: '#999',
  },

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

  statIconBlack: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconPrimary: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(53,56,235,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconLight: {
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
    fontSize: 11,
    color: '#777',
    marginTop: 2,
    fontFamily: fonts.body,
  },

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

  filters: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  filterButtonActive: {
    backgroundColor: '#111',
  },

  filterText: {
    fontSize: 13,
    color: '#777',
    fontFamily: fonts.subtitle,
  },

  filterTextActive: {
    color: '#FFF',
  },

  filterCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },

  filterCountActive: {
    backgroundColor: colors.primary,
  },

  filterCountText: {
    fontSize: 11,
    color: '#777',
    fontFamily: fonts.button,
  },

  filterCountTextActive: {
    color: '#FFF',
  },

  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    color: '#111',
    fontFamily: fonts.title,
  },

  sectionHint: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
    fontFamily: fonts.body,
  },

  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 28,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',

    shadowColor: '#000',
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
    borderColor: 'rgba(53,56,235,0.20)',
    backgroundColor: 'rgba(248,248,248,0.96)',
  },

  notificationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3E3E3',
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
    color: '#111',
    fontFamily: fonts.subtitle,
  },

  notificationTime: {
    fontSize: 11,
    color: '#999',
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
    color: '#FFF',
    fontFamily: fonts.button,
  },

  readBadge: {
    backgroundColor: '#EFEFEF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  readBadgeText: {
    fontSize: 11,
    color: '#777',
    fontFamily: fonts.subtitle,
  },

  notificationStep: {
    fontSize: 14,
    color: '#555',
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
    backgroundColor: '#FFF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },

  labelPillUnread: {
    backgroundColor: 'rgba(53,56,235,0.10)',
  },

  labelText: {
    flex: 1,
    fontSize: 11,
    color: '#777',
    marginLeft: 5,
    fontFamily: fonts.subtitle,
  },

  labelTextUnread: {
    color: colors.primary,
  },

  progressButton: {
    height: 30,
    borderRadius: 15,
    backgroundColor: '#111',
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressButtonText: {
    fontSize: 11,
    color: '#FFF',
    fontFamily: fonts.button,
  },

  emptyBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 28,
    padding: 30,
    alignItems: 'center',
    marginTop: 18,

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
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
    fontFamily: fonts.body,
  },
});