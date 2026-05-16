// Card de veículo — exibido na tela Home
// Mostra: foto, modelo, placa, status, barra de progresso

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default function VehicleCard({ vehicle, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Linha superior: modelo + badge de status */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.model}>{vehicle.model}</Text>
          <Text style={styles.plate}>{vehicle.plate} · {vehicle.color}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: vehicle.statusColor + '22' }]}>
          <View style={[styles.dot, { backgroundColor: vehicle.statusColor }]} />
          <Text style={[styles.badgeText, { color: vehicle.statusColor }]}>
            {vehicle.status}
          </Text>
        </View>
      </View>

      {/* Imagem do carro */}
      <Image source={vehicle.image} style={styles.carImage} resizeMode="contain" />

      {/* Linha inferior: progresso + nível de blindagem */}
      <View style={styles.bottomRow}>
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.progressValue}>{vehicle.progress}%</Text>
          </View>
          {/* Barra de progresso */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${vehicle.progress}%` }]} />
          </View>
        </View>

        <View style={styles.levelBadge}>
          <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
          <Text style={styles.levelText}>Nível {vehicle.blindingLevel}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  model: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  plate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  carImage: {
    width: '100%',
    height: 130,
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressSection: {
    flex: 1,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryGlow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});