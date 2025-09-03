import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';
import Immersive from "react-native-immersive";
const ImmersiveAny = Immersive as unknown as { on: () => void; off: () => void };

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Activer le mode immersif lors du montage du composant
      // Cela masque la barre de statut et la barre de navigation
     
      console.log("Ceci est un appareil Android.");

      // Optionnel: Réactiver le mode immersif si l'utilisateur quitte et revient
      // ou si le système le désactive (par exemple, après une notification)
      // Vous pouvez aussi utiliser un événement pour détecter le focus de l'application
      // et réactiver le mode immersif si nécessaire.
 
    }
  }, []);

  const exitFullscreen = () => {
    if (Platform.OS === 'android') {
      ImmersiveAny.off(); // Désactive le mode immersif
    }
  };

  return (
    <Stack
       screenOptions={{
        headerShown : false
       }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='connexion' />
      <Stack.Screen name='signup' />
      <Stack.Screen name='history' />
    </Stack>
  );
}
