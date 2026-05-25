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

  const firstName = user.name.split(' ')[0];

  const totalVehicles = vehicles.length;

  const inProgressVehicles = vehicles.filter(
    (vehicle) => vehicle.status?.toLowerCase().trim() === 'em andamento'
  ).length;

  const completedVehicles = vehicles.filter(
    (vehicle) => vehicle.status?.toLowerCase().trim() === 'concluído'
  ).length;

  const latestNotification =
    notifications.find((notification) => !notification.read) ||
    notifications[0];

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

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
        <HomeHeader
  firstName={firstName}
  userName={user.name}
  userEmail={user.email}
  onContact={() => console.log('Fale conosco')}
  onLogout={() => navigation.replace('Login')}
/>

        <HomeSummaryCard inProgressVehicles={inProgressVehicles} />

        <HomeStats
          totalVehicles={totalVehicles}
          inProgressVehicles={inProgressVehicles}
          completedVehicles={completedVehicles}
        />

        

        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textMuted}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por modelo ou placa"
            placeholderTextColor={colors.textMuted}
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

        <VehicleFilters
          filters={filters}
          activeFilter={filter}
          onChangeFilter={setFilter}
        />

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
    backgroundColor: colors.background,
    paddingHorizontal: 20,
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

  searchBox: {
    height: 54,
    backgroundColor: colors.black,
    borderRadius: 27,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,
    marginBottom: 14,

    shadowColor: colors.shadow,
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
    color: colors.textLight,
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