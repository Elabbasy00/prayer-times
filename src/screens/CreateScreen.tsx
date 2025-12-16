// src/screens/CreateScreen.tsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CreateScreen: React.FC = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New</Text>
            <Text style={styles.subtitle}>Choose what you want to create</Text>

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('CreatePost' as never)}>
                <Text style={styles.optionText}>📝 Create Post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ImagePreview' as never)}>
                <Text style={styles.optionText}>📷 Upload Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('VideoPlayer' as never)}>
                <Text style={styles.optionText}>🎥 Record Video</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    option: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
});

export default CreateScreen;
