'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUsers, MoodEntry } from './user';

interface MoodContextType {
  allMods: MoodEntry[];
  moodHistory: MoodEntry[];
  clair: (keepCurrent?: boolean) => void;
  currentMood?: MoodEntry;
  setMoodForToday: (mood: string, note?: string) => void;
  getMoodHistory: () => MoodEntry[];
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMoods = () => {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMoods must be used within a MoodProvider');
  return context;
};

export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, setMoodForToday: setMoodUser } = useUsers();
  const [allMods, setAll] = useState<MoodEntry[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(undefined);

  // Charger l'historique depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadHistory = async () => {
      if (!currentUser) return;
      try {
        const data = await AsyncStorage.getItem(`@moods_${currentUser.id}`);
        if (data) {
          const parsed: MoodEntry[] = JSON.parse(data);
          setMoodHistory(parsed);
          setCurrentMood(parsed[parsed.length - 1]);
        } else {
          setMoodHistory(currentUser.moodHistory || []);
          setCurrentMood(currentUser.currentMood);
        }
      } catch (e) {
        console.error('Erreur en chargeant l’historique :', e);
      }
    };
    loadHistory();
  }, [currentUser]);

  // Fonction pour réinitialiser l'historique
  const clair = async (keepCurrent: boolean = true) => {
    if (!currentUser) return;

    const resetHistory = keepCurrent && currentMood ? [currentMood] : [];

    setMoodHistory(resetHistory);

    // Mettre à jour UserContext pour rester synchro
    if (currentMood && keepCurrent) {
      setMoodUser(currentMood.mood, currentMood.label, currentMood.note);
    }

    // Sauvegarde locale
    try {
      await AsyncStorage.setItem(`@moods_${currentUser.id}`, JSON.stringify(resetHistory));
    } catch (e) {
      console.error('Erreur en réinitialisant l’historique :', e);
    }
  };

  // Initialisation des moods disponibles
  useEffect(() => {
    setAll([
      { mood: '😊', label: 'Heureux', img: require('../assets/images/heureux.jpeg'), timestamp: '', note: '' },
      { mood: '😍', label: 'Amoureux', img: require('../assets/images/love.jpeg'), timestamp: '', note: '' },
      { mood: '😡', label: 'En colère', img: require('../assets/images/colere.jpeg'), timestamp: '', note: '' },
      { mood: '😴', label: 'Fatigué', img: require('../assets/images/flem.jpeg'), timestamp: '', note: '' },
      { mood: '🤓', label: 'Concentré', img: require('../assets/images/concentre.jpeg'), timestamp: '', note: '' },
    ]);
  }, []);

  // Ajouter un nouveau mood
  const setMoodForToday = async (mood: string, note?: string) => {
    if (!currentUser) return;

    const baseMood = allMods.find((m) => m.mood === mood);
    if (!baseMood) return;

    const timestamp = new Date().toISOString();

    const newMood: MoodEntry = {
      ...baseMood,
      timestamp,
      note,
    };

    // Ajout au moodHistory
    const updatedHistory = [...moodHistory, newMood];

    setMoodHistory(updatedHistory);
    setCurrentMood(newMood);

    // Mise à jour UserContext
    setMoodUser(mood, baseMood.label, note);

    // Sauvegarde locale
    try {
      await AsyncStorage.setItem(`@moods_${currentUser.id}`, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Erreur en sauvegardant l’historique :', e);
    }
  };

  const getMoodHistory = () => moodHistory;

  return (
    <MoodContext.Provider
      value={{
        allMods,
        moodHistory,
        clair,
        currentMood,
        setMoodForToday,
        getMoodHistory,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};
