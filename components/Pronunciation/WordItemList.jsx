import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Colors } from './../../constants/Colors';

export default function WordItemList({ item }) {
    const router = useRouter();

    const handlePress = () => {
        // Codificar el audio URL antes de enviarlo
        const encodedAudio = encodeURIComponent(item.audio);
        
        router.push({
            pathname: '/beginner/word-pronunciation',
            params: { ...item, audio: encodedAudio },
        });
    };

    return (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={handlePress}
        >
            <Text style={styles.text}>{item.word}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Colors.LIGHT_BACKGROUND, // Un color de fondo claro para resaltar el texto
    },
    text: {
        fontSize: 18,
        color: Colors.DARK_TEXT, // Asegúrate de que el texto sea fácil de leer
    },
});
