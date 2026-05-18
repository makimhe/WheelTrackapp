import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { vehicles } from '../services/mockData';
import colors from '../styles/colors';

export default function ProgressScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const vehicle = route.params?.vehicle || vehicles[0];
  const isFromHome = !!route.params?.vehicle;

  const steps = vehicle.steps || [];

  const completed = steps.filter((s) => s.status === 'completed').length;
  const activeStep = steps.find((s) => s.status === 'active');
  const total = steps.length;

  const calculatedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pct = Math.min(vehicle.progress || calculatedPct, 100);

  const pending = Math.max(total - completed - (activeStep ? 1 : 0), 0);

  const [openedStep, setOpenedStep] = useState(activeStep?.id || null);

  const handleBack = () => {
    if (isFromHome) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 120,
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={22} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Progresso</Text>

          <View style={styles.headerSpace} />
        </View>

        {/* CARD PRINCIPAL */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroInfo}>
              <Text style={styles.heroModel}>{vehicle.model}</Text>

              <View style={styles.heroMeta}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={colors.primary}
                />

                <Text style={styles.heroMetaText}>
                  Nível {vehicle.blindingLevel || 'III-A'}
                </Text>

                <View style={styles.heroDot} />

                <Text style={styles.heroMetaText}>{vehicle.plate}</Text>
              </View>
            </View>

            <View style={styles.heroPct}>
              <Text style={styles.heroPctNum}>{pct}%</Text>
              <Text style={styles.heroPctLabel}>pronto</Text>
            </View>
          </View>

          <Image
            source={vehicle.image}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${pct}%`,
                },
              ]}
            />
          </View>

          <View style={styles.barLabels}>
            <Text style={styles.barLabel}>
              {completed} de {total} etapas concluídas
            </Text>

            {activeStep ? (
              <Text style={styles.barActive}>
                Agora: {activeStep.title}
              </Text>
            ) : (
              <Text style={styles.barActive}>
                Processo finalizado
              </Text>
            )}
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />

            <Text style={[styles.statValue, { color: '#22C55E' }]}>
              {completed}
            </Text>

            <Text style={styles.statLabel}>Concluídas</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="time" size={20} color={colors.primary} />

            <Text style={[styles.statValue, { color: colors.primary }]}>
              {activeStep ? 1 : 0}
            </Text>

            <Text style={styles.statLabel}>Em andamento</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="ellipse-outline" size={20} color="#999" />

            <Text style={[styles.statValue, { color: '#999' }]}>
              {pending}
            </Text>

            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
        </View>

        {/* TIMELINE */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Etapas da blindagem</Text>

          <Text style={styles.timelineSubtitle}>
            Toque em uma etapa para ver mais informações
          </Text>

          <View style={styles.timelineList}>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              const isOpen = openedStep === step.id;

              return (
                <View key={step.id} style={styles.stepRow}>
                  <View style={styles.stepIndicator}>
                    <View
                      style={[
                        styles.stepDot,
                        isCompleted && styles.stepDotCompleted,
                        isActive && styles.stepDotActive,
                        !isCompleted && !isActive && styles.stepDotPending,
                      ]}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                      ) : isActive ? (
                        <View style={styles.activeInnerDot} />
                      ) : (
                        <View style={styles.pendingInnerDot} />
                      )}
                    </View>

                    {!isLast && (
                      <View
                        style={[
                          styles.stepLine,
                          isCompleted && styles.stepLineCompleted,
                          isActive && styles.stepLineActive,
                          !isCompleted && !isActive && styles.stepLinePending,
                        ]}
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.stepContent,
                      isActive && styles.stepContentActive,
                      isOpen && styles.stepContentOpen,
                    ]}
                    onPress={() => setOpenedStep(isOpen ? null : step.id)}
                  >
                    <View style={styles.stepContentTop}>
                      <View style={styles.stepTextArea}>
                        <Text
                          style={[
                            styles.stepTitle,
                            isCompleted && styles.stepTitleCompleted,
                            isActive && styles.stepTitleActive,
                            !isCompleted && !isActive && styles.stepTitlePending,
                          ]}
                        >
                          {step.title}
                        </Text>

                        <Text
                          style={[
                            styles.stepDescription,
                            isCompleted && styles.stepDescriptionCompleted,
                            isActive && styles.stepDescriptionActive,
                            !isCompleted &&
                              !isActive &&
                              styles.stepDescriptionPending,
                          ]}
                        >
                          {getStepDescription(step.status)}
                        </Text>
                      </View>

                      <Ionicons
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#777"
                      />
                    </View>

                    {isActive && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Etapa atual</Text>
                      </View>
                    )}

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

                        <View style={styles.detailRow}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={colors.primary}
                          />

                          <Text style={styles.detailText}>
                            Status: {getStatusLabel(step.status)}
                          </Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function getStepDescription(status) {
  if (status === 'completed') {
    return 'Essa etapa já foi finalizada.';
  }

  if (status === 'active') {
    return 'Essa etapa está sendo executada agora.';
  }

  return 'Essa etapa ainda será iniciada.';
}

function getStatusLabel(status) {
  if (status === 'completed') {
    return 'Concluída';
  }

  if (status === 'active') {
    return 'Em andamento';
  }

  return 'Pendente';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E9E9E9',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 22,
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

  headerTitle: {
    fontSize: 18,
    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  headerSpace: {
    width: 46,
    height: 46,
  },

  heroCard: {
    backgroundColor: '#F8F8F8',

    borderRadius: 34,

    padding: 22,

    marginBottom: 18,

    overflow: 'hidden',

    shadowColor: '#000',
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  heroInfo: {
    flex: 1,
    paddingRight: 12,
  },

  heroModel: {
    fontSize: 28,
    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 6,
  },

  heroMetaText: {
    fontSize: 12,
    color: '#777',

    marginLeft: 5,

    fontFamily: 'Outfit_400Regular',
  },

  heroDot: {
    width: 4,
    height: 4,

    borderRadius: 2,

    backgroundColor: '#999',

    marginHorizontal: 8,
  },

  heroPct: {
    backgroundColor: colors.primary,

    borderRadius: 18,

    paddingHorizontal: 14,
    paddingVertical: 9,

    alignItems: 'center',
  },

  heroPctNum: {
    fontSize: 21,
    color: '#FFF',

    fontFamily: 'Outfit_700Bold',
  },

  heroPctLabel: {
    fontSize: 10,
    color: '#FFF',

    opacity: 0.85,

    fontFamily: 'Outfit_600SemiBold',
  },

  heroImage: {
    width: '100%',
    height: 190,

    marginTop: 12,
    marginBottom: 16,
  },

  barTrack: {
    width: '100%',
    height: 9,

    backgroundColor: '#DDD',

    borderRadius: 999,

    overflow: 'hidden',
  },

  barFill: {
    height: '100%',

    backgroundColor: colors.primary,

    borderRadius: 999,
  },

  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 10,
    gap: 10,
  },

  barLabel: {
    flex: 1,

    fontSize: 12,
    color: '#777',

    fontFamily: 'Outfit_400Regular',
  },

  barActive: {
    flex: 1,

    fontSize: 12,
    color: colors.primary,

    textAlign: 'right',

    fontFamily: 'Outfit_600SemiBold',
  },

  statsRow: {
    flexDirection: 'row',

    gap: 12,

    marginBottom: 18,
  },

  statBox: {
    flex: 1,

    backgroundColor: '#F8F8F8',

    borderRadius: 24,

    paddingVertical: 16,

    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 3,
  },

  statValue: {
    fontSize: 23,

    marginTop: 6,

    fontFamily: 'Outfit_700Bold',
  },

  statLabel: {
    fontSize: 10,
    color: '#777',

    marginTop: 2,

    fontFamily: 'Outfit_400Regular',
  },

  timelineCard: {
    backgroundColor: '#F8F8F8',

    borderRadius: 34,

    padding: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 18,

    elevation: 5,
  },

  timelineTitle: {
    fontSize: 24,
    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  timelineSubtitle: {
    fontSize: 13,
    color: '#777',

    marginTop: 4,
    marginBottom: 26,

    fontFamily: 'Outfit_400Regular',
  },

  timelineList: {
    paddingBottom: 4,
  },

  stepRow: {
    flexDirection: 'row',
    minHeight: 86,
  },

  stepIndicator: {
    width: 42,

    alignItems: 'center',
  },

  stepDot: {
    width: 30,
    height: 30,

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 2,
  },

  stepDotCompleted: {
    backgroundColor: colors.primary,
  },

  stepDotActive: {
    backgroundColor: '#FFF',

    borderWidth: 2,
    borderColor: colors.primary,
  },

  stepDotPending: {
    backgroundColor: '#FFF',

    borderWidth: 1,
    borderColor: '#DDD',
  },

  activeInnerDot: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: colors.primary,
  },

  pendingInnerDot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: '#DDD',
  },

  stepLine: {
    width: 2,
    flex: 1,

    marginTop: 2,
  },

  stepLineCompleted: {
    backgroundColor: colors.primary,
  },

  stepLineActive: {
    backgroundColor: '#D8D3FF',
  },

  stepLinePending: {
    backgroundColor: '#E2E2E2',
  },

  stepContent: {
    flex: 1,

    paddingLeft: 8,
    paddingBottom: 22,
  },

  stepContentTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    gap: 10,
  },

  stepTextArea: {
    flex: 1,
  },

  stepContentActive: {
    backgroundColor: '#FFF',

    borderRadius: 18,

    padding: 16,

    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 3,
  },

  stepContentOpen: {
    backgroundColor: '#FFF',

    borderRadius: 18,

    padding: 16,

    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 3,
  },

  stepTitle: {
    fontSize: 15,

    fontFamily: 'Outfit_700Bold',
  },

  stepTitleCompleted: {
    color: '#111',
  },

  stepTitleActive: {
    color: '#111',
  },

  stepTitlePending: {
    color: '#B8B8B8',
  },

  stepDescription: {
    fontSize: 12,

    marginTop: 4,

    lineHeight: 17,

    fontFamily: 'Outfit_400Regular',
  },

  stepDescriptionCompleted: {
    color: '#777',
  },

  stepDescriptionActive: {
    color: '#777',
  },

  stepDescriptionPending: {
    color: '#C2C2C2',
  },

  activeBadge: {
    alignSelf: 'flex-start',

    backgroundColor: colors.primary,

    borderRadius: 999,

    paddingHorizontal: 12,
    paddingVertical: 6,

    marginTop: 12,
  },

  activeBadgeText: {
    color: '#FFF',

    fontSize: 11,

    fontFamily: 'Outfit_600SemiBold',
  },

  stepDetails: {
    marginTop: 14,

    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',

    paddingTop: 12,
    gap: 10,
  },

  substepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 9,
  },

  substepDot: {
    width: 18,
    height: 18,

    borderRadius: 9,

    marginTop: 1,

    backgroundColor: '#E5E5E5',

    alignItems: 'center',
    justifyContent: 'center',
  },

  substepDotDone: {
    backgroundColor: colors.primary,
  },

  substepText: {
    flex: 1,

    fontSize: 12,
    lineHeight: 17,

    color: '#777',

    fontFamily: 'Outfit_400Regular',
  },

  substepTextDone: {
    color: '#333',
    fontFamily: 'Outfit_600SemiBold',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 8,
  },

  detailText: {
    flex: 1,

    fontSize: 12,
    lineHeight: 17,

    color: '#666',

    fontFamily: 'Outfit_400Regular',
  },
});