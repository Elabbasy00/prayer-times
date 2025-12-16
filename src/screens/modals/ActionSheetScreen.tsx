// src/screens/modals/ActionSheetScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ActionSheetScreen: React.FC = () => {
    const navigation = useNavigation();

    const handleAction = (action: string) => {
        console.log('Selected action:', action);
        navigation.goBack();
    };

    return (
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={styles.container}>
                <TouchableWithoutFeedback>
                    <View style={styles.sheet}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleAction('option1')}
                        >
                            <Text style={styles.optionText}>Option 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleAction('option2')}
                        >
                            <Text style={styles.optionText}>Option 2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleAction('option3')}
                        >
                            <Text style={styles.optionText}>Option 3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.option, styles.cancelOption]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    option: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    optionText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
    },
    cancelOption: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
    cancelText: {
        fontWeight: '600',
    },
});

export default ActionSheetScreen;
