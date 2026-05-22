import React, { useEffect, useRef } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function NotificationCard({
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

  // Verifica se a notificação fala de andamento
  const isInProgress = item.label?.toLowerCase().includes('andamento');

  useEffect(() => {
    // Reseta a animação quando o item muda
    fadeAnim.setValue(0);
    slideAnim.setValue(18);

    // Faz os cards aparecerem um por um
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

  // Diminui levemente ao tocar
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  // Volta ao tamanho normal
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

            {/* Abre o progresso do veículo */}
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

const styles = StyleSheet.create({
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
});