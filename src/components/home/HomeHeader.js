import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function HomeHeader({
  firstName,
  userName,
  userEmail,
  onLogout,
  onContact,
}) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.smallText}>Olá, {firstName}</Text>

        <Text style={styles.title}>
          Seus veículos{'\n'}
          blindados
        </Text>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        activeOpacity={0.85}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="person-outline" size={22} color={colors.textLight} />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
        >
          <Pressable style={styles.menuCard}>
            <View style={styles.handle} />

            <View style={styles.accountHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(firstName || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>Conta do cliente</Text>

                <Text style={styles.userName} numberOfLines={1}>
                  {userName || firstName}
                </Text>

                <Text style={styles.userEmail} numberOfLines={1}>
                  {userEmail || 'Cliente WheelTrack'}
                </Text>
              </View>
            </View>

            <View style={styles.statusBox}>
              <View style={styles.statusIcon}>
                <Ionicons
                  name="shield-checkmark"
                  size={18}
                  color={colors.black}
                />
              </View>

              <View style={styles.statusTextBox}>
                <Text style={styles.statusTitle}>Acesso ativo</Text>
                <Text style={styles.statusText}>
                  Sua conta está vinculada ao acompanhamento da blindagem.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuOption}
              activeOpacity={0.82}
              onPress={() => {
                setMenuVisible(false);
                onContact?.();
              }}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={colors.textPrimary}
                />
              </View>

              <View style={styles.optionTextBox}>
                <Text style={styles.optionTitle}>Fale conosco</Text>
                <Text style={styles.optionSubtitle}>
                  Atendimento e suporte da blindagem
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>

            

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.82}
              onPress={() => {
                setMenuVisible(false);
                onLogout?.();
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={18}
                color={colors.danger}
              />

              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  smallText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.body,
    marginBottom: 6,
  },

  title: {
    fontSize: 32,
    color: colors.textPrimary,
    lineHeight: 38,
    fontFamily: fonts.titleExtra,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7,7,9,0.28)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 82,
    paddingHorizontal: 20,
  },

  menuCard: {
    width: 315,
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  handle: {
    alignSelf: 'center',
    width: 34,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    marginBottom: 16,
  },

  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  avatarText: {
    fontSize: 24,
    color: colors.black,
    fontFamily: fonts.title,
  },

  accountInfo: {
    flex: 1,
  },

  accountLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.subtitle,
    marginBottom: 2,
  },

  userName: {
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: fonts.title,
  },

  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.body,
  },

  statusBox: {
    marginTop: 16,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  statusTextBox: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.subtitle,
  },

  statusText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
    fontFamily: fonts.body,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  menuOption: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  optionTextBox: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.subtitle,
  },

  optionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.body,
  },

  logoutButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    fontSize: 14,
    color: colors.danger,
    marginLeft: 7,
    fontFamily: fonts.button,
  },
});