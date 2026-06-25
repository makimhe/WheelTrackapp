// Tela de Manutenção — status do veículo e agendamentos

import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getVeiculosDoUsuario, getManutencoesDoVeiculo } from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

function formatarData(valor) {
  if (!valor) return 'Sem data';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return String(valor);
  return data.toLocaleDateString('pt-BR');
}

function InfoCard({ icon, label, value, valueColor, index }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 90),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 70, useNativeDriver: true }),
      ]),
    ]).start();
  }, [index]);

  return (
    <Animated.View style={[styles.infoCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.textLight} />
      </View>
      <View style={styles.infoTextBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, valueColor && { color: valueColor }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function MaintenanceScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading]           = useState(true);
  const [manutencoes, setManutencoes]   = useState([]);
  const [nomeVeiculo, setNomeVeiculo]   = useState('');

  // Animações
  const integrityAnim = useRef(new Animated.Value(0)).current;
  const headerFade    = useRef(new Animated.Value(0)).current;
  const headerSlide   = useRef(new Animated.Value(18)).current;
  const cardFade      = useRef(new Animated.Value(0)).current;
  const cardSlide     = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    async function carregar() {
      try {
        const id       = await AsyncStorage.getItem('id');
        const veiculos = await getVeiculosDoUsuario(id);

        if (veiculos.length === 0) { setLoading(false); return; }

        const veiculo = veiculos[0];
        setNomeVeiculo(veiculo.modelo || veiculo.placa);

        const manutRaw = await getManutencoesDoVeiculo(veiculo.placa).catch(() => []);
        setManutencoes(manutRaw);

      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as manutenções.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  // Calcula dados para exibição
  const manutConcluidas  = manutencoes.filter(m => m.status === 'CONCLUIDO');
  const manutEmAndamento = manutencoes.filter(m => m.status === 'EM_ANDAMENTO');
  const ultimaManut      = manutConcluidas[manutConcluidas.length - 1];
  const proximaManut     = manutEmAndamento[0] || manutencoes.find(m => m.status === 'PENDENTE');

  const integrityValue = manutencoes.length === 0 ? 94
    : Math.round((manutConcluidas.length / manutencoes.length) * 100);

  useEffect(() => {
    if (loading) return;

    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, friction: 8, tension: 70, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(180),
        Animated.parallel([
          Animated.timing(cardFade, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.spring(cardSlide, { toValue: 0, friction: 8, tension: 70, useNativeDriver: true }),
          Animated.timing(integrityAnim, { toValue: integrityValue, duration: 1000, useNativeDriver: false }),
        ]),
      ]),
    ]).start();
  }, [loading]);

  const integrityWidth = integrityAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const handleSchedule  = () => Alert.alert('Agendamento', 'Abrindo agenda para manutenção...');
  const handleReport    = () => Alert.alert('Ocorrência', 'Formulário de ocorrência em breve.');
  const handleEmergency = () => Alert.alert('Inspeção de Emergência', 'Para impactos estruturais, entre em contato imediatamente.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'WhatsApp', onPress: () => console.log('Abre WhatsApp') }]);
  const handleWhatsapp  = () => Alert.alert('WhatsApp', 'Abrindo atendimento no WhatsApp...');

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 }]}
      >
        {/* Cabeçalho */}
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTextBox}>
            <Text style={styles.headerSmall}>Cuidados da blindagem</Text>
            <Text style={styles.headerTitle}>Manutenção</Text>
          </View>
        </Animated.View>

        {/* Card principal */}
        <Animated.View style={[styles.heroCard, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroTextBox}>
              <Text style={styles.heroTitle}>Revisão geral da blindagem</Text>
              <Text style={styles.heroSubtitle}>Revisão anual obrigatória para manutenção da garantia.</Text>
            </View>
            <View style={styles.statusBadge}>
              <Ionicons name="shield-checkmark" size={15} color={colors.surface} />
              <Text style={styles.statusBadgeText}>Garantia ativa</Text>
            </View>
          </View>

          <View style={styles.integrityBox}>
            <View style={styles.integrityHeader}>
              <View>
                <Text style={styles.integrityLabel}>Integridade estrutural</Text>
                <Text style={styles.integritySub}>Status técnico atual do veículo</Text>
              </View>
              <Text style={styles.integrityValue}>{integrityValue}%</Text>
            </View>
            <View style={styles.integrityBar}>
              <Animated.View style={[styles.integrityFill, { width: integrityWidth }]} />
            </View>
          </View>

          <View style={styles.approvalTag}>
            <Ionicons name="checkmark-circle" size={17} color={colors.primary} />
            <Text style={styles.approvalText}>Veículo dentro dos padrões técnicos recomendados</Text>
          </View>
        </Animated.View>

        {/* Cards com dados rápidos */}
        <View style={styles.infoGrid}>
          <InfoCard index={0} icon="calendar-outline" label="Última manutenção"
            value={ultimaManut ? formatarData(ultimaManut.data_fim || ultimaManut.data_inicio) : 'Sem registro'} />
          <InfoCard index={1} icon="time-outline" label="Próxima revisão"
            value={proximaManut ? (proximaManut.tipo || 'Manutenção pendente') : 'Nenhuma agendada'}
            valueColor={colors.primaryDark} />
          <InfoCard index={2} icon="shield-checkmark-outline" label="Garantia"
            value="Ativa" valueColor={colors.primaryDark} />
        </View>

        {/* Manutenções do backend */}
        {manutencoes.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Histórico</Text>
              <Text style={styles.sectionHint}>{manutencoes.length} registro(s)</Text>
            </View>

            {manutencoes.map((m) => (
              <View key={m.id} style={styles.manutCard}>
                <View style={styles.manutLeft}>
                  <Text style={styles.manutTipo} numberOfLines={1}>{m.tipo}</Text>
                  <Text style={styles.manutDesc} numberOfLines={2}>{m.descricao}</Text>
                  <Text style={styles.manutData}>
                    {m.data_inicio ? formatarData(m.data_inicio) : 'Sem data'}
                  </Text>
                </View>
                <View style={[styles.manutStatus,
                  m.status === 'CONCLUIDO'    && styles.manutStatusDone,
                  m.status === 'EM_ANDAMENTO' && styles.manutStatusActive,
                ]}>
                  <Text style={styles.manutStatusText}>
                    {m.status === 'CONCLUIDO' ? 'Concluído' : m.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Pendente'}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Ações */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ações disponíveis</Text>
          <Text style={styles.sectionHint}>Escolha uma opção</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.88} onPress={handleSchedule}>
          <View style={styles.primaryButtonIcon}>
            <Ionicons
              name="calendar"
              size={20}
              color={colors.white}
            />
          </View>
          <View style={styles.primaryButtonTextBox}>
            <Text style={styles.primaryButtonText}>Agendar manutenção</Text>
            <Text style={styles.primaryButtonSub}>Escolha uma data para revisão</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.88} onPress={handleReport}>
            <View style={styles.actionIconWarning}>
              <Ionicons
                name="warning-outline"
                size={20}
                color={colors.surface}
              />
            </View>
            <Text style={styles.actionTitle}>Reportar ocorrência</Text>
            <Text style={styles.actionText}>Informe danos ou alterações percebidas.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCardLast} activeOpacity={0.88} onPress={handleEmergency}>
            <View style={styles.actionIconDanger}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={colors.white}
              />
            </View>
            <Text style={styles.actionTitle}>Inspeção emergencial</Text>
            <Text style={styles.actionText}>Para impactos estruturais ou urgências.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningCard}>
          <View style={styles.warningIcon}>
            <Ionicons name="information-circle-outline" size={20} color={colors.white} />
          </View>
          <Text style={styles.warningText}>
            Impactos estruturais devem ser inspecionados imediatamente para manter a segurança e a garantia da blindagem.
          </Text>
        </View>

        <TouchableOpacity style={styles.whatsappButton} activeOpacity={0.88} onPress={handleWhatsapp}>
          <Ionicons name="logo-whatsapp" size={19} color={colors.textLight} />
          <Text style={styles.whatsappText}>Fale conosco no WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  glowOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primarySoft,
    top: 90,
    right: -100,
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
    shadowOffset: { width: 0, height: 4 },
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  heroCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 34,
    padding: 22,
    marginBottom: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 5,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  heroTextBox: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    fontSize: 24,
    color: colors.textPrimary,
    lineHeight: 30,
    fontFamily: fonts.title,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 6,
    fontFamily: fonts.body,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  statusBadgeText: {
    fontSize: 12,
    color: colors.surface,
    marginLeft: 5,
    fontFamily: fonts.subtitle,
  },
  integrityBox: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },
  integrityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  integrityLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fonts.subtitle,
  },
  integritySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    fontFamily: fonts.body,
  },
  integrityValue: {
    fontSize: 24,
    color: colors.primaryDark,
    fontFamily: fonts.title,
  },
  integrityBar: {
    width: '100%',
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  integrityFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  approvalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMutedo,
    borderRadius: 18,
    padding: 12,
  },
  approvalText: {
    flex: 1,
    fontSize: 13,
    color: colors.surface,
    marginLeft: 8,
    lineHeight: 18,
    fontFamily: fonts.subtitle,
  },
  infoGrid: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.body,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 2,
    fontFamily: fonts.subtitle,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.bodySemiBold,
  },
  
  // === ESTILOS QUE ESTAVAM FALTANDO DOS CARDS DE HISTÓRICO ===
  manutCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  manutLeft: {
    flex: 1,
    paddingRight: 12,
  },
  manutTipo: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fonts.subtitle,
  },
  manutDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.body,
    marginTop: 4,
  },
  manutData: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.body,
    marginTop: 8,
  },
  manutStatus: {
    backgroundColor: colors.surfaceDark, // Status pendente
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  manutStatusDone: {
    backgroundColor: colors.primarySoft,
  },
  manutStatusActive: {
    backgroundColor: colors.primary,
  },
  manutStatusText: {
    fontSize: 11,
    color: colors.textLight,
    fontFamily: fonts.button,
  },
  // ==========================================================

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 28,
    padding: 16,
    marginBottom: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  primaryButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  primaryButtonTextBox: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 16,
    color: colors.textLight,
    fontFamily: fonts.button,
  },
  primaryButtonSub: {
    fontSize: 12,
    color: colors.textLightMuted,
    marginTop: 2,
    fontFamily: fonts.body,
  },
  actionGrid: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 26,
    padding: 15,
    marginRight: 10,
    minHeight: 140,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  actionCardLast: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 26,
    padding: 15,
    minHeight: 140,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  actionIconWarning: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.red || '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIconDanger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.red || '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
    fontFamily: fonts.subtitle,
  },
  actionText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginTop: 6,
    fontFamily: fonts.body,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningSoft || '#FF9500',
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
  },
  warningIcon: {
    marginRight: 9,
    marginTop: 1,
  },
  warningText: {
    flex: 1,
    fontSize: 15,
    color: colors.white,
    lineHeight: 18,
    fontFamily: fonts.subtitle,
  },
  whatsappButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  whatsappText: {
    fontSize: 15,
    color: colors.textLight,
    marginLeft: 8,
    fontFamily: fonts.button,
  },
});