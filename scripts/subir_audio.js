import * as DocumentPicker from "expo-document-picker";

export const handleButtonUpload = async (setRecordingUri) => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: "audio/*", // Solo archivos de audio
        });
        console.log("Resultado del selector de documentos:", result);
        if (
            result.canceled === false &&
            result.assets &&
            result.assets.length > 0
        ) {
            const audioUri = result.assets[0].uri;
            setRecordingUri(audioUri); // Guardar el URI seleccionado
            console.log("Archivo cargado:", audioUri);
        } else {
            console.log("Selección de archivo cancelada");
        }
    } catch (error) {
        console.error("Error al seleccionar el archivo:", error);
    }
};
