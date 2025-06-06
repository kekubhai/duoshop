import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import SignOutButton from '../../components/SignOutButton'
import { useTransactions } from '../hooks/useTransactions'
import { useEffect } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.styles'
import { useRouter } from 'expo-router'
import { Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
//import '../global.css'
 function Page() {
  const { user } = useUser()
  const [isLoading,setisLoading]=useState(false)
  const router=useRouter();
 const { transactions, summary, loading, loadData, deleteTransactions } = useTransactions(user.id)
 useEffect(()=>{
  
      loadData()

 }, [loadData])
 if (isLoading) return <PageLoader/>

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 25 }}
              source={require('../../assets/images/logo1.png')}
            />
            <View style={styles.welcomeContainer}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#200e0e', paddingLeft: 10 }}>
                Namaste,
              </Text>
            <Text style={{fontSize:20, fontStyle:'italic', paddingLeft: 10, color: '#200e0e' }}>
              </Text>
              <Text style={styles.usernameText}>{user.emailAddresses[0]?.emailAddress.split('@')[0]}</Text>
        </View>
        </View>  
         <View style={styles.headerRight}>
        <TouchableOpacity style={styles.addButton} onPress={()=>router.push('/create')}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add </Text>
        </TouchableOpacity>
        <SignOutButton/>
      </View> 
        </View>
      </View>
    </View>
  )
}
export default Page