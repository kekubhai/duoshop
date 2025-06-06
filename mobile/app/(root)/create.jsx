import { View, Text, Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { API_URL } from '../../constants/API'
import { useUser } from '@clerk/clerk-expo'
import { useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

const CATEGORIES = [
  { id: '1', name: 'Food', icon: 'fast-food-outline' },
  { id: '2', name: 'Transport', icon: 'car-outline' },
  { id: '3', name: 'Shopping', icon: 'cart-outline' },
  { id: '4', name: 'Entertainment', icon: 'game-controller-outline' },
  { id: '5', name: 'Health', icon: 'heart-outline' },
  { id: '6', name: 'Utilities', icon: 'bulb-outline' },
  { id: '7', name: 'Other', icon: 'ellipsis-horizontal-outline' }
]

const CreateTransaction = () => {
  const { user } = useUser()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [isExpense, setIsExpense] = useState(false)
  const [selectedCategory, setCategory] = useState(CATEGORIES[0].id)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleCreateTransactions = async () => {
    // validations 
    if (!title.trim()) {
      return Alert.alert('Error', 'Please enter a title')
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount')
      return;
    }
    
    if (!selectedCategory) {
      return Alert.alert('Error', 'Please select a category')
    }
    
    setIsLoading(true)

    try {
      const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount))
      
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          title,
          amount: formattedAmount,
          category: CATEGORIES.find(cat => cat.id === selectedCategory)?.name || 'Other',
          user_id: user.id,
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction')
      }
      
      Alert.alert("Success", "Transaction created successfully")
      router.back()
    } catch (error) {
      console.error('Error creating transaction:', error)
      Alert.alert('Error creating transaction', error.message || 'Something went wrong, please try again later')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={isExpense ? ['#ff7675', '#ff9e9e'] : ['#55efc4', '#81ecec']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name='arrow-back' size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isExpense ? 'Record Expense' : 'Record Income'}
          </Text>
          <TouchableOpacity 
            style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]} 
            onPress={handleCreateTransactions} 
            disabled={isLoading}
          >
            <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
            {!isLoading && <Ionicons name='checkmark' size={24} color="white" />}
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                isExpense && styles.activeTypeButton,
                {backgroundColor: isExpense ? '#ff7675' : 'transparent'}
              ]} 
              onPress={() => setIsExpense(true)}
            >
              <Ionicons name='arrow-down-circle' size={24} color={isExpense ? 'white' : '#ff7675'} />
              <Text style={[styles.typeButtonText, {color: isExpense ? 'white' : '#333'}]}>
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.typeButton, 
                !isExpense && styles.activeTypeButton,
                {backgroundColor: !isExpense ? '#55efc4' : 'transparent'}
              ]} 
              onPress={() => setIsExpense(false)}
            >
              <Ionicons name='arrow-up-circle' size={24} color={!isExpense ? 'white' : '#55efc4'} />
              <Text style={[styles.typeButtonText, {color: !isExpense ? 'white' : '#333'}]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={[styles.currencySymbol, {color: isExpense ? '#ff7675' : '#55efc4'}]}>₹</Text>
            <TextInput 
              style={[styles.amountInput, {color: isExpense ? '#ff7675' : '#55efc4'}]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#999"
            />
          </View>
          
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Ionicons name='create-outline' size={24} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input} 
              placeholder='What was this for?'
              value={title}
              placeholderTextColor="#999"
              onChangeText={setTitle}
            />
          </View>
          
          {/* Category Selector */}
          <Text style={styles.sectionTitle}>Choose Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton, 
                  selectedCategory === category.id && styles.categoryButtonActive,
                  selectedCategory === category.id && {
                    backgroundColor: isExpense ? '#ff7675' : '#55efc4'
                  }
                ]}
                onPress={() => setCategory(category.id)}
              >
                <View style={styles.categoryIconWrapper}>
                  <Ionicons 
                    name={category.icon} 
                    size={20} 
                    color={selectedCategory === category.id ? 'white' : '#555'}
                  />
                </View>
                <Text style={[
                  styles.categoryButtonText, 
                  selectedCategory === category.id && styles.categoryButtonTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isExpense ? '#ff7675' : '#55efc4'} />
            <Text style={styles.loadingText}>Creating transaction...</Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  saveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 190, 25, 0.658)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButton: {
    
    color: 'black',
    fontWeight: '600',
    marginRight: 5,
   
    borderBottomWidth: 2,
  
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeTypeButton: {
    borderWidth: 0,
  },
  typeButtonText: {
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  currencySymbol: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 5,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 200,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 30,
    paddingBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
  },
  categoryButtonActive: {
    backgroundColor: '#ff7675',
  },
  categoryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#555',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
};

export default CreateTransaction;