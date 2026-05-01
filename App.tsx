import { LogBox, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import StackNav from './src/navigators/StackNav';
import Passions from './src/screens/auth/Passions';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StackNav />
      {/* <Passions /> */}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
