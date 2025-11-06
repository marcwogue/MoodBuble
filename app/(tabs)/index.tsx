import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, ImageBackground, FlatList, Modal, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router'; 
import { useUsers } from '@/context/user';
import { useMoods } from '@/context/mood';

export default function Home() {
  const router = useRouter();
  const { currentUser, logout } = useUsers();
  const { allMods, currentMood, setMoodForToday } = useMoods();

  const [selectedMood, setSelectedMood] = useState(currentMood?.mood);
  const [note, setNote] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [fields, setFields] = useState(false);

  useEffect(() => {
    setSelectedMood(currentMood?.mood);
  }, [currentMood]);

  const handleSave = () => {
    if (!selectedMood) return alert('Veuillez sélectionner une humeur !');
    setMoodForToday(selectedMood, note);
    setNote('');
    alert('Humeur enregistrée !');
  };

  const handleLogout = () => {
    logout();
    setMenuVisible(false);
  };

  const handleSeeHistory = () => {
    router.navigate("/(tabs)/history");
    setMenuVisible(false);
  };

  const ErrorSvg = () => (
    <Svg width={150} height={150} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="#FF6B6B" opacity={0.6} />
      <Path d="M12 7v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 16h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );

  if (!currentUser) {
    return (
      <ImageBackground
        source={require('../../assets/images/home.jpeg')}
        resizeMode="cover"
        className="flex-1 items-center justify-center"
      >
        <View className="bg-white/70 p-6 rounded-2xl items-center shadow-lg">
          <Image source={require('../../assets/images/ico1.png')} className="w-32 h-32 mb-4" />
          <ErrorSvg />
          <Text className="text-center text-xl font-bold mt-4 mb-4">
            Veuillez vous connecter pour pouvoir utiliser Mood Bubble !!!
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.navigate('/connexion')}
              className="py-3 px-6 rounded-xl bg-purple-600 border border-purple-700"
            >
              <Text className="text-white font-bold text-lg">Se connecter</Text>
            </Pressable>
            <Pressable
              onPress={() => router.navigate('/signup')}
              className="py-3 px-6 rounded-xl bg-purple-600 border border-purple-700"
            >
              <Text className="text-white font-bold text-lg">S'inscrire</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/home.jpeg')}
      className="flex-1 p-4"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white/60 p-3 rounded-2xl shadow-md mt-4">
        <Text className="text-purple-800 text-lg font-bold">
          Bonjour, {currentUser.username} 👋
        </Text>
        <Pressable onPress={() => setMenuVisible(true)} className="flex-row items-center">
          <Text className="text-xl font-bold underline capitalize mr-2">
            {currentUser.currentMood?.label || 'Aucune'}
          </Text>
          <Image
            source={currentUser.avatar || require('../../assets/images/def.jpeg')}
            className="w-14 h-14 rounded-full"
          />
        </Pressable>
      </View>

      {/* Mood Picker */}
      <Text className="text-purple-700 text-2xl font-bold mt-6 mb-3 text-center">
        Quelle est ton humeur aujourd'hui ?
      </Text>
      <FlatList
        data={allMods}
        horizontal
        keyExtractor={(item) => item.mood}
        contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 4 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedMood(item.mood)}
            className={`items-center m-2 p-3 rounded-xl shadow-md ${
              selectedMood === item.mood
                ? 'bg-purple-200 border-2 border-purple-600'
                : 'bg-white/80'
            }`}
          >
            <Image
              source={item.img || require('../../assets/images/def.jpeg')}
              className="w-20 h-20 rounded-full"
            />
            <Text className="mt-2 font-semibold text-gray-700">{item.label}</Text>
          </Pressable>
        )}
      />

      {/* Note */}
      <TextInput
        placeholder="Ajoute une petite note..."
        placeholderTextColor="#6b7280"
        value={note}
        onChangeText={setNote}
        onFocus={() => setFields(true)}
        onBlur={() => setFields(false)}
        multiline
        className="w-full bg-white/80 p-4 rounded-xl mt-4 border border-gray-300 text-gray-800"
        style={{ textAlignVertical: 'top' }}
      />

      {/* Sauvegarder */}
      <Pressable
        onPress={handleSave}
        className="bg-purple-600 py-3 rounded-xl shadow-md mt-6"
      >
        <Text className="text-white font-bold text-lg text-center">Sauvegarder</Text>
      </Pressable>

      {fields && <View className="h-[40vh] w-full" />}

      {/* Humeur actuelle */}
      {currentMood && (
        <View className="mt-6 p-5 bg-white/80 rounded-2xl shadow-md items-center">
          <Text className="text-gray-900 font-bold text-lg">Ton humeur du jour</Text>
          <Text className="text-5xl mt-2">{currentMood.mood}</Text>
          {currentMood.note && (
            <Text className="text-gray-700 mt-2 text-center italic">
              "{currentMood.note}"
            </Text>
          )}
        </View>
      )}

      {/* Side Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View className="flex-1 flex-row">
          <TouchableOpacity
            className="flex-1 bg-black/40"
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          <View className="w-64 bg-white h-full p-6 shadow-lg">
            <Text className="text-purple-800 text-xl font-bold mb-6">
              Menu de {currentUser.username}
            </Text>
            <Pressable
              onPress={handleSeeHistory}
              className="py-3 px-4 mb-4 rounded-xl bg-purple-600"
            >
              <Text className="text-white font-bold">Voir l'historique</Text>
            </Pressable>
            <Pressable
              onPress={handleLogout}
              className="py-3 px-4 rounded-xl bg-red-500"
            >
              <Text className="text-white font-bold">Se déconnecter</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}
