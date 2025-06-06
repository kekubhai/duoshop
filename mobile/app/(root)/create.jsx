import { View, Text, Alert, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import {COLORS} from '../../constants/Colors'
import {styles} from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons'
import {API_URL} from '../../constants/API'
import {useUser} from '@clerk/clerk-expo'
import { useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { useRouter } from 'expo-router'
  const CATEGORIES=[
        { id: '1', name: 'Food' , icon: 'fast-food-outline'},
        { id: '2', name: 'Transport', icon: 'car-outline' },
        { id: '3', name: 'Shopping', icon: 'cart-outline' },
        { id: '4', name: 'Entertainment', icon: 'game-controller-outline' },
        { id: '5', name: 'Health', icon: 'heart-outline' },
        { id: '6', name: 'Utilities', icon: 'bulb-outline' },
        { id: '7', name: 'Other', icon: 'ellipsis-horizontal-outline' }
    ]
const CreateTransaction = () => {

    const {user}=useUser()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [isExpense, setIsExpense] = useState(false)
    const [selectedcategory, setCategory] = useState(CATEGORIES[0].id)
    const [isLoading, setIsLoading] = useState(false)
    const handleCreateTransactions =async ()=>{
        //validations 
        if(!title.trim()){
            return Alert.alert('Error', 'Please fill all fields')

        }
        if(!amount || isNaN(parseFloat(amount)) || parseFloat(amount <=0)){
            Alert.alert('Error', 'Please enter a valid amount')
            return;}
            if(!selectedcategory){
                return Alert.alert('Error', 'Please select a category')
            }
            setIsLoading(true)

        try {

          const formattedAmount =isExpense? -Math.abs(parseFloat(amount)): Math.abs(parseFloat(amount))
          
           const response =await fetch (`${API_URL}/transactions`, {
            method:'POST',
            headers:{
                'Content-Type':"application/json",
            
            },
            body:JSON.stringify({
                title,
                amount:formattedAmount,
                category:CATEGORIES.find(cat=>cat.id===selectedcategory)?.name || 'Other',
                user_id:user.id,
                        })
           })
           if(!response.ok){
            const errordata=await response.json();
            throw new Error(errordata.message || 'Failed to create transaction')

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
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={()=>router.back()}>
                <Ionicons name='arrow-back' size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}> Create Transactions</Text>
            <TouchableOpacity style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]} onPress={handleCreateTransactions} disabled={isLoading}>
                <Text style={styles.saveButton}>{isLoading ? "Saving ..." : "Save"}</Text>
                {!isLoading && <Ionicons name='checkmark' size={24} color={COLORS.primary} />}
            </TouchableOpacity>

        </View>
        <View style={styles.card}>
            <View style={styles.typeSelector}>
                <TouchableOpacity 
  style={[
    styles.typeButton, 
    {backgroundColor: isExpense ? COLORS.expenseBackground : 'transparent'}
  ]} 
  onPress={() => setIsExpense(true)}
>
  <Ionicons name='arrow-down-circle-sharp' size={24} color={COLORS.expense} />
  <Text style={[
    styles.typeButtonText, 
    {color: isExpense ? COLORS.white : COLORS.text}
  ]}>
    Expense
  </Text>
</TouchableOpacity>

                <TouchableOpacity 
  style={[
    styles.typeButton, 
    {backgroundColor: !isExpense ? COLORS.incomeBackground : 'transparent'}
  ]} 
  onPress={() => setIsExpense(false)}
>
  <Ionicons name='add-circle-outline' size={24} color={COLORS.income} />
  <Text style={[
    styles.typeButtonText, 
    {color: !isExpense ? COLORS.white : COLORS.text}
  ]}>
    Income
  </Text>
</TouchableOpacity>
<TouchableOpacity></TouchableOpacity>

            </View>

           <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput 
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            />
        </View>
     <View style={styles.inputContainer}>
        <Ionicons name='create-outline' size={24} color={COLORS.text} style={styles.inputIcon} />
        <TextInput
       style={styles.input} 
       placeholder='Title'
         value={title}
         placeholderTextColor={COLORS.placeholder}

            onChangeText={setTitle}
        />
     </View>

     <View style={styles.categoryGrid}>
        {CATEGORIES.map(category=>(
            <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, selectedcategory === category.id && styles.categoryButtonActive]}
            onPress={() => setCategory(category.id)}
>
<Ionicons 
    name={category.icon} 
    size={20} 
    color={selectedcategory === category.id ? COLORS.white : COLORS.text}
    style={styles.categoryIcon} 
  />
<Text style={[styles.categoryButtonText, selectedcategory === category.id && styles.categoryButtonTextActive]}>{category.name}</Text>
</TouchableOpacity>

        ))}
     </View>
        </View>

{isLoading && (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
    </View>
)}
    </View>

  )
}

export default CreateTransaction