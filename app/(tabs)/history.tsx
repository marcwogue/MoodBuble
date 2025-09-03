// src/screens/HistoryScreen.tsx
import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Pressable } from "react-native";
import { useMoods } from "../../context/mood";
import { useRouter } from "expo-router";

export default function HistoryScreen() {
  const { moodHistory , clair } = useMoods();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa", padding: 16 }}>
      {/* Titre */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Historique des humeurs
      </Text>

      {/* Liste des humeurs */}
      {moodHistory.length === 0 ? (
        <Text style={{ fontSize: 16, color: "#6c757d" }}>
          Aucun historique pour l’instant.
        </Text>
      ) : (
        <FlatList
          data={moodHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: 10,
                marginBottom: 10,
                borderRadius: 12,
                elevation: 2,
              }}
            >
              <Image
                source={item.img || require('../../assets/images/def.jpeg')}
                style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18 }}>{item.mood} {item.label}</Text>
                <Text style={{ fontSize: 14, color: "#6c757d" }}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
                {item.note && (
                  <Text style={{ fontSize: 14, fontStyle: "italic", marginTop: 4 }}>
                    📝 {item.note}
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      )}

      {/* Bouton retour */}
    <View className="flex justify-between flex-row">
    <TouchableOpacity
        onPress={() => router.back()}
        className=" w-5/12 py-4"
        style={{
          backgroundColor: "#6f42c1",
          borderRadius: 12,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          ⬅ Retour
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => clair()}
        className=" w-5/12 py-4 bg-red-500"
        style={{
          borderRadius: 12,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
         supprimer l'hystorique 
        </Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}
