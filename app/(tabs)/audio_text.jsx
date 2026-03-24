import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Description from '../../components/ASR/Description'; // Verifica la ruta
import OptionsButtons from '../../components/ASR/OptionsButtons';
import PlayAudio from '../../components/ASR/PlayAudio';
import TextArea from '../../components/ASR/TextArea';

export default function AudioToTex() {
  const [recordingUri, setRecordingUri] = useState(null); // Estado para almacenar el URI del audio
  const [textData, setTextData] = useState("");
  const [loading, setLoading] = useState(false);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <ScrollView style={{
        padding:20
      }}> 
      <Description />
      <OptionsButtons setRecordingUri={setRecordingUri}/>    
      <PlayAudio recordingUri={recordingUri} setRecordingUri={setRecordingUri} setTextData={setTextData} setLoading={setLoading}/>
      <TextArea textData={textData} loading={loading} setTextData={setTextData}/>
      </ScrollView>
    </SafeAreaView> 
  );
}
