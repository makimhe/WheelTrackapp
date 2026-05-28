import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function ProgressHeroCard({
  vehicle,
  imageSource,
  animatedPct,
  progressWidth,
  completed,
  total,
  activeStep,
  heroFade,
  heroSlide,
  imageFade,
  imageSlide,
}) {
  return (
    <Animated.View
      style={[
        styles.heroCard,
        {
          opacity: heroFade,
          transform: [{ translateY: heroSlide }],
        },
      ]}
    >
      {/* Topo com informações do carro */}
      <View style={styles.heroTop}>
        <View style={styles.heroInfo}>
          <View style={styles.heroBadge}>
            <Ionicons
              name="shield-checkmark"
              size={14}
              color={colors.primary}
            />

            <Text style={styles.heroBadgeText}>
              Blindagem {vehicle.blindingLevel || 'III-A'}
            </Text>
          </View>

          <Text
            style={styles.heroModel}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {vehicle.model}
          </Text>

          <Text style={styles.heroPlate}>
            {vehicle.plate}
          </Text>
        </View>

      </View>

      {/* Imagem do veículo */}
      <Animated.Image
        source={imageSource}
        style={[
          styles.heroImage,
          {
            opacity: imageFade,
            transform: [{ translateY: imageSlide }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Barra de progresso total */}
      <View style={styles.progressBox}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            Progresso total
          </Text>

          <Text style={styles.progressPercent}>
            {animatedPct}%
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

        <View style={styles.progressFooter}>
          <Text style={styles.progressFooterText}>
            {completed} de {total} etapas concluídas
          </Text>

          <Text
            style={styles.progressFooterActive}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeStep
              ? `Agora: ${activeStep.title}`
              : 'Processo finalizado'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 25,
    padding: 22,
    marginBottom: 16,
    overflow: 'hidden',

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 5,
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  heroInfo: {
    flex: 1,
    paddingRight: 14,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },

  heroBadgeText: {
    fontSize: 11,
    color: colors.white,
    marginLeft: 5,
    fontFamily: fonts.subtitle,
  },

  heroModel: {
    fontSize: 30,
    color: colors.textPrimary,
    fontFamily: fonts.titleExtra,
  },

  heroPlate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.body,
  },

  percentCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentNumber: {
    fontSize: 19,
    color: colors.textLight,
    fontFamily: fonts.title,
  },

  percentLabel: {
    fontSize: 10,
    color: colors.textLightMuted,
    marginTop: 1,
    fontFamily: fonts.subtitle,
  },

  heroImage: {
     width: '100%',
    height: 200,
    marginTop: 12,
    marginBottom: 18,
    alignSelf: 'center',
    borderRadius: 29,
  },

  progressBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  progressTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.subtitle,
  },

  progressPercent: {
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

  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  progressFooterText: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.body,
  },

  progressFooterActive: {
    flex: 1,
    fontSize: 11,
    color: colors.primaryDark,
    textAlign: 'right',
    fontFamily: fonts.subtitle,
  },
});