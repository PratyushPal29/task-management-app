import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as JotaiProvider } from 'jotai';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { colors } from './src/core/theme/colors';

function App(): React.JSX.Element {
  return (
    // JotaiProvider is the Riverpod ProviderScope equivalent —
    // it provides the global atom store to the entire component tree
    <JotaiProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.primary}
            translucent
          />
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </JotaiProvider>
  );
}

export default App;

