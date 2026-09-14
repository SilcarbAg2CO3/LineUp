import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../utils/GlobalStyles';

// Imports des écrans
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfilScreen from '../screens/ProfilScreen'; 
import AjouterBilletScreen from '../screens/AjouterBilletScreen';
import ProgrammationScreen from '../screens/ProgrammationScreen';
import ConcertDetailScreen from '../screens/ConcertDetailScreen';
import BilletsScreen from '../screens/BilletScreen';
import CarteScreen from '../screens/CarteScreen';
import FavorisScreen from '../screens/FavorisScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ReservationCasierScreen from '../screens/ReservationCasierScreen';
import PaiementScreen from '../screens/PaiementScreen';
import BottomTabs from '../components/BottomTabs';

const MainNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [selectedConcert, setSelectedConcert] = useState(null);

  const navigate = (screen, festival = null, data = null) => {
    if (festival) setSelectedFestival(festival);
    if (data) setSelectedConcert(data);
    setCurrentScreen(screen);
  };

  const festivalScreens = ['Programmation', 'Billets', 'Carte', 'Favoris', 'Services', 'ReservationCasier', 'Paiement'];
  const showTabs = festivalScreens.includes(currentScreen);

  return (
    <View style={globalStyles.container}>
      <StatusBar style="light" />
      
      {currentScreen === 'Login' && <AuthScreen changeScreen={navigate} />}
      {currentScreen === 'Home' && <HomeScreen changeScreen={navigate} />}
      {currentScreen === 'Profil' && <ProfilScreen changeScreen={navigate} />}
      {currentScreen === 'AjouterBillet' && <AjouterBilletScreen changeScreen={navigate} />}

      {currentScreen === 'Programmation' && <ProgrammationScreen changeScreen={navigate} festival={selectedFestival} />}
      {currentScreen === 'Billets' && <BilletsScreen changeScreen={navigate} festival={selectedFestival} />}
      {currentScreen === 'Carte' && <CarteScreen changeScreen={navigate} festival={selectedFestival} />}
      {currentScreen === 'Favoris' && <FavorisScreen changeScreen={navigate} festival={selectedFestival} />}
      {currentScreen === 'Services' && <ServicesScreen changeScreen={navigate} festival={selectedFestival} />}
      {currentScreen === 'ReservationCasier' && <ReservationCasierScreen changeScreen={navigate} festival={selectedFestival} />}
      {currentScreen === 'Paiement' && <PaiementScreen changeScreen={navigate} festival={selectedFestival} />}

      {currentScreen === 'ConcertDetail' && <ConcertDetailScreen changeScreen={navigate} festival={selectedFestival} concert={selectedConcert} />}

      {showTabs && (
        <BottomTabs activeTab={['ReservationCasier', 'Paiement'].includes(currentScreen) ? 'Services' : currentScreen} 
        onTabPress={(tabName) => navigate(tabName, selectedFestival)} />
      )}
    </View>
  );
};

export default MainNavigator;