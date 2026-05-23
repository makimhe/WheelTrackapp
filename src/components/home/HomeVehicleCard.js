import React, { useEffect, useRef, useState } from 'react';

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

export default function HomeVehicleCard({
  vehicle,
  navigation,
  index,
}) {
  // Garante que o progresso fique no máximo em 100%
  const progress = Math.min(vehicle.progress || 0, 100);

  // Número animado da porcentagem
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animações do card
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  // Aceita imagem local ou URL
  const imageSource =
    typeof vehicle.image === 'string'
      ? { uri: vehicle.image }
      : vehicle.image;

  useEffect(() => {
    // Atualiza o número da porcentagem junto com a barra
    const progressListener = progressAnim.addListener(({ value }) => {
      setAnimatedProgress(Math.round(value));
    });

    // Entrada animada do card
    Animated.sequence([
      Animated.delay(index * 110),

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),

        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),

        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 950,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    return () => {
      progressAnim.removeListener(progressListener);
    };
  }, []);

  // Transforma número em largura da barra
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Efeito ao pressionar o card
  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.985,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  // Volta o card ao tamanho normal
  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  // Abre a tela de progresso do carro
  const openProgress = () => {
    navigation.navigate('Progresso', {
      vehicle,
    });
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: pressScale },
        ],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        style={styles.vehicleCard}
        onPress={openProgress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Topo do card */}
        <View style={styles.vehicleTop}>
          <View style={styles.vehicleBadge}>
            <Ionicons
              name="shield-checkmark"
              size={13}
              color={colors.primary}
            />

            <Text
              style={styles.vehicleBadgeText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Blindagem {vehicle.blindingLevel || 'III-A'}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              vehicle.status === 'Concluído' &&
                styles.statusBadgeDone,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                vehicle.status === 'Concluído' &&
                  styles.statusTextDone,
              ]}
            >
              {vehicle.status}
            </Text>
          </View>
        </View>

        {/* Imagem do carro */}
        <Animated.Image
          source={imageSource}
          style={[
            styles.carImage,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 24],
                    outputRange: [0, 12],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
        />

        {/* Informações principais */}
        <View style={styles.vehicleInfoRow}>
          <View style={styles.vehicleTextBox}>
            <Text
              style={styles.vehicleName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {vehicle.model}
            </Text>

            <Text style={styles.vehiclePlate}>
              {vehicle.plate}
            </Text>
          </View>

          <View style={styles.percentCircle}>
            <Text style={styles.percentCircleText}>
              {animatedProgress}%
            </Text>
          </View>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Progresso da blindagem
            </Text>

            <Text style={styles.progressValue}>
              {animatedProgress}%
            </Text>
          </View>

          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </View>

        {/* Rodapé do card */}
        <View style={styles.cardFooter}>
          <View style={styles.currentStepBox}>
            <Text style={styles.currentStepLabel}>
              Etapa atual
            </Text>

            <Text
              style={styles.currentStepText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {vehicle.currentStep || 'Sem etapa atual'}
            </Text>
          </View>

          <View style={styles.openButton}>
            <Text style={styles.openButtonText}>
              Abrir
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color={colors.textLight}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  vehicleCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 34,
    padding: 22,
    marginBottom: 28,
    overflow: 'hidden',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  vehicleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  vehicleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    maxWidth: '58%',
  },

  vehicleBadgeText: {
    fontSize: 11,
    color: colors.primaryDark,
    marginLeft: 5,
    fontFamily: fonts.subtitle,
  },

  statusBadge: {
    backgroundColor: colors.black,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  statusBadgeDone: {
    backgroundColor: colors.primary,
  },

  statusText: {
    color: colors.textLight,
    fontSize: 11,
    fontFamily: fonts.subtitle,
  },

  statusTextDone: {
    color: colors.black,
  },

  carImage: {
    width: '100%',
    height: 180,
    marginTop: 12,
    marginBottom: 18,
    alignSelf: 'center',
  },

  vehicleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleTextBox: {
    flex: 1,
    paddingRight: 12,
  },

  vehicleName: {
    fontSize: 28,
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  vehiclePlate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.body,
  },

  percentCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentCircleText: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: fonts.button,
  },

  progressSection: {
    marginTop: 24,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.body,
  },

  progressValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.subtitle,
  },

  progressBar: {
    width: '100%',
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },

  cardFooter: {
    marginTop: 27,
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },

  currentStepBox: {
    flex: 1,
    maxWidth: '60%',
    paddingRight: 8,
  },

  currentStepLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.body,
  },

  currentStepText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 2,
    fontFamily: fonts.subtitle,
  },

  openButton: {
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.black,
    paddingHorizontal: 15,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 'auto',
  },

  openButtonText: {
    fontSize: 12,
    color: colors.textLight,
    marginRight: 6,
    fontFamily: fonts.button,
  },
});