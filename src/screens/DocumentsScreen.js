// Tela de Documentos — lista arquivos da blindagem organizados por categoria

import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { documents } from '../services/mockData';
import colors from '../styles/colors';

function AnimatedDocumentItem({ doc, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 70),

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),

        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handleDownload = () => {
    Alert.alert('Download', `Baixando: ${doc.name}`);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <TouchableOpacity
        style={styles.docItem}
        activeOpacity={0.9}
        onPress={handleDownload}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.docIcon}>
          <Ionicons
            name="document-text"
            size={20}
            color="#FFF"
          />
        </View>

        <View style={styles.docInfo}>
          <Text
            style={styles.docName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {doc.name}
          </Text>

          <Text
            style={styles.docMeta}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {doc.type} · {doc.size} · {doc.date}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.downloadBtn}
          activeOpacity={0.8}
          onPress={handleDownload}
        >
          <Ionicons
            name="download-outline"
            size={18}
            color="#FFF"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function DocumentsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = useState('Todos');

  const allDocsCount = documents.reduce(
    (total, category) => total + category.items.length,
    0
  );

  const filters = [
    {
      key: 'Todos',
      label: 'Todos',
    },
    {
      key: 'Contratos',
      label: 'Contratos',
    },
    {
      key: 'Laudos',
      label: 'Laudos',
    },
  ];

  const filteredDocs = documents.filter((category) => {
    const normalizedCategory = category.category.toLowerCase();

    if (activeFilter === 'Todos') {
      return true;
    }

    if (activeFilter === 'Contratos') {
      return (
        normalizedCategory.includes('principais') ||
        normalizedCategory.includes('garantias') ||
        normalizedCategory.includes('manuais')
      );
    }

    if (activeFilter === 'Laudos') {
      return (
        normalizedCategory.includes('laudos') ||
        normalizedCategory.includes('anexos')
      );
    }

    return true;
  });

  const filteredDocsCount = filteredDocs.reduce(
    (total, category) => total + category.items.length,
    0
  );

  const handleDownloadAll = () => {
    Alert.alert('Download', 'Baixando todos os documentos em PDF...');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 120,
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color="#111"
            />
          </TouchableOpacity>

          <View style={styles.headerTextBox}>
            <Text style={styles.headerSmall}>
              Arquivos da blindagem
            </Text>

            <Text style={styles.headerTitle}>
              Documentos
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="folder-open-outline"
              size={22}
              color="#FFF"
            />
          </View>
        </View>

        {/* RESUMO */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTextBox}>
            <Text style={styles.summaryTitle}>
              {allDocsCount} documentos salvos
            </Text>

            <Text style={styles.summaryText}>
              Contratos, certificados, laudos e manuais da blindagem.
            </Text>

            <View style={styles.warrantyBadge}>
              <Ionicons
                name="shield-checkmark"
                size={13}
                color={colors.primary}
              />

              <Text style={styles.warrantyText}>
                Garantia ativa
              </Text>
            </View>
          </View>

          <View style={styles.summaryIcon}>
            <Ionicons
              name="document-lock-outline"
              size={28}
              color={colors.primary}
            />
          </View>
        </View>

        {/* FILTROS */}
        <View style={styles.filters}>
          {filters.map((item) => {
            const isActive = activeFilter === item.key;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.filterButton,
                  isActive && styles.filterButtonActive,
                ]}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(item.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'Todos'
              ? 'Todos os arquivos'
              : activeFilter}
          </Text>

          <Text style={styles.sectionCount}>
            {filteredDocsCount} itens
          </Text>
        </View>

        {/* CATEGORIAS */}
        {filteredDocs.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="folder-open-outline"
              size={38}
              color="#999"
            />

            <Text style={styles.emptyTitle}>
              Nenhum documento encontrado
            </Text>

            <Text style={styles.emptyText}>
              Tente escolher outro filtro.
            </Text>
          </View>
        ) : (
          filteredDocs.map((category) => (
            <View
              key={category.id}
              style={styles.categoryCard}
            >
              <View style={styles.categoryHeader}>
                <View>
                  <Text style={styles.categoryTitle}>
                    {category.category}
                  </Text>

                  <Text style={styles.categorySubtitle}>
                    {category.items.length} arquivos disponíveis
                  </Text>
                </View>

                <View style={styles.categoryIcon}>
                  <Ionicons
                    name="folder-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>
              </View>

              <View style={styles.docList}>
                {category.items.map((doc, index) => (
                  <AnimatedDocumentItem
                    key={`${category.id}-${doc.name}`}
                    doc={doc}
                    index={index}
                  />
                ))}
              </View>
            </View>
          ))
        )}

        {/* BOTÃO BAIXAR TODOS */}
        <TouchableOpacity
          style={styles.downloadAllBtn}
          activeOpacity={0.88}
          onPress={handleDownloadAll}
        >
          <Ionicons
            name="download-outline"
            size={19}
            color="#FFF"
          />

          <Text style={styles.downloadAllText}>
            Baixar todos em PDF
          </Text>
        </TouchableOpacity>

        <Text style={styles.legalNote}>
          Os documentos ficam disponíveis de forma segura durante todo o período de garantia.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E9E9E9',
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

    backgroundColor: '#FFF',

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

  headerTextBox: {
    flex: 1,

    marginLeft: 14,
  },

  headerSmall: {
    fontSize: 13,

    color: '#555',

    fontFamily: 'Outfit_400Regular',
  },

  headerTitle: {
    fontSize: 30,

    color: '#111',

    marginTop: 2,

    fontFamily: 'Outfit_700Bold',
  },

  headerIcon: {
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

  summaryCard: {
    backgroundColor: '#F8F8F8',

    borderRadius: 34,

    padding: 22,

    marginBottom: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 18,

    elevation: 5,
  },

  summaryTextBox: {
    flex: 1,
    paddingRight: 14,
  },

  summaryTitle: {
    fontSize: 22,

    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  summaryText: {
    fontSize: 13,

    color: '#777',

    marginTop: 5,

    lineHeight: 18,

    fontFamily: 'Outfit_400Regular',
  },

  summaryIcon: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: 'rgba(53,56,235,0.10)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  warrantyBadge: {
    alignSelf: 'flex-start',

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: 'rgba(53,56,235,0.10)',

    borderRadius: 999,

    paddingHorizontal: 10,
    paddingVertical: 6,

    marginTop: 14,
  },

  warrantyText: {
    fontSize: 12,

    color: colors.primary,

    marginLeft: 5,

    fontFamily: 'Outfit_700Bold',
  },

  filters: {
    flexDirection: 'row',

    marginBottom: 24,
  },

  filterButton: {
    backgroundColor: '#F8F8F8',

    borderRadius: 999,

    paddingVertical: 10,
    paddingHorizontal: 17,

    marginRight: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,

    elevation: 2,
  },

  filterButtonActive: {
    backgroundColor: '#111',
  },

  filterText: {
    fontSize: 13,

    color: '#777',

    fontFamily: 'Outfit_600SemiBold',
  },

  filterTextActive: {
    color: '#FFF',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,

    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  sectionCount: {
    fontSize: 13,

    color: '#777',

    fontFamily: 'Outfit_600SemiBold',
  },

  categoryCard: {
    backgroundColor: '#F8F8F8',

    borderRadius: 30,

    padding: 18,

    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,

    elevation: 4,
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 14,
  },

  categoryTitle: {
    fontSize: 17,

    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  categorySubtitle: {
    fontSize: 12,

    color: '#777',

    marginTop: 3,

    fontFamily: 'Outfit_400Regular',
  },

  categoryIcon: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: 'rgba(53,56,235,0.10)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  docList: {
    marginTop: 2,
  },

  docItem: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF',

    borderRadius: 20,

    padding: 13,

    marginBottom: 10,
  },

  docIcon: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: '#111',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  docInfo: {
    flex: 1,
    paddingRight: 10,
  },

  docName: {
    fontSize: 14,

    color: '#111',

    fontFamily: 'Outfit_700Bold',
  },

  docMeta: {
    fontSize: 11,

    color: '#777',

    marginTop: 3,

    fontFamily: 'Outfit_400Regular',
  },

  downloadBtn: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: colors.primary,

    alignItems: 'center',
    justifyContent: 'center',
  },

  downloadAllBtn: {
    height: 56,

    borderRadius: 28,

    backgroundColor: '#111',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 8,
    marginBottom: 18,
  },

  downloadAllText: {
    fontSize: 15,

    color: '#FFF',

    marginLeft: 8,

    fontFamily: 'Outfit_700Bold',
  },

  legalNote: {
    fontSize: 12,

    color: '#777',

    textAlign: 'center',

    lineHeight: 18,

    paddingHorizontal: 18,

    fontFamily: 'Outfit_400Regular',
  },

  emptyBox: {
    backgroundColor: '#F8F8F8',

    borderRadius: 28,

    padding: 30,

    alignItems: 'center',

    marginTop: 18,

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

    textAlign: 'center',

    marginTop: 5,

    lineHeight: 18,

    fontFamily: 'Outfit_400Regular',
  },
});