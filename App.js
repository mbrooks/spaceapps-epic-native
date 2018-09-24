import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EpicView from './EpicView';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <EpicView title='EPIC Imaging' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});
