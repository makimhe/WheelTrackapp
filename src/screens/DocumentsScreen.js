// Tela de Documentos — lista arquivos da blindagem organizados por categoria

import React, { useState } from 'react';
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
import { documents } from '../services/mockData';
import colors from '../styles/colors';

// Componente de item de documento
function DocumentItem({ doc }) {
  const handleDownload = () => {
    // Em um app real, aqui faria o download
    Alert.alert('Download', `Baixando: ${doc.name}`);
  };

  return (
    <View style={styles.docItem}>
      {/* Ícone de PDF */}
      <View style={styles.docIcon}>
        <Ionicons name="document" size={20} color={colors.danger} />
      </View>

      {/* Info do documento */}
      <View style={styles.docInfo}>
        <Text style={styles.docName}>{doc.name}</Text>
        <Text style={styles.docMeta}>{doc.type} · {doc.size} · {doc.date}</Text>
      </View>

      {/* Botão de download */}
      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
        <Ionicons name="download-outline" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();

  // Filtros de categoria
  const [activeFilter, setActiveFilter] = useState('Todos');
  const filters = ['Todos', 'Contratos', 'Laudos'];

  // Filtra as categorias baseado no filtro ativo
  const filteredDocs = documents.filter(cat => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Contratos') return cat.category.includes('principais') || cat.category.includes('Garantias');
    if (activeFilter === 'Laudos') return cat.category.includes('Laudos');
    return true;
  });

  const handleDownloadAll = () => {
    Alert.alert('Download', 'Baixando todos os documentos em PDF...');
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <Header title="Documentos" />

      {/* Sub-título */}
      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Documentos da sua blindagem</Text>
        <View style={styles.warrantyBadge}>
          <Ionicons name="shield-checkmark" size={12} color={colors.success} />
          <Text style={styles.warrantyText}>Garantia ativa</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredDocs.map(category => (
          <View key={category.id} style={styles.section}>
            {/* Título da seção */}
            <Text style={styles.categoryTitle}>{category.category}</Text>

            {/* Documentos da seção */}
            <View style={styles.docList}>
              {category.items.map((doc, index) => (
                <DocumentItem key={index} doc={doc} />
              ))}
            </View>
          </View>
        ))}

        {/* Botão de baixar todos */}
        <TouchableOpacity style={styles.downloadAllBtn} onPress={handleDownloadAll}>
          <Ionicons name="download-outline" size={18} color={colors.background} />
          <Text style={styles.downloadAllText}>Baixar todos em PDF</Text>
        </TouchableOpacity>

        {/* Aviso legal */}
        <Text style={styles.legalNote}>
          Os documentos ficam disponíveis de forma segura durante todo o período de garantia.
        </Text>

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
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  warrantyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success + '22',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  warrantyText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  docList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  docIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.danger + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  docMeta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  downloadAllText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.background,
  },
  legalNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});