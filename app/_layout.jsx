import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Stack>
        <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" 
            options={{
              headerShown: false
            }} 
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Asegura que SafeAreaView ocupe todo el espacio disponible
  },
});
