import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function AnswerModal({ answer, answerText, setShowModal }) {  // Desestructuramos los props
    const router = useRouter()
    
    const handleContinuePress = () => {
        if (answer) {
            router.back()
        } else {
            setShowModal(false)
        }
    }

    return (
        <Modal animationType="fade" transparent={true} visible={true}>
            <View style={styles.modalContainer}>
                <Text style={answer ? styles.modalTextCorrecto : styles.modalTextIncorrecto}>
                    {answer ? "¡Excelente!" : "Incorrecto"}
                </Text>

                {!answer && (
                    <Text style={{ color: 'white', paddingVertical: 10, fontSize: 17 }}>
                        <Text style={{ color: '#86D332' }}>Respuesta del sistema: </Text>
                        {answerText}
                    </Text>
                )}

                <TouchableOpacity 
                    onPress={handleContinuePress} 
                    style={answer ? styles.continueButton_Correct : styles.continueButton_Incorrect}>
                    <Text style={styles.continueText}>
                        {answer ? "Continuar" : "Intentar de nuevo"}
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        width:"100%",
        bottom: 0,
        backgroundColor: '#383A45',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginHorizontal: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      modalTextCorrecto:{
        color: '#86D332',
        fontWeight:'bold',
        fontSize: 20
      },
      modalTextIncorrecto:{
        color:'#EE5655',
        fontWeight:'bold',
        fontSize: 20,
      },
      continueButton_Correct:{
        width: 200,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#86D332",
        borderRadius: 20
      },
      continueButton_Incorrect:{
        width: 200,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#EE5655",
        borderRadius: 20
      },
      continueText:{
        color: '#fff',
        fontSize: 20
    },
})