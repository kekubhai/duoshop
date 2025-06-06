import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const NoTransactionsFound = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Ionicons name="card-outline" size={80} color="#888" style={styles.icon} />
      <Text style={styles.title}>No Transactions Found</Text>
      <Text style={styles.subtitle}>You don't have any transactions yet.</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => router.push('/create')}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoTransactionsFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
