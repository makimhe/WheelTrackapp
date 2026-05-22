import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { user, vehicles, notifications } from '../services/mockData';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

import HomeHeader from '../components/home/HomeHeader';
import HomeSummaryCard from '../components/home/HomeSummaryCard';
import HomeStats from '../components/home/HomeStats';
import LatestUpdateCard from '../components/home/LatestUpdateCard';
import VehicleFilters from '../components/home/VehicleFilters';
import HomeVehicleCard from '../components/home/HomeVehicleCard';
import EmptyVehicleState from '../components/home/EmptyVehicleState';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Pega o primeiro nome do usuário
  const firstName = user.name.split(' ')[0];

  // Conta notificações não lidas
  const unread = notifications.filter((item) => !item.read).length;

  // Conta os veículos por status
  const totalVehicles = vehicles.length;

  const inProgressVehicles = vehicles.filter(
    (vehicle) => vehicle.status?.toLowerCase().trim() === 'em andamento'
  ).length;

  const completedVehicles = vehicles.filter(
    (vehicle) => vehicle.status?.toLowerCase().trim() === 'concluído'
  ).length;

  // Pega a última notificação não lida ou a primeira da lista
  const latestNotification =
    notifications.find((notification) => !notification.read) ||
    notifications[0];

  // Estados da busca e dos filtros
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Lista de filtros da tela
  const filters = [
    {
      key: 'all',
      label: 'Todos',
      count: totalVehicles,
    },
    {
      key: 'progress',
      label: 'Em andamento',
      count: inProgressVehicles,
    },
    {
      key: 'done',
      label: 'Concluídos',
      count: completedVehicles,
    },
  ];

  // Filtra os veículos por texto e status
  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      vehicle.model?.toLowerCase().includes(searchText) ||
      vehicle.plate?.toLowerCase().includes(searchText);

    const normalizedStatus = vehicle.status?.toLowerCase().trim();

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'progress'
          ? normalizedStatus === 'em andamento'
          : normalizedStatus === 'concluído';

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.wrapper}>
      {/* Luzes decorativas do fundo */}
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 130,
        }}
      >
        {/* Cabeçalho da Home */}
        <HomeHeader
          firstName={firstName}
          unread={unread}
          onPressNotifications={() => navigation.navigate('Notificações')}
        />

        {/* Card principal de resumo */}
        <HomeSummaryCard
          inProgressVehicles={inProgressVehicles}
        />

        {/* Cards pequenos de estatísticas */}
        <HomeStats
          totalVehicles={totalVehicles}
          inProgressVehicles={inProgressVehicles}
          completedVehicles={completedVehicles}
        />

        {/* Última atualização */}
        <LatestUpdateCard
          notification={latestNotification}
        />

        {/* Campo de busca */}
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textMuted}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por modelo ou placa"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />

          {search.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setSearch('')}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros da lista de veículos */}
        <VehicleFilters
          filters={filters}
          activeFilter={filter}
          onChangeFilter={setFilter}
        />

        {/* Título da lista */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filter === 'all'
              ? 'Veículos'
              : filter === 'progress'
                ? 'Em andamento'
                : 'Concluídos'}
          </Text>

          <Text style={styles.sectionHint}>
            {filteredVehicles.length} resultado(s)
          </Text>
        </View>

        {/* Lista de veículos */}
        {filteredVehicles.length === 0 ? (
          <EmptyVehicleState />
        ) : (
          filteredVehicles.map((vehicle, index) => (
            <HomeVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              navigation={navigation}
              index={index}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#E9E9E9',
    paddingHorizontal: 20,
  },

  glowOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(53,56,235,0.13)',
    top: 90,
    right: -100,
  },

  glowTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.55)',
    top: 360,
    left: -90,
  },

  searchBox: {
    height: 54,
    backgroundColor: '#111',
    borderRadius: 27,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    marginLeft: 10,
    marginRight: 8,
    fontFamily: fonts.body,
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 20,
    color: '#111',
    fontFamily: fonts.title,
  },

  sectionHint: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
    fontFamily: fonts.body,
  },
});