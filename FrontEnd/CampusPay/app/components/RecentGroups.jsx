import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../assets/utils/colors';
import { GroupDetailModal } from './GroupDetailModal'; // Import the new modal

const API_URL = 'https://techrush-backend.onrender.com';

const GroupCircle = ({ group, onGroupPress }) => {
    const displayUser = group.participants[0]?.user;

    return (
        <TouchableOpacity style={styles.groupContainer} onPress={() => onGroupPress(group)}>
            <View style={styles.avatarWrapper}>
                {displayUser?.profilePicture ? (
                    <Image source={{ uri: `${API_URL}${displayUser.profilePicture}` }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="people" size={24} color={colors.primary} />
                    </View>
                )}
            </View>
            <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
        </TouchableOpacity>
    );
};

export const RecentGroups = ({ groups }) => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleGroupPress = (group) => {
        setSelectedGroup(group);
        setIsModalVisible(true);
    };

    if (!groups || groups.length === 0) {
        return null;
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.header}>Recent Groups</Text>
                <FlatList
                    data={groups}
                    renderItem={({ item }) => <GroupCircle group={item} onGroupPress={handleGroupPress} />}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 25, paddingRight: 10 }}
                />
            </View>
            <GroupDetailModal
                isVisible={isModalVisible}
                group={selectedGroup}
                onClose={() => setIsModalVisible(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    header: {
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
        color: "#333",
        marginBottom: 15,
        paddingHorizontal: 25,
    },
    groupContainer: {
        alignItems: 'center',
        marginRight: 15,
        width: 70,
    },
    avatarWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#E9EAF0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupName: {
        marginTop: 8,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#666',
        textAlign: 'center'
    }
});
