import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fonts from '../styles/fonts';
import colors from '../styles/colors';

import { getVeiculosDoUsuario, getBlindagemPorPlaca, getEtapasPorBlindagem } from '../services/api';

import ProgressHeader from '../components/progress/ProgressHeader';
import ProgressHeroCard from '../components/progress/ProgressHeroCard';
import ProgressStats from '../components/progress/ProgressStats';
import CurrentStepCard from '../components/progress/CurrentStepCard';
import StepCard from '../components/progress/StepCard';

function mapearStatus(statusBackend) {
  if (!statusBackend) return 'pending';
  switch (statusBackend.toUpperCase()) {
    case 'CONCLUIDO':    return 'completed';
    case 'EM_ANDAMENTO': return 'active';
    case 'PENDENTE':     return 'pending';
    default:             return 'pending';
  }
}

function formatarEtapa(etapa) {
  const done = etapa.status?.toUpperCase() === 'CONCLUIDO';
  const substeps = etapa.descricao
    ? etapa.descricao.split('|').map(s => ({ text: s.trim(), done }))
    : [];
  return {
    id:       String(etapa.id),
    title:    etapa.etapa,
    status:   mapearStatus(etapa.status),
    substeps,
  };
}

function formatarStatus(statusBackend) {
  if (!statusBackend) return 'Pendente';
  switch (statusBackend.toUpperCase()) {
    case 'EM_ANDAMENTO': return 'Em andamento';
    case 'CONCLUIDO':    return 'Concluído';
    case 'PENDENTE':     return 'Pendente';
    default:             return statusBackend;
  }
}

export default function ProgressScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const vehicleFromParams = route?.params?.vehicle || null;
  const isFromHome        = !!vehicleFromParams;

  const [vehicle, setVehicle]         = useState(vehicleFromParams);
  const [steps, setSteps]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [openedStep, setOpenedStep]   = useState(null);
  const [animatedPct, setAnimatedPct] = useState(0);

  // Atualiza quando o usuário clica em outro veículo na Home
  useEffect(() => {
    if (vehicleFromParams) {
      setVehicle(vehicleFromParams);
      setSteps([]);
      setOpenedStep(null);
      setLoading(true);
    }
  }, [route?.params?.vehicle?.id]);

  const headerFade   = useRef(new Animated.Value(0)).current;
  const headerSlide  = useRef(new Animated.Value(18)).current;
  const heroFade     = useRef(new Animated.Value(0)).current;
  const heroSlide    = useRef(new Animated.Value(28)).current;
  const imageFade    = useRef(new Animated.Value(0)).current;
  const imageSlide   = useRef(new Animated.Value(18)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function carregar() {
      try {
        let veiculoAtual = vehicleFromParams;

        // Veio pela aba sem vehicle — busca o primeiro do usuário
        if (!veiculoAtual) {
          const id          = await AsyncStorage.getItem('id');
          const veiculosRaw = await getVeiculosDoUsuario(id);

          if (veiculosRaw.length === 0) {
            setVehicle(null);
            setLoading(false);
            return;
          }

          const v         = veiculosRaw[0];
          const blindagem = await getBlindagemPorPlaca(v.placa).catch(() => null);
          const status    = formatarStatus(blindagem?.status);
          const progress  = status === 'Concluído' ? 100 : status === 'Em andamento' ? 50 : 0;

          veiculoAtual = {
            id:            v.placa,
            model:         v.modelo || `Veículo ${v.placa}`,
            plate:         v.placa,
            status,
            progress,
            blindingLevel: blindagem?.nivel_blindagem || '—',
            currentStep:   blindagem ? formatarStatus(blindagem.status) : 'Aguardando início',
            image:         v.foto_url ? v.foto_url : require('../../assets/cars/byd.png'),
            blindagemId:   blindagem?.id || null,
          };
        }

        setVehicle(veiculoAtual);

        // Busca etapas se tiver blindagemId
        if (veiculoAtual?.blindagemId) {
          const etapasRaw        = await getEtapasPorBlindagem(veiculoAtual.blindagemId);
          const etapasFormatadas = etapasRaw.map(formatarEtapa);
          setSteps(etapasFormatadas);

          const ativa = etapasFormatadas.find(e => e.status === 'active');
          if (ativa) setOpenedStep(ativa.id);
        }

      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o progresso.');
        console.error('Erro ao carregar progresso:', error);
      } finally {
        // Só libera o render DEPOIS que vehicle foi setado
        setLoading(false);
      }
    }

    carregar();
  }, [loading]);

  const completed  = steps.filter(s => s.status === 'completed').length;
  const activeStep = steps.find(s => s.status === 'active') || null;
  const total      = steps.length;
  const pending    = Math.max(total - completed - (activeStep ? 1 : 0), 0);

  const calculatedPct = total > 0 ? Math.round((completed / total) * 100) : (vehicle?.progress || 0);
  const pct           = Math.min(calculatedPct, 100);

  const imageSource =
    typeof vehicle?.image === 'string'
      ? { uri: vehicle.image }
      : vehicle?.image || require('../../assets/cars/byd.png');

  // Animações disparam depois que loading=false e vehicle existe
  useEffect(() => {
    if (loading || !vehicle) return;

    const progressListener = progressAnim.addListener(({ value }) => {
      setAnimatedPct(Math.round(value));
    });

    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 360, useNativeDriver: true }),
        Animated.spring(headerSlide, { toValue: 0, friction: 8, tension: 70, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(heroFade, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(heroSlide, { toValue: 0, friction: 8, tension: 50, useNativeDriver: true }),
        Animated.timing(imageFade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(imageSlide, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
        Animated.timing(progressAnim, { toValue: pct, duration: 1050, useNativeDriver: false }),
      ]),
    ]).start();

    return () => progressAnim.removeListener(progressListener);
  }, [loading, vehicle]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const handleBack = () => {
    if (isFromHome) navigation.goBack();
    else navigation.navigate('Home');
  };

  // Spinner enquanto carrega
  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Nenhum veículo cadastrado
  if (!vehicle) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <Text style={styles.emptyText}>Nenhum veículo encontrado.</Text>
      </View>
    );
  }

  // Render principal — vehicle garantidamente não é null aqui
  return (
    <View style={styles.screen}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 },
        ]}
      >
        <ProgressHeader
          onBack={handleBack}
          headerFade={headerFade}
          headerSlide={headerSlide}
        />

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

        <ProgressStats
          completed={completed}
          activeStep={activeStep}
          pending={pending}
        />

        <CurrentStepCard activeStep={activeStep} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Etapas da blindagem</Text>
          <Text style={styles.sectionHint}>
            {total > 0 ? 'Toque em uma etapa para ver os detalhes' : 'Nenhuma etapa cadastrada ainda'}
          </Text>
        </View>

        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            isOpen={openedStep === step.id}
            onPress={() => setOpenedStep(openedStep === step.id ? null : step.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: colors.textSecondary, fontFamily: fonts.body },
  glowOne: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: colors.primarySoft, top: 90, right: -100,
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
  content: { paddingHorizontal: 20 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, color: colors.white, fontFamily: fonts.title },
  sectionHint: { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body },
});