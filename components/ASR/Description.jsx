import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Colors } from "@/constants/Colors";

export default function Description() {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../../assets/images/ASR.jpg')} 
                style={styles.image}
            />
            <Text style={styles.description}>
                Kichwa ASR es una App móvil para el reconocimiento automático de voz, diseñada
                específicamente para el idioma Kichwa. Permite la transcripción precisa y rápida de audio a texto, facilitando la preservación y uso de esta lengua.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'row',
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        marginVertical: 15,
    },

    description: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        lineHeight: 22,
        flex: 1,
        paddingHorizontal: 10,
    },

    image: {
        width: 120,  // Aumenta el ancho de la imagen
        height: 150,  // Aumenta la altura de la imagen para alinearse con el texto
        borderRadius: 10,
        resizeMode: 'cover',
    }
});
