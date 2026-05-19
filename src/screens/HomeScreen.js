import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { user, vehicles, notifications } from '../services/mockData';
import colors from '../styles/colors';

function AnimatedVehicleCard({ vehicle, navigation, index }) {
  const progress = Math.min(vehicle.progress || 65, 100);

  const [animatedProgress, setAnimatedProgress] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progressListener = progressAnim.addListener(({ value }) => {
      setAnimatedProgress(Math.round(value));
    });

    Animated.sequence([
      Animated.delay(index * 120),

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),

        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),

        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    return () => {
      progressAnim.removeListener(progressListener);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const imageSource =
    typeof vehicle.image === 'string'
      ? { uri: vehicle.image }
      : vehicle.image;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.cardWrapper}
        onPress={() =>
          navigation.navigate('Progresso', {
            vehicle,
          })
        }
      >
        <BlurView intensity={45} tint="light" style={styles.card}>
          {/* TOP */}
          <View style={styles.cardTop}>
            <View style={styles.rating}>
              <Ionicons
                name="shield-checkmark"
                size={13}
                color="#000"
              />

              <Text style={styles.ratingText}>Blindado</Text>
            </View>

            <TouchableOpacity
              style={styles.heartButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="heart-outline"
                size={18}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* IMAGE */}
          <Animated.Image
            source={imageSource}
            style={[
              styles.carImage,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 24],
                      outputRange: [0, 12],
                    }),
                  },
                ],
              },
            ]}
            resizeMode="contain"
          />

          {/* INFO */}
          <View style={styles.infoRow}>
            <View style={styles.carInfo}>
              <Text style={styles.carName}>{vehicle.model}</Text>

              <Text style={styles.carSubtitle}>{vehicle.plate}</Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{vehicle.status}</Text>
            </View>
          </View>

          {/* PROGRESS */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Progresso da blindagem
              </Text>

              <Text style={styles.progressValue}>
                {animatedProgress}%
              </Text>
            </View>

            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,
                  },
                ]}
              />
            </View>
          </View>

          {/* BOTTOM */}
          <View style={styles.bottomRow}>
            <View style={styles.bottomInfo}>
              <Text style={styles.bottomSmall}>Etapa atual</Text>

              <Text
                style={styles.bottomBig}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {vehicle.currentStep || 'Estrutura'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.detailsButton}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('Progresso', {
                  vehicle,
                })
              }
            >
              <Text
                style={styles.detailsText}
                numberOfLines={1}
              >
                Ver detalhes
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const unread = notifications.filter((n) => !n.read).length;
  const firstName = user.name.split(' ')[0];

  const [search, setSearch] = useState('');
  const [onlyInProgress, setOnlyInProgress] = useState(false);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const vehicleModel = vehicle.model?.toLowerCase() || '';
    const vehiclePlate = vehicle.plate?.toLowerCase() || '';
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      vehicleModel.includes(searchText) ||
      vehiclePlate.includes(searchText);

    const matchesFilter = onlyInProgress
      ? vehicle.status?.toLowerCase().trim() === 'em andamento'
      : true;

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
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>Olá, {firstName}</Text>

            <Text style={styles.title}>
              Seus veículos{'\n'}
              blindados
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Notificações')}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#FFF"
            />

            {unread > 0 && <View style={styles.dot} />}
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar veículo"
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />

            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch('')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.filterButton,
              onlyInProgress && styles.filterButtonActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setOnlyInProgress(!onlyInProgress)}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>

        {/* CARDS */}
        <Text style={styles.sectionTitle}>
          {onlyInProgress ? 'Em andamento' : 'Todos os veículos'}
        </Text>

        {filteredVehicles.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="car-outline"
              size={32}
              color="#999"
            />

            <Text style={styles.emptyTitle}>
              Nenhum veículo encontrado
            </Text>

            <Text style={styles.emptyText}>
              Tente buscar por outro modelo ou placa.
            </Text>
          </View>
        ) : (
          filteredVehicles.map((vehicle, index) => (
            <AnimatedVehicleCard
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

    backgroundColor: 'rgba(53,56,235,0.16)',

    top: 90,
    right: -90,
  },

  glowTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,

    backgroundColor: 'rgba(255,255,255,0.55)',

    top: 330,
    left: -80,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 26,
  },

  smallText: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Outfit_400Regular',
    marginBottom: 6,
  },

  title: {
    fontSize: 32,
    color: '#111',
    lineHeight: 38,
    fontFamily: 'Outfit_700Bold',
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: '#111',

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: '#FF4D4D',

    position: 'absolute',
    top: 12,
    right: 12,
  },

  searchRow: {
    flexDirection: 'row',
    marginBottom: 28,
    gap: 12,
  },

  searchBox: {
    flex: 1,
    height: 54,

    backgroundColor: '#111',

    borderRadius: 27,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,

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

    fontFamily: 'Outfit_400Regular',
  },

  filterButton: {
    width: 54,
    height: 54,

    borderRadius: 27,

    backgroundColor: '#111',

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
  },

  sectionTitle: {
    fontSize: 20,
    color: '#111',

    marginBottom: 20,

    fontFamily: 'Outfit_700Bold',
  },

  cardWrapper: {
    marginBottom: 28,

    borderRadius: 34,

    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 22,

    elevation: 8,
  },

  card: {
    backgroundColor: 'rgba(248,248,248,0.72)',

    borderRadius: 34,

    padding: 22,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.58)',
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    zIndex: 2,
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.68)',

    borderRadius: 999,

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },

  ratingText: {
    fontSize: 11,
    color: '#111',

    marginLeft: 5,

    fontFamily: 'Outfit_600SemiBold',
  },

  heartButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: 'rgba(255,255,255,0.68)',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },

  carImage: {
    width: '100%',
    height: 180,

    marginTop: 12,
    marginBottom: 18,

    alignSelf: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  carInfo: {
    flex: 1,
    paddingRight: 10,
  },

  carName: {
    fontSize: 28,
    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  carSubtitle: {
    fontSize: 14,
    color: '#777',

    marginTop: 2,

    fontFamily: 'Outfit_400Regular',
  },

  statusBadge: {
    backgroundColor: '#111',

    borderRadius: 999,

    paddingHorizontal: 16,
    paddingVertical: 9,
  },

  statusText: {
    color: '#FFF',

    fontSize: 12,

    fontFamily: 'Outfit_600SemiBold',
  },

  progressSection: {
    marginTop: 24,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 10,
  },

  progressLabel: {
    fontSize: 14,
    color: '#777',

    fontFamily: 'Outfit_400Regular',
  },

  progressValue: {
    fontSize: 14,
    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  progressBar: {
    width: '100%',
    height: 9,

    borderRadius: 999,

    backgroundColor: 'rgba(0,0,0,0.12)',

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    borderRadius: 999,

    backgroundColor: colors.primary,
  },

  bottomRow: {
    marginTop: 27,

    flexDirection: 'row',
    alignItems: 'flex-end',

    width: '100%',
  },

  bottomInfo: {
    flex: 1,
    maxWidth: '58%',
    paddingRight: 8,
  },

  bottomSmall: {
    fontSize: 12,
    color: '#777',

    fontFamily: 'Outfit_400Regular',
  },

  bottomBig: {
    fontSize: 15,
    color: '#111',

    marginTop: 2,

    fontFamily: 'Outfit_700Bold',
  },

  detailsButton: {
    width: 112,
    height: 46,

    backgroundColor: '#111',

    borderRadius: 27,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 'auto',
  },

  detailsText: {
    color: '#FFF',

    fontSize: 12,

    fontFamily: 'Outfit_600SemiBold',
  },

  emptyBox: {
    backgroundColor: 'rgba(248,248,248,0.8)',

    borderRadius: 28,

    padding: 28,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.58)',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 16,

    elevation: 4,
  },

  emptyTitle: {
    fontSize: 18,
    color: '#111',

    marginTop: 12,

    fontFamily: 'Outfit_700Bold',
  },

  emptyText: {
    fontSize: 13,
    color: '#777',

    marginTop: 4,
    textAlign: 'center',

    fontFamily: 'Outfit_400Regular',
  },
});