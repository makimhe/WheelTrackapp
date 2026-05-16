// Estilos globais reutilizáveis
// Ao invés de repetir estilos, importamos daqui

import { StyleSheet } from 'react-native';
import colors from './colors';

const globalStyles = StyleSheet.create({
  // Container padrão das telas
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Card padrão
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Títulos
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  // Texto pequeno
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Botão principal
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  buttonPrimaryText: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },

  // Separador horizontal
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },

  // Badge de status
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
});

export default globalStyles;