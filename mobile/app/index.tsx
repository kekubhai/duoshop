import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'

const Index = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>DuoShop</Text>
        <Text style={styles.tagline}>Track expenses with style</Text>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          {/* Replace with actual image if available */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>💰</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Smart Expense Tracking</Text>
        <Text style={styles.infoText}>
          Track your spending, set budgets, and achieve your financial goals with ease.
        </Text>
      </View>

     
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fffa', // Mint white
    padding: 20,
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  imageWrapper: {
    shadowColor: '#ff69b4', // Pink
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff69b4', // Pink
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  infoContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#ff69b4', // Pink
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff69b4', // Pink
  },
  secondaryButtonText: {
    color: '#ff69b4', // Pink
    fontSize: 18,
    fontWeight: 'bold',
  }
})

export default Index
