// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';
import { Colors } from "@/constants/Colors";
import TabBarIcon from "@/components/TabBarIcon";
import { Text, View } from 'react-native';
import Header from '../../components/Header';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.PRIMARY,
                //headerShown: false, // Asegúrate de que el encabezado esté visible
            }}
        >
            <Tabs.Screen
                name="audio_text"
                options={{
                    title: "Audio-Text", // Título del encabezado para esta pestaña
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "mic-circle" : "mic-circle-outline"}
                            color={color}
                        />
                    ),
                    header: () => (
                        <Header title={'Reconocimiento Automático del Habla'} icon={'text-to-speech'}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="pronunciation"
                options={{
                    title: "Pronunciación", 
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "thumbs-up" : "thumbs-up-outline"}
                            color={color}
                        />
                    ),
                    header: () => (
                        <Header title={'Practicar Pronunciación'} icon={'thumbs-up-down-outline'} />
                    ),
                }}
            />
            <Tabs.Screen
                name="credencial"
                options={{
                    title: "Credenciales", 
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "document-text" : "document-text-outline"}
                            color={color}
                        />
                    )   
                }}
            />
        </Tabs>
    );
}
