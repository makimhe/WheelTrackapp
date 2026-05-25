// Tela de Login - WheelTrack

import React, { useEffect, useRef, useState } from "react";

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
  Animated,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

// Quando tiver backend real, troca para false
const USE_MOCK_LOGIN = true;

// Quando tiver backend real, coloca o endereço da API aqui
const API_URL = "http://SEU_IP_LOCAL:3000";

export default function LoginScreen({ navigation }) {
  // Guarda os dados digitados pelo usuário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Controla se a senha aparece ou fica escondida
  const [showPassword, setShowPassword] = useState(false);

  // Controla o botão "Manter conectado"
  const [keepConnected, setKeepConnected] = useState(false);

  // Controla o carregamento do botão de login
  const [isLoading, setIsLoading] = useState(false);

  const insets = useSafeAreaInsets();

  // Animações do logo
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(-18)).current;

  // Animações do card principal
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(42)).current;

  // Animações dos campos
  const emailOpacity = useRef(new Animated.Value(0)).current;
  const emailTranslate = useRef(new Animated.Value(18)).current;

  const passwordOpacity = useRef(new Animated.Value(0)).current;
  const passwordTranslate = useRef(new Animated.Value(18)).current;

  // Animações do botão
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  // Animação do ícone do olho
  const eyeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrada animada do logo, card e inputs
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),

        Animated.spring(logoTranslate, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),

        Animated.spring(cardTranslate, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),

      Animated.stagger(120, [
        Animated.parallel([
          Animated.timing(emailOpacity, {
            toValue: 1,
            duration: 160,
            useNativeDriver: true,
          }),

          Animated.spring(emailTranslate, {
            toValue: 0,
            friction: 8,
            tension: 70,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(passwordOpacity, {
            toValue: 1,
            duration: 360,
            useNativeDriver: true,
          }),

          Animated.spring(passwordTranslate, {
            toValue: 0,
            friction: 8,
            tension: 70,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    // Faz o botão respirar levemente quando não está carregando
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.025,
          duration: 2000,
          useNativeDriver: true,
        }),

        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    if (!isLoading) {
      pulseAnimation.start();
    } else {
      buttonPulse.stopAnimation();
      buttonPulse.setValue(1);
    }

    return () => {
      pulseAnimation.stop();
    };
  }, [isLoading]);

  // Valida os campos antes de tentar fazer login
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

  // Login falso para testar o app sem backend
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

  // Login real para usar quando o backend estiver pronto
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

  // Faz o login e manda o usuário para a tela principal
  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = USE_MOCK_LOGIN ? await mockLogin() : await realLogin();

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

  // Diminui o botão ao pressionar
  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  // Volta o botão ao tamanho normal
  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();
  };

  // Mostra ou esconde a senha
  const togglePasswordVisibility = () => {
    Animated.sequence([
      Animated.spring(eyeScale, {
        toValue: 0.78,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }),

      Animated.spring(eyeScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }),
    ]).start();

    setShowPassword(!showPassword);
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
        {/* Topo com logo do app */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslate }],
            },
          ]}
        >
          <View style={styles.logoGlow} />

          <Text style={styles.logoText}>WheelTrack</Text>

          <Text style={styles.logoSubText}>
            Proteção inteligente para seu veículo
          </Text>
        </Animated.View>

        {/* Card do formulário de login */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslate }],
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Bem-vindo!</Text>

              <Text style={styles.cardSubtitle}>
                Entre para acompanhar sua blindagem
              </Text>
            </View>
          </View>

          {/* Campo de email */}
          <Animated.View
            style={[
              styles.inputGroup,
              {
                opacity: emailOpacity,
                transform: [{ translateY: emailTranslate }],
              },
            ]}
          >
            <Text style={styles.inputLabel}>Email</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textLightMuted}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Inserir email"
                placeholderTextColor={colors.textLightMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="next"
              />
            </View>
          </Animated.View>

          {/* Campo de senha */}
          <Animated.View
            style={[
              styles.inputGroup,
              {
                opacity: passwordOpacity,
                transform: [{ translateY: passwordTranslate }],
              },
            ]}
          >
            <Text style={styles.inputLabel}>Senha</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textLightMuted}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Inserir senha"
                placeholderTextColor={colors.textLightMuted}
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
                onPress={togglePasswordVisibility}
                disabled={isLoading}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    transform: [{ scale: eyeScale }],
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textLightMuted}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Opção de manter conectado */}
          <View style={styles.keepRow}>
            <Text style={styles.keepText}>Manter conectado</Text>

            <Switch
              value={keepConnected}
              onValueChange={setKeepConnected}
              disabled={isLoading}
              trackColor={{
                false: colors.borderDark,
                true: colors.primaryGlow,
              }}
              thumbColor={
                keepConnected ? colors.primary : colors.textMuted
              }
            />
          </View>

          {/* Botão de entrar */}
          <Animated.View
            style={{
              transform: [
                { scale: buttonScale },
                { scale: buttonPulse },
              ],
            }}
          >
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonLoading,
              ]}
              onPress={handleLogin}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              {isLoading ? (
                <ActivityIndicator
                  color={colors.white}
                  size="small"
                />
              ) : (
                <View style={styles.loginButtonContent}>
                  <Text style={styles.loginButtonText}>Entrar</Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={colors.white}
                  />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Frase final */}
          <Text style={styles.footer}>
            Choose Your Way, We Make Safe
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
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

  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primarySoft,
  },

  logoText: {
    fontSize: 34,
    color: colors.textLight,
    letterSpacing: 3,
    fontFamily: fonts.titleExtra,
  },

  logoSubText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textLightMuted,
    letterSpacing: 0.4,
    fontFamily: fonts.body,
  },

  card: {
    flex: 1,
    width: "100%",
    alignSelf: "stretch",
    marginTop: -20,
    backgroundColor: colors.surfaceDark,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 20,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 34,
  },

  cardTitle: {
    fontSize: 28,
    color: colors.textLight,
    letterSpacing: -1,
    fontFamily: fonts.title,
  },

  cardSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: colors.textLightMuted,
    fontFamily: fonts.body,
  },

  inputGroup: {
    marginBottom: 24,
  },

  inputLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    letterSpacing: 0.3,
    fontFamily: fonts.subtitle,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceDarkSoft,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 58,
    borderWidth: 0.4,
    borderColor: colors.whiteSoft,

    shadowColor: colors.shadow,
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
    color: colors.textLight,
    fontFamily: fonts.body,
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
    color: colors.textLightMuted,
    fontFamily: fonts.body,
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

  loginButtonLoading: {
    opacity: 0.75,
  },

  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    letterSpacing: 0.5,
    marginRight: 8,
    fontFamily: fonts.button,
  },

  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontSize: 13,
    color: colors.textLightMuted,
    fontFamily: fonts.body,
  },
});