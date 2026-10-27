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

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Senhas diferentes", "As senhas digitadas não coincidem.");
      return;
    }

    try {
      setIsSubmitting(true);

      await signUp(name.trim(), email.trim(), password);

      Alert.alert(
        "Conta criada!",
        "Seu cadastro foi realizado com sucesso.",
      );
    } catch (error) {
      Alert.alert(
        "Não foi possível cadastrar",
        error instanceof Error
          ? error.message
          : "Ocorreu um erro. Tente novamente.",
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Login")}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela de login"
          hitSlop={8}
        >
          <Text style={styles.backText}>‹ Voltar para o login</Text>
        </TouchableOpacity>

       <View style={styles.logoContainer}>
<Image
  source={require("../../assets/images/logo_entrepaginas_horizontal.png")}
  style={styles.logoImage}
  resizeMode="contain"
  accessibilityLabel="Logo EntrePáginas"
/>

  <Text style={styles.subtitle}>
    Seu espaço para acompanhar cada leitura.
  </Text>
</View>

        <View style={styles.card}>
          <Text style={styles.title}>Crie sua conta</Text>

          <Text style={styles.description}>
            Comece a organizar sua jornada literária.
          </Text>

          <Text style={styles.label}>Nome</Text>

          <TextInput
            style={styles.input}
            placeholder="Como podemos te chamar?"
            placeholderTextColor="#A39498"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            accessibilityLabel="Nome"
            accessibilityHint="Digite seu nome"
          />

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
            returnKeyType="next"
            accessibilityLabel="E-mail"
            accessibilityHint="Digite o e-mail que deseja cadastrar"
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Mínimo de 8 caracteres"
            placeholderTextColor="#A39498"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            accessibilityLabel="Senha"
            accessibilityHint="Crie uma senha para sua conta"
          />

          <Text style={styles.label}>Confirme sua senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#A39498"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (!isSubmitting) {
                void handleRegister();
              }
            }}
            accessibilityLabel="Confirme sua senha"
            accessibilityHint="Digite novamente a senha escolhida"
          />

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={
              isSubmitting ? "Criando sua conta" : "Criar conta"
            }
            accessibilityState={{
              disabled: isSubmitting,
              busy: isSubmitting,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator
                color="#FFFFFF"
                accessibilityLabel="Cadastro em andamento"
              />
            ) : (
              <Text style={styles.buttonText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              accessibilityRole="button"
              accessibilityLabel="Ir para a tela de login"
              hitSlop={8}
            >
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Cada livro, uma nova história. 
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
  width: 280,
  height: 90,
  alignSelf: "center",
  marginBottom: 8,
},
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  backButton: {
    minHeight: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  backText: {
    color: "#702D3A",
    fontSize: 15,
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#702D3A",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 13,
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
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#E8DCD3",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#3D3034",
    marginBottom: 16,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 24,
  },
  loginText: {
    color: "#66545A",
    fontSize: 14,
  },
  loginLink: {
    color: "#702D3A",
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  footer: {
    textAlign: "center",
    color: "#8C777D",
    fontSize: 13,
    marginTop: 24,
  },
});