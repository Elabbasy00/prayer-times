// src/screens/SplashScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const SplashScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mobile Starter</Text>
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#007AFF',
        marginBottom: 20,
    },
    loader: {
        marginVertical: 20,
    },
    text: {
        fontSize: 16,
        color: '#666',
    },
});

export default SplashScreen;
