// src/components/ui/Icon.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconProps {
    name: string;
    size?: number;
    color?: string;
}

/**
 * Placeholder Icon component
 * Replace with react-native-vector-icons or your preferred icon library
 */
export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000' }) => {
    // Map icon names to emoji (temporary placeholder)
    const iconMap: Record<string, string> = {
        'home': '🏠',
        'home-outline': '🏠',
        'search': '🔍',
        'search-outline': '🔍',
        'add-circle': '➕',
        'add-circle-outline': '➕',
        'notifications': '🔔',
        'notifications-outline': '🔔',
        'person': '👤',
        'person-outline': '👤',
    };

    const icon = iconMap[name] || '•';

    return (
        <Text style={[styles.icon, { fontSize: size, color }]}>
            {icon}
        </Text>
    );
};

const styles = StyleSheet.create({
    icon: {
        textAlign: 'center',
    },
});

export default Icon;
