import { View, Text, Alert, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import {COLORS} from '../../constants/Colors'
import {styles} from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons'
import API_URL from '../../constants/API'
import {useUser} from '@clerk/clerk-expo'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
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

    const user=useUser()
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
                category:selectedcategory,
                userId:user.id,
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
            <TouchableOpacity style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]} >
                <Text style={styles.saveButton}>{isLoading ? "Saving ..." : "Save"}</Text>
                {!isLoading && <Ionicons name='checkmark' size={24} color={COLORS.primary} />}
            </TouchableOpacity>

        </View>
        <View style={styles.card}>
            <View style={styles.typeSelector}>
                <TouchableOpacity style={[styles.typeButton, isExpense && styles.typeButtonSelected]} onPress={() => setIsExpense(true)}>
                    <Ionicons name='arrow-down-circle-sharp' size={24} color={COLORS.expense} />
                    <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.typeButton, !isExpense && styles.typeButtonSelected]} onPress={() => setIsExpense(false)}>
                    <Ionicons style={styles.typeIcon} name='add-circle-outline' size={24} color={COLORS.income} />
                    <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Income</Text>
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
            
></TouchableOpacity>
        ))}
     </View>
        </View>
      <Text>Create Transaction</Text>
    </View>
  )
}

export default CreateTransaction