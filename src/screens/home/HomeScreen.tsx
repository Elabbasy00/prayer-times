// src/screens/home/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: theme.spacing.lg,
        },
        header: {
            marginBottom: 30,
            paddingVertical: theme.spacing.lg,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            lineHeight: 24,
        },
        section: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            ...theme.shadows.md,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 12,
        },
        text: {
            fontSize: 15,
            color: theme.colors.textSecondary,
            lineHeight: 22,
        },
        featureList: {
            gap: 8,
        },
        feature: {
            fontSize: 15,
            color: theme.colors.text,
            marginBottom: 8,
        },
        button: {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            alignItems: 'center',
            marginTop: 20,
        },
        buttonText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: '600',
        },
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to Mobile Starter</Text>
                <Text style={styles.subtitle}>
                    A production-ready React Native CLI starter template
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Getting Started</Text>
                <Text style={styles.text}>
                    This is a placeholder home screen. Replace this with your own content.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Features Included</Text>
                <View style={styles.featureList}>
                    <Text style={styles.feature}>✅ TypeScript with strict mode</Text>
                    <Text style={styles.feature}>✅ React Navigation (Stack, Tab, Drawer)</Text>
                    <Text style={styles.feature}>✅ State Management (Zustand + MMKV)</Text>
                    <Text style={styles.feature}>✅ API Integration with Axios</Text>
                    <Text style={styles.feature}>✅ Error Boundary</Text>
                    <Text style={styles.feature}>✅ Custom Hooks & Utilities</Text>
                    <Text style={styles.feature}>✅ Code Quality Tools</Text>
                    <Text style={styles.feature}>✅ Light/Dark Theme Support</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Profile' as never)}
            >
                <Text style={styles.buttonText}>Go to Profile</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default HomeScreen;
