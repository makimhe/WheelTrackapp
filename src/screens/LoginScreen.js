// Tela de Login - WheelTrack

import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import colors from "../styles/colors";

// Quando tiver backend real, troca para false
const USE_MOCK_LOGIN = true;

// Quando tiver backend real, coloca o endereço aqui
const API_URL = "http://SEU_IP_LOCAL:3000";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [keepConnected, setKeepConnected] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const insets = useSafeAreaInsets();

  const validateFields = () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password.trim()) {
      Alert.alert(
        "Campos vazios",
        "Por favor, preencha o e-mail e a senha."
      );

      return false;
    }

    if (!cleanEmail.includes("@")) {
      Alert.alert(
        "E-mail inválido",
        "Digite um e-mail válido para continuar."
      );

      return false;
    }

    if (password.length < 4) {
      Alert.alert(
        "Senha muito curta",
        "A senha precisa ter pelo menos 4 caracteres."
      );

      return false;
    }

    return true;
  };

  const mockLogin = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      user: {
        name: "Lavinia Milena",
        email: email.trim(),
      },
      token: "mock-token-carbon",
    };
  };

  const realLogin = async () => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
        keepConnected,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "E-mail ou senha inválidos.");
    }

    return data;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = USE_MOCK_LOGIN
        ? await mockLogin()
        : await realLogin();

      if (data.success || data.token) {
        navigation.replace("Main");
      } else {
        Alert.alert(
          "Erro no Login",
          data.message || "Não foi possível entrar."
        );
      }
    } catch (error) {
      Alert.alert(
        "Erro no Login",
        error.message || "Ocorreu um problema inesperado."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* TOPO */}
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>CARBON</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bem Vindo!</Text>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textMuted}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Inserir email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* SENHA */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textMuted}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Inserir senha"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* SWITCH */}
          <View style={styles.keepRow}>
            <Text style={styles.keepText}>Manter conectado</Text>

            <Switch
              value={keepConnected}
              onValueChange={setKeepConnected}
              disabled={isLoading}
              trackColor={{
                false: colors.border,
                true: colors.primary + "80",
              }}
              thumbColor={
                keepConnected
                  ? colors.primary
                  : colors.textMuted
              }
            />
          </View>

          {/* BOTÃO */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && {
                opacity: 0.75,
              },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator
                color={colors.background}
                size="small"
              />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* FOOTER */}
          <Text style={styles.footer}>
            Choose Your Way, We Make Safe
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
  },

  container: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  logoSection: {
    height: 240,

    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 32,

    color: colors.primary,

    letterSpacing: 3,

    fontFamily: "Outfit_700Bold",
  },

  tagline: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.5,
  },

  card: {
    flex: 1,

    width: "100%",
    alignSelf: "stretch",

    marginTop: -20,

    backgroundColor: colors.surface,

    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,

    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 20,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: -4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 10,
  },

  cardTitle: {
    fontSize: 28,

    color: colors.white,

    marginBottom: 36,

    letterSpacing: -1,

    fontFamily: "Outfit_600SemiBold",
  },

  inputGroup: {
    marginBottom: 24,
  },

  inputLabel: {
    fontSize: 14,

    color: colors.textSecondary,

    marginBottom: 8,

    letterSpacing: 0.3,

    fontFamily: "Outfit_600SemiBold",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.surface2,

    borderRadius: 18,

    paddingHorizontal: 16,

    height: 58,

    borderWidth: 0.4,
    borderColor: "rgba(255,255,255,0.14)",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 5,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,

    fontSize: 16,

    color: colors.textPrimary,

    fontFamily: "Outfit_400Regular",
  },

  eyeButton: {
    padding: 4,
  },

  keepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 6,
    marginBottom: 34,
  },

  keepText: {
    fontSize: 15,

    color: colors.textSecondary,

    fontFamily: "Outfit_400Regular",
  },

  loginButton: {
    backgroundColor: colors.primary,

    height: 58,

    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 8,

    shadowColor: colors.primary,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.35,
    shadowRadius: 16,

    elevation: 8,
  },

  loginButtonText: {
    color: colors.white,

    fontSize: 18,

    letterSpacing: 0.5,

    fontFamily: "Outfit_700Bold",
  },

  footer: {
    marginTop: "auto",

    textAlign: "center",

    fontSize: 13,

    color: colors.textMuted,

    fontFamily: "Outfit_400Regular",
  },
});