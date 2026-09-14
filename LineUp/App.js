import React from 'react';
import MainNavigator from './navigation/MainNavigator';
import { FavoritesProvider } from './store/FavoritesStore';

export default function App() {
  return (
    <FavoritesProvider>
      <MainNavigator />
    </FavoritesProvider>
  );
}