// Tela Home — página principal após o login
// Exibe saudação ao usuário e lista de veículos cadastrados

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import VehicleCard from '../components/VehicleCard';
import { user, vehicles } from '../services/mockData';
import colors from '../styles/colors';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Ao clicar em um veículo, vai para tela de Progresso
  const handleVehiclePress = (vehicle) => {
    navigation.navigate('Progress', { vehicle });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho personalizado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user.name.split(' ')[0]}!</Text>
          <Text style={styles.subtitle}>Acompanhe seus veículos</Text>
        </View>
        {/* Avatar do usuário */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </Text>
        </View>
      </View>

      {/* Banner de resumo */}
      <View style={styles.summaryBanner}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{vehicles.length}</Text>
          <Text style={styles.summaryLabel}>Veículos</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {vehicles.filter(v => v.status === 'Em andamento').length}
          </Text>
          <Text style={styles.summaryLabel}>Em andamento</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {vehicles.filter(v => v.status === 'Concluído').length}
          </Text>
          <Text style={styles.summaryLabel}>Concluídos</Text>
        </View>
      </View>

      {/* Título da seção */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Seus Carros</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de veículos */}
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onPress={() => handleVehiclePress(vehicle)}
        />
      ))}

      {/* Espaço no final para a tab bar */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryGlow,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryBanner: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});