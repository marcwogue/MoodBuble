import { View, Text, TextInput, ImageBackground, Animated, Pressable } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from 'expo-router';
import { useUsers } from '@/context/user';
import Toast from 'react-native-toast-message';

export default function Connexion() {
  const router = useRouter();
  const { login, currentUser, isLoading } = useUsers();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fields, setFields] = useState(false);

  // refs pour animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Si l'utilisateur est déjà connecté, rediriger directement
  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace('/'); // navigue vers la page principale
    }
  }, [currentUser, isLoading]);

  const handleLogin = () => {
    const success = login(email, password);

    if (!success) {
      Toast.show({
        type: 'error',
        text1: 'Utilisateur non existant',
        visibilityTime: 2000,
        topOffset: 30,
        autoHide: true,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Connexion réussie',
      visibilityTime: 2000,
      topOffset: 30,
      autoHide: true,
    });

    setTimeout(() => {
      router.replace('/'); // redirection après succès
    }, 500);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-bold">Chargement...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/login.jpeg')}
      resizeMode="cover"
      className="flex-1 items-center justify-center"
    >
      <Animated.Image
        source={require('../../assets/images/ico1.png')}
        style={{
          width: 192,
          height: 192,
          marginBottom: 20,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: scaleAnim }],
        }}
      />
      <Toast />

      <View className="bg-white/70 p-8 rounded-3xl w-11/12 max-w-md items-center">
        <Text className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Mood Bubble
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="w-full bg-white/80 p-4 rounded-xl mb-4 border border-gray-300"
          keyboardType="email-address"
          onFocus={() => setFields(true)}
          onBlur={() => setFields(false)}
        />

        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full bg-white/80 p-4 rounded-xl mb-6 border border-gray-300"
          onFocus={() => setFields(true)}
          onBlur={() => setFields(false)}
        />

        <Pressable
          onPress={handleLogin}
          className="py-3 px-6 bg-purple-600 rounded-xl mb-4 w-full"
        >
          <Text className="text-white font-bold text-center text-lg">
            Se connecter
          </Text>
        </Pressable>

        <Link href='/(tabs)/signup'>
          <Text className="mt-4 text-purple-700 font-semibold">
            Pas encore inscrit ? Créez un compte
          </Text>
        </Link>
      </View>
      {fields && (
        <View className='h-[40vh] w-full '></View>
      )}
    </ImageBackground>
  );
}
