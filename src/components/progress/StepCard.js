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

export default function StepCard({
  step,
  index,
  isOpen,
  onPress,
}) {
  // Animações de entrada e toque
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Verifica o status da etapa
  const isCompleted = step.status === 'completed';
  const isActive = step.status === 'active';

  useEffect(() => {
    // Faz cada card aparecer em sequência
    Animated.sequence([
      Animated.delay(index * 85),

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 330,
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
  }, [index]);

  // Diminui levemente o card ao pressionar
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.985,
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

  // Conta subetapas concluídas
  const completedSubsteps =
    step.substeps?.filter((substep) => substep.done).length || 0;

  const totalSubsteps = step.substeps?.length || 0;

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
          styles.stepCard,
          isActive && styles.stepCardActive,
          isCompleted && styles.stepCardCompleted,
        ]}
      >
        {/* Topo da etapa */}
        <View style={styles.stepTop}>
          <View
            style={[
              styles.stepIcon,
              isCompleted && styles.stepIconCompleted,
              isActive && styles.stepIconActive,
            ]}
          >
            <Ionicons
              name={
                isCompleted
                  ? 'checkmark'
                  : isActive
                    ? 'time-outline'
                    : 'ellipse-outline'
              }
              size={17}
              color={isCompleted || isActive ? '#FFF' : '#999'}
            />
          </View>

          <View style={styles.stepTextBox}>
            <Text
              style={[
                styles.stepTitle,
                !isCompleted && !isActive && styles.stepTitlePending,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {step.title}
            </Text>

            <Text
              style={[
                styles.stepDescription,
                !isCompleted && !isActive && styles.stepDescriptionPending,
              ]}
            >
              {getStepDescription(step.status)}
            </Text>
          </View>

          <View
            style={[
              styles.stepStatusPill,
              isCompleted && styles.stepStatusCompleted,
              isActive && styles.stepStatusActive,
            ]}
          >
            <Text
              style={[
                styles.stepStatusText,
                (isCompleted || isActive) && styles.stepStatusTextLight,
              ]}
            >
              {getStatusLabel(step.status)}
            </Text>
          </View>
        </View>

        {/* Rodapé da etapa */}
        <View style={styles.stepBottom}>
          <View style={styles.substepMiniInfo}>
            <Ionicons
              name="list-outline"
              size={14}
              color={isActive ? colors.primary : '#777'}
            />

            <Text
              style={[
                styles.substepMiniText,
                isActive && styles.substepMiniTextActive,
              ]}
            >
              {completedSubsteps}/{totalSubsteps} itens concluídos
            </Text>
          </View>

          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#777"
          />
        </View>

        {/* Subetapas abertas */}
        {isOpen && (
          <View style={styles.stepDetails}>
            {step.substeps?.map((substep, subIndex) => (
              <View key={subIndex} style={styles.substepRow}>
                <View
                  style={[
                    styles.substepDot,
                    substep.done && styles.substepDotDone,
                  ]}
                >
                  {substep.done && (
                    <Ionicons
                      name="checkmark"
                      size={10}
                      color="#FFF"
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.substepText,
                    substep.done && styles.substepTextDone,
                  ]}
                >
                  {substep.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// Texto de descrição baseado no status
function getStepDescription(status) {
  if (status === 'completed') {
    return 'Finalizada e validada no processo.';
  }

  if (status === 'active') {
    return 'Em execução neste momento.';
  }

  return 'Aguardando início.';
}

// Nome visual do status
function getStatusLabel(status) {
  if (status === 'completed') {
    return 'Concluída';
  }

  if (status === 'active') {
    return 'Atual';
  }

  return 'Pendente';
}

const styles = StyleSheet.create({
  stepCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 26,
    padding: 16,
    marginBottom: 13,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },

  stepCardActive: {
    borderWidth: 1,
    borderColor: 'rgba(53,56,235,0.24)',
  },

  stepCardCompleted: {
    backgroundColor: '#FAFAFA',
  },

  stepTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  stepIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  stepIconCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  stepIconActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },

  stepTextBox: {
    flex: 1,
    paddingRight: 10,
  },

  stepTitle: {
    fontSize: 15,
    color: '#111',
    fontFamily: fonts.subtitle,
  },

  stepTitlePending: {
    color: '#999',
  },

  stepDescription: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
    lineHeight: 17,
    fontFamily: fonts.body,
  },

  stepDescriptionPending: {
    color: '#AAA',
  },

  stepStatusPill: {
    backgroundColor: '#EFEFEF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  stepStatusCompleted: {
    backgroundColor: colors.primary,
  },

  stepStatusActive: {
    backgroundColor: '#111',
  },

  stepStatusText: {
    fontSize: 10,
    color: '#777',
    fontFamily: fonts.button,
  },

  stepStatusTextLight: {
    color: '#FFF',
  },

  stepBottom: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  substepMiniInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  substepMiniText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 5,
    fontFamily: fonts.subtitle,
  },

  substepMiniTextActive: {
    color: colors.primary,
  },

  stepDetails: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingTop: 13,
  },

  substepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  substepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginTop: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  substepDotDone: {
    backgroundColor: colors.primary,
  },

  substepText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#777',
    fontFamily: fonts.body,
  },

  substepTextDone: {
    color: '#333',
    fontFamily: fonts.bodySemiBold,
  },
});