import { View, Text, FlatList, StyleSheet, TextInput, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from './../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import WordItemList from './../../components/Pronunciation/WordItemList';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';

export default function BeginnerView() {
  const { level } = useLocalSearchParams();

  const [loader, setLoader] = useState(false);
  const [wordList, setWordList] = useState([]); // Lista completa de palabras desde la BD
  const [filteredWordList, setFilteredWordList] = useState([]); // Lista de palabras filtradas
  const [searchQuery, setSearchQuery] = useState(""); // Texto ingresado por el usuario
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: level,
    });
    GetWordList();
  }, []);

  const GetWordList = async () => {
    if (!level) {
      console.error("El valor de 'level' no está definido");
      setLoader(false);
      return;
    }

    setLoader(true);
    setWordList([]); // Limpiar la lista

    const retryFetchWords = async (retries = 3) => {
      try {
        const q = query(collection(db, 'Beginner'), where('category', '==', level));
        const querySnapshot = await getDocs(q);
        const words = [];
        querySnapshot.forEach((doc) => {
          words.push(doc.data());
        });

        // Ordenar la lista alfabéticamente según el campo 'word'
        words.sort((a, b) => a.word.localeCompare(b.word));
        setWordList(words);
        setFilteredWordList(words);
      } catch (error) {
        if (retries > 0) {
          console.warn("Error al obtener documentos, reintentando...", error);
          setTimeout(() => retryFetchWords(retries - 1), 3000); // Reintenta en 3 segundos
        } else {
          console.error("Error al obtener los documentos después de varios intentos: ", error);
        }
      } finally {
        setLoader(false);
      }
    };

    retryFetchWords();
  };

  /**
   * Filtrar las palabras basadas en el texto ingresado por el usuario
   */
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredWordList(wordList);
    } else {
      // Filtrar las palabras que contienen el texto ingresado por el usuario
      const filteredWords = wordList.filter((item) =>
        item.word.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredWordList(filteredWords);
    }
  };

  const handleAdd = () => {
    router.push('./../add-word');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seleccione una palabra</Text>
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Agregar</Text>
          <Ionicons name="add-circle" size={24} color={Colors.LIGHT_PRIMARY} />
        </Pressable>
      </View>

      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar palabra..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Mostrar mensaje si no se encuentra ninguna palabra */}
      {filteredWordList.length === 0 && !loader && (
        <Text style={styles.noResultsText}>Palabra no existe</Text>
      )}

      {/* Indicador de carga */}
      {loader ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          style={styles.wordList}
          refreshing={loader}
          onRefresh={() => GetWordList()}
          data={filteredWordList} // Mostrar la lista filtrada o la completa
          numColumns={2}
          renderItem={({ item }) => <WordItemList item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.DARK_TEXT,
  },
  addButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: Colors.WHITE,
  },
  searchInput: {
    height: 40,
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  noResultsText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  wordList: {
    marginTop: 10,
  },
});
