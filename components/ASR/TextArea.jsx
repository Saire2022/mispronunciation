import { View, ActivityIndicator, TextInput, StyleSheet, Alert } from 'react-native';
import React from 'react';
import CopyButton from './CopyButton';
import { useState } from 'react';

export default function TextArea({ loading, setTextData, textData }) {


  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          <View style={{ margin: 20 }}>
            <TextInput
              style={styles.OutputContainer}
              placeholder="Texto en Kichwa"
              value={textData}
              multiline={true}
              numberOfLines={5}
              onChangeText={setTextData}
            />
            <CopyButton textToCopy={textData} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  OutputContainer: {
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
  },
});
