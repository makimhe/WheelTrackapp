import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { vehicles } from '../services/mockData';

import fonts from '../styles/fonts';
import colors from '../styles/colors';
import ProgressHeader from '../components/progress/ProgressHeader';
import ProgressHeroCard from '../components/progress/ProgressHeroCard';
import ProgressStats from '../components/progress/ProgressStats';
import CurrentStepCard from '../components/progress/CurrentStepCard';
import StepCard from '../components/progress/StepCard';

export default function ProgressScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();

  // Pega o veículo enviado pela Home ou usa o primeiro veículo do mock
  const vehicle = route.params?.vehicle || vehicles[0];

  // Verifica se veio da Home para decidir como voltar
  const isFromHome = !!route.params?.vehicle;

  // Pega as etapas do veículo selecionado
  const steps = vehicle.steps || [];

  // Calcula quantas etapas estão concluídas
  const completed = steps.filter((step) => step.status === 'completed').length;

  // Encontra a etapa que está em andamento
  const activeStep = steps.find((step) => step.status === 'active');

  // Total de etapas
  const total = steps.length;

  // Calcula o progresso caso ele não venha pronto do mock/backend
  const calculatedPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Usa o progresso do veículo ou o progresso calculado
  const pct = Math.min(vehicle.progress || calculatedPct, 100);

  // Calcula etapas pendentes
  const pending = Math.max(
    total - completed - (activeStep ? 1 : 0),
    0
  );

  // Controla qual etapa está aberta
  const [openedStep, setOpenedStep] = useState(activeStep?.id || null);

  // Número animado da porcentagem
  const [animatedPct, setAnimatedPct] = useState(0);

  // Animações do cabeçalho
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(18)).current;

  // Animações do card principal
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(28)).current;

  // Animações da imagem do carro
  const imageFade = useRef(new Animated.Value(0)).current;
  const imageSlide = useRef(new Animated.Value(18)).current;

  // Animação da barra de progresso
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Aceita imagem local ou imagem vindo por URL do backend
  const imageSource =
    typeof vehicle.image === 'string'
      ? { uri: vehicle.image }
      : vehicle.image;

  useEffect(() => {
    // Atualiza o número enquanto a barra carrega
    const progressListener = progressAnim.addListener(({ value }) => {
      setAnimatedPct(Math.round(value));
    });

    // Entrada animada do cabeçalho
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),

        Animated.spring(headerSlide, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),

      // Entrada animada do card, imagem e barra
      Animated.parallel([
        Animated.timing(heroFade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),

        Animated.spring(heroSlide, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),

        Animated.timing(imageFade, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),

        Animated.spring(imageSlide, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),

        Animated.timing(progressAnim, {
          toValue: pct,
          duration: 1050,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Remove o listener ao sair da tela
    return () => {
      progressAnim.removeListener(progressListener);
    };
  }, []);

  // Transforma a porcentagem em largura da barra
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Volta para a tela anterior ou para Home
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
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 120,
          },
        ]}
      >
        {/* Cabeçalho da tela */}
        <ProgressHeader
          onBack={handleBack}
          headerFade={headerFade}
          headerSlide={headerSlide}
        />

        {/* Card principal do veículo */}
        <ProgressHeroCard
          vehicle={vehicle}
          imageSource={imageSource}
          animatedPct={animatedPct}
          progressWidth={progressWidth}
          completed={completed}
          total={total}
          activeStep={activeStep}
          heroFade={heroFade}
          heroSlide={heroSlide}
          imageFade={imageFade}
          imageSlide={imageSlide}
        />

        {/* Cards de estatísticas */}
        <ProgressStats
          completed={completed}
          activeStep={activeStep}
          pending={pending}
        />

        {/* Card da etapa atual */}
        <CurrentStepCard activeStep={activeStep} />

        {/* Título da lista de etapas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Etapas da blindagem
          </Text>

          <Text style={styles.sectionHint}>
            Toque em uma etapa para ver os detalhes
          </Text>
        </View>

        {/* Lista de etapas */}
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            isOpen={openedStep === step.id}
            onPress={() =>
              setOpenedStep(
                openedStep === step.id ? null : step.id
              )
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

 

  glowTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.whiteSoft,
    top: 360,
    left: -90,
  },

  content: {
    paddingHorizontal: 20,
  },

  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  sectionHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.body,
  },
});