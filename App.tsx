import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  Appbar,
  FAB,
  Text,
} from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CsvDataTable } from './components/CsvDataTable';

export default function App() {
  const [csvText, setCsvText] = React.useState<string>("");
  const pickCsv = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'application/csv',
          'text/comma-separated-values',
          'application/vnd.ms-excel',
          'public.comma-separated-values-text',
        ],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;
      const file = res.assets[0];

      const isCsv =
        (file.mimeType?.includes('csv') || file.mimeType === 'application/vnd.ms-excel') ||
        file.name?.toLowerCase().endsWith('.csv');

      if (!isCsv) {
        Alert.alert('Invalid file', 'Please select a .csv file.');
        return;
      }

      const text = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 });
      setCsvText(text);
      console.log('CSV selected:', file.name, 'size:', file.size);
      console.log('First 200 chars:', text.slice(0, 200));
    } catch (e) {
      console.warn('Document picker error:', e);
      Alert.alert('Error', 'Could not open the file picker.');
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={MD3LightTheme}>
        <StatusBar style="auto" />

        <Appbar.Header>
          <Appbar.Content title="CSV Processor" />
        </Appbar.Header>

        <View style={styles.container}>
          {csvText ? <CsvDataTable csv={csvText} /> : <Text>Please select a file</Text>

          }
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={pickCsv}
            aria-label="Add"
          />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
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
