import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  Appbar,
  Button,
  Text,
  FAB,
} from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <StatusBar style="auto" />

      <Appbar.Header>
        <Appbar.Content title="My Bare Paper App" />
      </Appbar.Header>

      <View style={styles.container}>

      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('FAB pressed')}
        aria-label="Add"
      />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  text: {
    textAlign: 'center',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
