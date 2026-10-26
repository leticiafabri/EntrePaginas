import AppNavigator from "./src/navigation/AppNavigator";

import { AuthProvider } from "./src/contexts/AuthContext";
import { FavoritesProvider } from "./src/contexts/FavoritesContext";
import { ReadBooksProvider } from "./src/contexts/ReadBooksContext";

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ReadBooksProvider>
          <AppNavigator />
        </ReadBooksProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
