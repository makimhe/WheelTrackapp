import React, { useState, useEffect, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { getVeiculosDoUsuario, getBlindagemPorPlaca } from '../services/api';

import HomeHeader from '../components/home/HomeHeader';
import HomeSummaryCard from '../components/home/HomeSummaryCard';
import HomeStats from '../components/home/HomeStats';
import VehicleFilters from '../components/home/VehicleFilters';
import HomeVehicleCard from '../components/home/HomeVehicleCard';
import EmptyVehicleState from '../components/home/EmptyVehicleState';

function formatarStatus(statusBackend) {
  if (!statusBackend) return 'Pendente';
  switch (statusBackend.toUpperCase()) {
    case 'EM_ANDAMENTO': return 'Em andamento';
    case 'CONCLUIDO':    return 'Concluído';
    case 'PENDENTE':     return 'Pendente';
    default:             return statusBackend;
  }
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const id    = await AsyncStorage.getItem('id');
      const email = await AsyncStorage.getItem('email');
      setUserEmail(email || '');

      // Busca veículos do usuário — agora tem modelo, cor, foto_url
      const veiculosRaw = await getVeiculosDoUsuario(id);

      const veiculosFormatados = await Promise.all(
        veiculosRaw.map(async (v) => {
          const blindagem = await getBlindagemPorPlaca(v.placa).catch(() => null);
          const status    = formatarStatus(blindagem?.status);
          const progress  = status === 'Concluído' ? 100 : status === 'Em andamento' ? 50 : 0;

          return {
            id:            v.placa,
            model:         v.modelo || `Veículo ${v.placa}`,  // usa o modelo real
            plate:         v.placa,
            cor:           v.cor || '',
            status,
            progress,
            blindingLevel: blindagem?.nivel_blindagem || '—',
            currentStep:   blindagem ? formatarStatus(blindagem.status) : 'Aguardando início',
            // foto_url do Cloudinary — se tiver, usa; senão imagem padrão
            image:         v.foto_url ? v.foto_url : require('../../assets/cars/byd.png'),
            steps:         [],
            blindagemId:   blindagem?.id || null,
          };
        })
      );

      setVehicles(veiculosFormatados);

      // Extrai nome do email (ex: lavinia2@wheeltrack.com → lavinia2)
      const nomeDoEmail = email ? email.split('@')[0] : 'Cliente';
      setUserName(nomeDoEmail);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os veículos.');
      console.error('Erro ao carregar home:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, []);

  const totalVehicles      = vehicles.length;
  const inProgressVehicles = vehicles.filter(v => v.status?.toLowerCase().trim() === 'em andamento').length;
  const completedVehicles  = vehicles.filter(v => v.status?.toLowerCase().trim() === 'concluído').length;

  const filters = [
    { key: 'all',      label: 'Todos',        count: totalVehicles },
    { key: 'progress', label: 'Em andamento', count: inProgressVehicles },
    { key: 'done',     label: 'Concluídos',   count: completedVehicles },
  ];

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText       = search.toLowerCase().trim();
    const matchesSearch    = vehicle.model?.toLowerCase().includes(searchText) ||
                             vehicle.plate?.toLowerCase().includes(searchText);
    const normalizedStatus = vehicle.status?.toLowerCase().trim();
    const matchesFilter    = filter === 'all' ? true
      : filter === 'progress' ? normalizedStatus === 'em andamento'
      : normalizedStatus === 'concluído';

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <View style={[styles.wrapper, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 130 }}
      >
        <HomeHeader
          firstName={userName}
          userName={userName}
          userEmail={userEmail}
          onContact={() => console.log('Fale conosco')}
          onLogout={async () => {
            await AsyncStorage.multiRemove(['token', 'role', 'email', 'id']);
            navigation.replace('Login');
          }}
        />

        <HomeSummaryCard inProgressVehicles={inProgressVehicles} />

        <HomeStats
          totalVehicles={totalVehicles}
          inProgressVehicles={inProgressVehicles}
          completedVehicles={completedVehicles}
        />

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por modelo ou placa"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity activeOpacity={0.75} onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <VehicleFilters filters={filters} activeFilter={filter} onChangeFilter={setFilter} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filter === 'all' ? 'Veículos' : filter === 'progress' ? 'Em andamento' : 'Concluídos'}
          </Text>
          <Text style={styles.sectionHint}>{filteredVehicles.length} resultado(s)</Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowOne: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: colors.primarySoft, top: 90, right: -100,
  },
  glowTwo: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: colors.whiteSoft, top: 360, left: -90,
  },
  searchBox: {
    height: 54,
    backgroundColor: colors.black,
    borderRadius: 21,

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
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
  sectionHeader: { marginBottom: 18 },
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