import React from 'react';

import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import colors from '../styles/colors';

export default function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colors.black}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
