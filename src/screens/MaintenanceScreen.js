// Tela de Manutenção — status do veículo e agendamentos

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { maintenance } from '../services/mockData';
import colors from '../styles/colors';

// Componente de item de informação (label + valor)
function InfoRow({ icon, label, value, valueColor }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={16} color={colors.textMuted} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

export default function MaintenanceScreen() {
  const insets = useSafeAreaInsets();

  const handleSchedule = () => {
    Alert.alert('Agendamento', 'Abrindo agenda para manutenção...');
  };

  const handleReport = () => {
    Alert.alert('Ocorrência', 'Formulário de ocorrência em breve.');
  };

  const handleEmergency = () => {
    Alert.alert(
      'Inspeção de Emergência',
      'Para impactos estruturais, entre em contato imediatamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'WhatsApp', onPress: () => console.log('Abre WhatsApp') },
      ]
    );
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <Header title="Manutenção" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text style={styles.sectionTitle}>Revisão geral da blindagem</Text>
        <Text style={styles.sectionSub}>Revisão anual obrigatória para manutenção da garantia</Text>

        {/* Card de status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusCardTitle}>Status geral do veículo</Text>

          <InfoRow
            icon="calendar-outline"
            label="Última manutenção"
            value={maintenance.lastMaintenance}
          />
          <View style={styles.divider} />

          <InfoRow
            icon="time-outline"
            label="Próxima revisão"
            value={maintenance.nextRevision}
            valueColor={colors.warning}
          />
          <View style={styles.divider} />

          <InfoRow
            icon="shield-checkmark-outline"
            label="Garantia"
            value={maintenance.warrantyStatus}
            valueColor={colors.success}
          />
          <View style={styles.divider} />

          {/* Barra de integridade estrutural */}
          <View style={styles.integritySection}>
            <View style={styles.integrityHeader}>
              <View style={styles.infoLeft}>
                <Ionicons name="construct-outline" size={16} color={colors.textMuted} />
                <Text style={styles.infoLabel}>Integridade estrutural</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.success }]}>
                {maintenance.structuralIntegrity}%
              </Text>
            </View>
            <View style={styles.integrityBar}>
              <View style={[styles.integrityFill, { width: `${maintenance.structuralIntegrity}%` }]} />
            </View>
          </View>

          {/* Tag de aprovação */}
          <View style={styles.approvalTag}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.approvalText}>
              Veículo dentro dos padrões técnicos recomendados
            </Text>
          </View>
        </View>

        {/* Botões de ação */}
        <Text style={styles.actionsTitle}>Ações disponíveis</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSchedule}>
          <Ionicons name="calendar" size={20} color={colors.background} />
          <Text style={styles.primaryButtonText}>Agendar manutenção</Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleReport}>
            <Ionicons name="warning-outline" size={18} color={colors.warning} />
            <Text style={[styles.secondaryButtonText, { color: colors.warning }]}>
              Reportar ocorrência
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.danger + '40' }]}
            onPress={handleEmergency}
          >
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={[styles.secondaryButtonText, { color: colors.danger }]}>
              Inspeção emergencial
            </Text>
          </TouchableOpacity>
        </View>

        {/* Aviso de emergência */}
        <View style={styles.emergencyNote}>
          <Ionicons name="information-circle-outline" size={16} color={colors.warning} />
          <Text style={styles.emergencyNoteText}>
            Impactos estruturais devem ser inspecionados imediatamente.
          </Text>
        </View>

        {/* Botão WhatsApp */}
        <TouchableOpacity style={styles.whatsappButton}>
          <Ionicons name="logo-whatsapp" size={18} color={colors.success} />
          <Text style={styles.whatsappText}>Fale conosco no WhatsApp</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  statusCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  integritySection: {
    paddingVertical: 10,
  },
  integrityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  integrityBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  integrityFill: {
    height: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  approvalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.success + '15',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  approvalText: {
    flex: 1,
    fontSize: 13,
    color: colors.success,
    fontWeight: '500',
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.background,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  emergencyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.warning + '15',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  emergencyNoteText: {
    flex: 1,
    fontSize: 12,
    color: colors.warning,
    lineHeight: 18,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.success + '40',
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: colors.success + '10',
  },
  whatsappText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
});