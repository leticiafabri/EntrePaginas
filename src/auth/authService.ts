import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

import { User } from "../types/User";

const USERS_STORAGE_KEY = "@entrepaginas:users";

const SESSION_STORAGE_KEY = "entrepaginas.session";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getPasswordKey(userId: string): string {
  return `entrepaginas.password.${userId}`;
}

async function getUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(USERS_STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data) as User[];
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const normalizedName = name.trim();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedName || !normalizedEmail || !password) {
    throw new Error("Preencha todos os campos.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Digite um e-mail válido.");
  }

  if (password.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres.");
  }

  const users = await getUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("Já existe uma conta com esse e-mail.");
  }

  const newUser: User = {
    id: Crypto.randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
  };

  const passwordKey = getPasswordKey(newUser.id);

  // Guardamos a senha no armazenamento protegido do dispositivo.
  // Ela não é gravada no AsyncStorage.
  await SecureStore.setItemAsync(passwordKey, password);

  try {
    await AsyncStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify([...users, newUser]),
    );
  } catch (error) {
    // Evita deixar a credencial isolada caso o cadastro falhe.
    await SecureStore.deleteItemAsync(passwordKey);
    throw error;
  }

  await SecureStore.setItemAsync(
    SESSION_STORAGE_KEY,
    JSON.stringify(newUser),
  );

  return newUser;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const normalizedEmail = normalizeEmail(email);
  const users = await getUsers();

  const user = users.find(
    (item) => item.email === normalizedEmail,
  );

  if (!user) {
    throw new Error("E-mail ou senha incorretos.");
  }

  const savedPassword = await SecureStore.getItemAsync(
    getPasswordKey(user.id),
  );

  if (savedPassword === null || savedPassword !== password) {
    throw new Error("E-mail ou senha incorretos.");
  }

  await SecureStore.setItemAsync(
    SESSION_STORAGE_KEY,
    JSON.stringify(user),
  );

  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await SecureStore.getItemAsync(
    SESSION_STORAGE_KEY,
  );

  if (!session) {
    return null;
  }

  try {
    const user = JSON.parse(session) as User;
    const users = await getUsers();

    // Confere se a conta ainda existe.
    const accountExists = users.some(
      (item) => item.id === user.id,
    );

    if (!accountExists) {
      await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
      return null;
    }

    return user;
  } catch {
    await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
}