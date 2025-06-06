import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

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
    const router = useRouter()
    const [title, setTitle] = React.useState('')
    const [amount, setAmount] = React.useState('')
    const [category, setCategory] = React.useState(CATEGORIES[0].id)
    const [isLoading, setIsLoading] = React.useState(false)
    const handleCreateTransactions =async ()=>{
        try {
            setIsLoading(true)
            await createTransaction({ title, amount, category })
            router.push('/')
        } catch (error) {
            console.error('Error creating transaction:', error)
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <View>
      <Text>Create Transaction</Text>
    </View>
  )
}

export default CreateTransaction