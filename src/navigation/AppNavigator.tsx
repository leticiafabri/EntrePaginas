import {
  ActivityIndicator,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  NavigationContainer,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../contexts/AuthContext";
import { Book } from "../types/Book";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CatalogScreen from "../screens/CatalogScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ReadBooksScreen from "../screens/ReadBooksScreen";
import BookDetailsScreen from "../screens/BookDetailsScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  BookDetails: { book: Book };
};

export type TabParamList = {
  "Início": undefined;
  Favoritos: undefined;
  Lidos: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  const { signOut } = useAuth();

  function confirmLogout() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza de que deseja sair do EntrePáginas?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert(
                "Erro",
                "Não foi possível sair da conta. Tente novamente.",
              );
            }
          },
        },
      ],
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#702D3A",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={confirmLogout}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Ionicons
              name="log-out-outline"
              size={25}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: "#702D3A",
        tabBarInactiveTintColor: "#A39498",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E8DCD3",
          borderTopWidth: 1,
          height: 85,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"];

          if (route.name === "Início") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Favoritos") {
            iconName = focused ? "heart" : "heart-outline";
          } else {
            iconName = focused ? "bookmark" : "bookmark-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        sceneStyle: {
          backgroundColor: "#F8F1E7",
        },
      })}
    >
      <Tab.Screen
        name="Início"
        component={CatalogScreen}
        options={{ title: "EntrePáginas" }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritesScreen}
      />
      <Tab.Screen
        name="Lidos"
        component={ReadBooksScreen}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#702D3A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#702D3A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#F8F1E7" },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BookDetails"
              component={BookDetailsScreen}
              options={{ title: "Detalhes do livro" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F1E7",
  },
});