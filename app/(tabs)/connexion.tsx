import { View, Text, TextInput, Button, ImageBackground, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from 'expo-router';
import { useUsers } from '@/context/user';
import Toast from 'react-native-toast-message';



export default function Connexion() {
  const route = useRouter();
  const {login} = useUsers();
  const [email, setEmail] = useState('');
  const [loger, setloger] = useState(false);
  const [password, setPassword] = useState('');


  // refs pour animation
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // scale

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

  useEffect(()=>{
    if (loger) {
      route.navigate('/')
    }
  },[loger])

  const handleLogin = () => {
    const jeff =  login(email,password)
    if (!jeff) {
      console.log('utilisateur non existant ');
      Toast.show({
        type : 'error',
        text1 :" utilisateur non existant",
        visibilityTime : 2000,
        topOffset : 30,
        autoHide : true,


      })
      
    }
    
    if (jeff) {
      Toast.show({ 
        type : "success",
        text1 : "connexion reussie",
        visibilityTime:2000,
        topOffset: 30,
        autoHide:true

      })
      setloger(true)
    }
  };
 
  return (
    <ImageBackground
      source={require('../../assets/images/login.jpeg')}
      resizeMode="cover"
      className="flex-1 items-center "
    >
      <Animated.Image
        source={require('../../assets/images/ico1.png')}
        style={{
          width: 192, // 48 * 4
          height: 192,
          marginBottom: 20,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim },{ translateY : scaleAnim}],
        }}
      />
      <Toast/>

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
        />

        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full bg-white/80 p-4 rounded-xl mb-6 border border-gray-300"
        />

        <Text className=' py-2 px-4 bg-blue-600 my-8 rounded-xl' onPress={handleLogin}>
          se connecter
        </Text>

        <Link href='/(tabs)/signup'>
          <Text className="mt-4 text-purple-700 font-semibold">
            Pas encore inscrit ? Créez un compte
          </Text>
        </Link>
      </View>
    </ImageBackground>
  );
}
