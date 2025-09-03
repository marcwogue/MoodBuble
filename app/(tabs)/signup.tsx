import { View, Text, TextInput, Pressable, ImageBackground, Animated, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useUsers } from '@/context/user';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function Signup() {
  const { signup } = useUsers();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null); // Base64

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  // Fonction pour picker une image et transformer en Base64
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission nécessaire pour accéder aux photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0].base64) {
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSignup = () => {
    if (!username || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs !');
      setError2('tous les champs ne sont pas remplis !');
      Toast.show({
          text1 : error,
          text2 : error2,
          type : "error",
          visibilityTime: 2000,
          autoHide :true,

      })
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas !');
      setError2('rassurez vous que les mots de passes sonts conforme');
      Toast.show({
          text1 : error,
          text2 : error2,
          type : "error",
          visibilityTime: 2000,
          autoHide :true,
          
      })
      return;
    }
    if (password.length < 4) {
      setError('mot de passe trop court')
      setError2('votre mot de passe doit avoir au moins 4 caracteres')
      Toast.show({
        text1 : error,
        text2 : error2,
        type : "error",
        visibilityTime: 2000,
        autoHide :true,
        
    })
      return
    }

    const success = signup(username, password, avatar || undefined);
    if (!success) {
      setError('Ce nom d’utilisateur existe déjà !');
      setError2('veuillez choisir un autre nom d\'utilisateur ')
      Toast.show({
        text1 : error,
        text2 : error2,
        type : "error",
        visibilityTime: 2000,
        autoHide :true,
        
    })
      return;
    }

    // Redirection vers Home
    setError('compte crée avec succes');
    setError2('bravo!! votre compte à ete cree avec succes! ')
    Toast.show({
      text1 : error,
      text2 : error2,
      type : "succes",
      visibilityTime: 2000,
      
  })

    router.navigate('/');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/login.jpeg')}
      resizeMode="cover"
      className="flex-1 items-center"
    >
      {/* Logo animé */}
      <Animated.Image
        source={require('../../assets/images/ico1.png')}
        style={{
          width: 180,
          height: 180,
          marginBottom: 20,
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: scaleAnim.interpolate({ inputRange: [0.8, 1], outputRange: [20, 0] }) },
          ],
        }}
      />

      <View className="bg-white/70 p-8 rounded-3xl w-11/12 max-w-md items-center shadow-lg">
        <Text className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Créer un compte Mood Bubble
        </Text>
          <Toast/>

        {/* Picker d'avatar */}
        <Pressable onPress={pickImage} className="mb-4">
          {avatar ? (
            <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full mb-2" />
          ) : (
            <View className="w-24 h-24 bg-gray-300 rounded-full mb-2 justify-center items-center">
              <Text className="text-gray-700">Ajouter photo</Text>
            </View>
          )}
        </Pressable>

        <TextInput
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          className="w-full bg-white/80 p-4 rounded-xl mb-4 border border-gray-300 text-gray-800"
        />

        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full bg-white/80 p-4 rounded-xl mb-4 border border-gray-300 text-gray-800"
        />

        <TextInput
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          className="w-full bg-white/80 p-4 rounded-xl mb-6 border border-gray-300 text-gray-800"
        />

        <Pressable
          onPress={handleSignup}
          className="w-full bg-purple-600 py-3 rounded-xl mb-4 items-center"
        >
          <Text className="text-white font-bold text-lg">S'inscrire</Text>
        </Pressable>

        <Pressable onPress={() => router.navigate('/(tabs)/connexion')}>
          <Text className="mt-2 text-purple-700 font-semibold text-center">
            Déjà un compte ? Connectez-vous
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}
