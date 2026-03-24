import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from './../../constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

const Menu = [
  {
    id: 1,
    name: 'Principiante',
    icon: 'rightcircle',
    path: '/beginner',
  },
  {
    id: 2,
    name: 'Medio',
    icon: 'rightcircle',
    path: '/medium',
  },
  {
    id: 3,
    name: 'Avanzado',
    icon: 'rightcircle',
    path: 'advanced',
  },
];

export default function Pronunciation() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: '',
    });
  }, []);

  const onPressMenu = (menu) => {
    router.push({
      pathname: '/beginner',
      params: { level: menu.name },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seleccione Nivel</Text>
      </View>

      <FlatList
        data={Menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            key={item.id}
            style={styles.button}
          >
            <AntDesign
              name={item.icon}
              size={24}
              color={Colors.PRIMARY}
              style={styles.icon}
            />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    marginHorizontal: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.DARK_TEXT,
    letterSpacing: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    padding: 10,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 8,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.DARK_TEXT,
  },
});
