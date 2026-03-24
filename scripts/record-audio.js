import { Audio } from "expo-av";

export async function startRecording(setRecording,setRecordingDuration, permissionResponse, requestPermission) {
    try {
        if (permissionResponse.status !== "granted") {
            console.log("Requesting permission...");
            await requestPermission();
        }
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        console.log("Starting recording...");
        const { recording } = await Audio.Recording.createAsync({
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY = {
                android: {
                    extension: ".mp3",
                    quality: "high",
                    sampleRate: 16000,
                    channels: 2,
                    bitRate: 128000,
                    audioEncoding: "aac",
                },
                ios: {
                    extension: ".m4a",
                    quality: "high",
                    sampleRate: 44100,
                    channels: 2,
                    bitRate: 128000,
                    audioEncoding: "aac",

                }
            }
        }


        );
        setRecording(recording);
        console.log("Recording started");

        // Iniciar la actualización del tiempo de grabación
        recordingInterval = setInterval(async () => {
            const status = await recording.getStatusAsync();
            setRecordingDuration(status.durationMillis);
        }, 1000);
    } catch (err) {
        console.error("Failed to start recording", err);
    }
}

export async function stopRecording(recording, setRecordingUri, setRecording, setRecordingDuration, setRecordingStatus) {
    try {
        console.log("Stopping recording..");

        if (recording) {
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            const uri = recording.getURI();
            setRecordingUri(uri);
            console.log("Recording stopped and stored at", uri);
        }

        clearInterval(recordingInterval);
        setRecording(null);
        setRecordingDuration(0);
        setRecordingStatus("Grabación finalizada");
    } catch (error) {
        console.error("Failed to stop recording", error);
    }
}
