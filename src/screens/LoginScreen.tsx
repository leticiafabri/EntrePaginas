import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error) {
      Alert.alert(
        "Não foi possível entrar",
        error instanceof Error ? error.message : "Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
<Image
  source={require("../../assets/images/logo_entrepaginas.png")}
  style={styles.logoImage}
  resizeMode="contain"
  accessibilityLabel="Logo EntrePáginas"
/>

        <View style={styles.logoContainer}>

          <Text style={styles.subtitle}>
            Um lugar para registrar suas leituras.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>

          <Text style={styles.description}>
            Entre na sua conta para continuar.
          </Text>

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#A39498"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="E-mail"
            accessibilityHint="Digite o e-mail cadastrado na sua conta"
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#A39498"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            accessibilityLabel="Senha"
            accessibilityHint="Digite a senha da sua conta"
          />

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={isSubmitting ? "Entrando na conta" : "Entrar"}
            accessibilityState={{
              disabled: isSubmitting,
              busy: isSubmitting,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator
                color="#FFFFFF"
                accessibilityLabel="Entrando na conta"
              />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Ainda não tem uma conta?{" "}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              accessibilityRole="button"
              accessibilityLabel="Cadastrar uma nova conta"
            >
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Sua próxima leitura começa aqui.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E7",
  },
logoImage: {
  width: 260,
  height: 260,
  alignSelf: "center",
  marginBottom: 15,
},
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
logoText: {
  fontSize: 34,
  fontWeight: "bold",
  color: "#702D3A",
  letterSpacing: -1,
},
  subtitle: {
    fontSize: 14,
    color: "#66545A",
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E8DCD3",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#702D3A",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#66545A",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#66545A",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E8DCD3",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#3D3034",
    marginBottom: 18,
    backgroundColor: "#FFFCF8",
  },
  button: {
    minHeight: 50,
    backgroundColor: "#702D3A",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 24,
  },
  registerText: {
    color: "#66545A",
    fontSize: 14,
  },
  registerLink: {
    color: "#702D3A",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#8C777D",
    fontSize: 13,
    marginTop: 28,
  },
});