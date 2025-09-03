'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MoodEntry {
  mood: string;
  note?: string;
  label : string;
  timestamp: string;
  img ?: string
}

export interface User {
  id: string;
  username: string;
  password: string; // pour MVP on garde simple
  avatar?: string;
  currentMood?: MoodEntry;
  moodHistory: MoodEntry[];
}

interface UserContextType {
  users: User[];
  currentUser: User | null;
  signup: (username: string, password: string, avatar?: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setMoodForToday: (mood: string ,label : string, note?: string) => void;
  getCurrentUser: () => User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Charger tous les utilisateurs + currentUser depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const storedUsers = await AsyncStorage.getItem('@users');
      const storedCurrent = await AsyncStorage.getItem('@currentUser');

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedCurrent) setCurrentUser(JSON.parse(storedCurrent));
    })();
  }, []);

  // Sauvegarder automatiquement la liste des users
  useEffect(() => {
    AsyncStorage.setItem('@users', JSON.stringify(users));
  }, [users]);

  // Sauvegarder automatiquement le currentUser
  useEffect(() => {
    if (currentUser) {
      AsyncStorage.setItem('@currentUser', JSON.stringify(currentUser));
    } else {
      AsyncStorage.removeItem('@currentUser');
    }
  }, [currentUser]);

  // Inscription
  const signup = (username: string, password: string, avatar?: string): boolean => {
    if (users.some(u => u.username === username)) return false;

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      avatar,
      moodHistory: [],
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  // Connexion
  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return false;

    setCurrentUser(user);
    console.log('Connexion réussie !');
    return true;
  };

  // Déconnexion
  const logout = () => setCurrentUser(null);

  // Ajouter ou mettre à jour le mood du jour
  const setMoodForToday = (mood: string, label : string, note?: string) => {
    if (!currentUser) return;

    const timestamp = new Date().toISOString();
    const today = new Date().toDateString();
    const lastMood = currentUser.currentMood;

    let updatedMood: MoodEntry = { mood, note, timestamp,label };
    let updatedHistory = [...currentUser.moodHistory];

    if (lastMood && new Date(lastMood.timestamp).toDateString() === today) {
      updatedHistory[updatedHistory.length - 1] = updatedMood;
    } else {
      updatedHistory.push(updatedMood);
    }

    const updatedUser: User = {
      ...currentUser,
      currentMood: updatedMood,
      moodHistory: updatedHistory,
    };

    setUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? updatedUser : u))
    );
    setCurrentUser(updatedUser);
  };

  const getCurrentUser = () => currentUser;

  return (
    <UserContext.Provider
      value={{ users, currentUser, signup, login, logout, setMoodForToday, getCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
