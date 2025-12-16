// src/screens/HelpScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HelpScreen: React.FC = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Help & Support</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                <Text style={styles.question}>How do I get started?</Text>
                <Text style={styles.answer}>
                    Check out the README.md for detailed setup instructions.
                </Text>

                <Text style={styles.question}>Where can I find documentation?</Text>
                <Text style={styles.answer}>
                    Documentation is available in the docs/ folder of this project.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Us</Text>
                <Text style={styles.text}>Email: support@example.com</Text>
            </View>
        </ScrollView>
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
        marginBottom: 24,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
        marginBottom: 4,
    },
    answer: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    text: {
        fontSize: 14,
        color: '#666',
    },
});

export default HelpScreen;
