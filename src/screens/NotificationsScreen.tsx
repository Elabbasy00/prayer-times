// src/screens/NotificationsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const NotificationsScreen: React.FC = () => {
    const notifications = [
        { id: '1', title: 'Welcome!', message: 'Thanks for using Mobile Starter', time: '2h ago' },
        { id: '2', title: 'New Feature', message: 'Check out the new updates', time: '1d ago' },
        { id: '3', title: 'Update Available', message: 'A new version is ready', time: '2d ago' },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            {notifications.map(notification => (
                <View key={notification.id} style={styles.notification}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
            ))}
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
        marginBottom: 20,
    },
    notification: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
    },
});

export default NotificationsScreen;
