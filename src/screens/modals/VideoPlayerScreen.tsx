// src/screens/modals/VideoPlayerScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VideoPlayerScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.videoPlaceholder}>
                <Text style={styles.placeholderText}>▶ Video Player</Text>
                <Text style={styles.subText}>Placeholder for video content</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: '300',
    },
    videoPlaceholder: {
        width: '90%',
        aspectRatio: 16 / 9,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    placeholderText: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 8,
    },
    subText: {
        fontSize: 14,
        color: '#999',
    },
});

export default VideoPlayerScreen;
