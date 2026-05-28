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
import fonts from '../styles/fonts';

// Item animado de cada documento
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

  // Efeito de apertar o item
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  // Volta ao tamanho normal
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  // Simula download do documento
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
            color={colors.textLight}
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
            color={colors.white}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function DocumentsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Filtro ativo dos documentos
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Conta todos os documentos
  const allDocsCount = documents.reduce(
    (total, category) => total + category.items.length,
    0
  );

  // Filtros da tela
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

  // Filtra documentos por categoria
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

  // Conta documentos filtrados
  const filteredDocsCount = filteredDocs.reduce(
    (total, category) => total + category.items.length,
    0
  );

  // Simula download de todos os documentos
  const handleDownloadAll = () => {
    Alert.alert('Download', 'Baixando todos os documentos em PDF...');
  };

  return (
    <View style={styles.screen}>
      {/* Luzes decorativas do fundo */}
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
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.textPrimary}
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

          
        </View>

        {/* Card de resumo */}
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

        {/* Filtros */}
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

        {/* Título da seção */}
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

        {/* Lista de categorias */}
        {filteredDocs.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="folder-open-outline"
              size={38}
              color={colors.textMuted}
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

        {/* Botão de baixar todos */}
        <TouchableOpacity
          style={styles.downloadAllBtn}
          activeOpacity={0.88}
          onPress={handleDownloadAll}
        >
          <Ionicons
            name="download-outline"
            size={19}
            color={colors.textLight}
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
    backgroundColor: colors.background,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  summaryCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 34,
    padding: 22,
    marginBottom: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: colors.shadow,
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
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  summaryText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 18,
    fontFamily: fonts.body,
  },

  summaryIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  warrantyBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 14,
  },

  warrantyText: {
    fontSize: 12,
    color: colors.primaryDark,
    marginLeft: 5,
    fontFamily: fonts.button,
  },

  filters: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  filterButton: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 17,
    marginRight: 10,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  filterButtonActive: {
    backgroundColor: colors.black,
  },

  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.subtitle,
  },

  filterTextActive: {
    color: colors.textLight,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  sectionCount: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.subtitle,
  },

  categoryCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 30,
    padding: 18,
    marginBottom: 18,

    shadowColor: colors.shadow,
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
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  categorySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    fontFamily: fonts.body,
  },

  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  docList: {
    marginTop: 2,
  },

  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 13,
    marginBottom: 10,
  },

  docIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.black,
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
    color: colors.textPrimary,
    fontFamily: fonts.subtitle,
  },

  docMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    fontFamily: fonts.body,
  },

  downloadBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  downloadAllBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 18,
  },

  downloadAllText: {
    fontSize: 15,
    color: colors.textLight,
    marginLeft: 8,
    fontFamily: fonts.button,
  },

  legalNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 18,
    fontFamily: fonts.body,
  },

  emptyBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 28,
    padding: 30,
    alignItems: 'center',
    marginTop: 18,

    shadowColor: colors.shadow,
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
    color: colors.textPrimary,
    marginTop: 12,
    fontFamily: fonts.title,
  },

  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
    fontFamily: fonts.body,
  },
});