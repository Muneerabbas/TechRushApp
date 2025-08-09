// app/(tabs)/components/social/SocialModal.jsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SocialModal = ({ visible, item, onClose }) => {
    if (!item) return null;
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close-circle" size={30} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{item.name || item.title || `Post by ${item.author?.name}`}</Text>
                    <Text style={styles.modalDescription}>{item.description || item.content}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 20 },
  closeButton: { alignSelf: 'flex-end' },
  modalTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 10 },
  modalDescription: { fontSize: 16, fontFamily: 'Poppins-Regular' },
});
