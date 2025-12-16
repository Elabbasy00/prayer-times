// src/screens/modals/FiltersScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FiltersScreen: React.FC = () => {
    const [filter1, setFilter1] = useState(false);
    const [filter2, setFilter2] = useState(true);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.applyButton}>Apply</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Filter Option 1</Text>
                    <Switch value={filter1} onValueChange={setFilter1} />
                </View>
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Filter Option 2</Text>
                    <Switch value={filter2} onValueChange={setFilter2} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    cancelButton: {
        fontSize: 16,
        color: '#666',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    applyButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterLabel: {
        fontSize: 16,
        color: '#333',
    },
});

export default FiltersScreen;
