import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Header({title, icon}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <MaterialCommunityIcons name={icon} size={24} color="black" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: Colors.WHITE
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})