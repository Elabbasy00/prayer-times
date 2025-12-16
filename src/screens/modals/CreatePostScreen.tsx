// src/screens/modals/CreatePostScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreatePostScreen: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigation = useNavigation();

    const handlePost = () => {
        console.log('Creating post:', { title, content });
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Create Post</Text>
                <TouchableOpacity onPress={handlePost}>
                    <Text style={styles.postButton}>Post</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.contentInput}
                    placeholder="What's on your mind?"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />
            </View>
        </KeyboardAvoidingView>
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
    postButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    form: {
        flex: 1,
        padding: 16,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        padding: 12,
    },
    contentInput: {
        flex: 1,
        fontSize: 16,
        padding: 12,
    },
});

export default CreatePostScreen;
