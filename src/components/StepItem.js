// Componente de Etapa — usado na tela de Progresso
// Mostra: número, título, status, sub-etapas

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default function StepItem({ step, index }) {
  // Controla se o card está expandido ou não
  const [expanded, setExpanded] = useState(step.status === 'active');

  // Define cor e ícone baseado no status
  const getStatusStyle = () => {
    if (step.status === 'completed') {
      return { color: colors.success, icon: 'checkmark-circle', bg: colors.success + '22' };
    }
    if (step.status === 'active') {
      return { color: colors.primary, icon: 'time', bg: colors.primaryGlow };
    }
    return { color: colors.textMuted, icon: 'ellipse-outline', bg: colors.surfaceLight };
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={styles.container}>
      {/* Linha vertical de conexão (aparece em todos menos o último) */}
      <View style={styles.leftColumn}>
        <View style={[styles.iconCircle, { backgroundColor: statusStyle.bg }]}>
          <Ionicons name={statusStyle.icon} size={16} color={statusStyle.color} />
        </View>
        <View style={[styles.line, { backgroundColor: step.status === 'pending' ? colors.border : statusStyle.color + '55' }]} />
      </View>

      {/* Conteúdo da etapa */}
      <TouchableOpacity
        style={styles.content}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        {/* Cabeçalho da etapa */}
        <View style={styles.stepHeader}>
          <View style={styles.stepTitleRow}>
            <Text style={styles.stepNumber}>Etapa {index + 1}</Text>
            <Text style={[styles.stepStatus, { color: statusStyle.color }]}>
              {step.status === 'completed' ? 'Concluído' :
               step.status === 'active' ? 'Em andamento' : 'Pendente'}
            </Text>
          </View>
          <View style={styles.stepTitleExpand}>
            <Text style={[
              styles.stepTitle,
              step.status === 'pending' && { color: colors.textSecondary }
            ]}>
              {step.title}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.textMuted}
            />
          </View>
        </View>

        {/* Sub-etapas (mostradas quando expandido) */}
        {expanded && (
          <View style={styles.substeps}>
            {step.substeps.map((sub, i) => (
              <View key={i} style={styles.substepRow}>
                <Ionicons
                  name={sub.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={14}
                  color={sub.done ? colors.success : colors.textMuted}
                />
                <Text style={[
                  styles.substepText,
                  sub.done && { color: colors.textSecondary, textDecorationLine: 'line-through' }
                ]}>
                  {sub.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  leftColumn: {
    alignItems: 'center',
    width: 36,
    marginRight: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
    minHeight: 16,
  },
  content: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepHeader: {
    gap: 4,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepStatus: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepTitleExpand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  stepTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  substeps: {
    marginTop: 12,
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  substepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  substepText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});