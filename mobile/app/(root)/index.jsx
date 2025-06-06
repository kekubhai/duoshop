import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { FlatList } from 'react-native'
import { useState } from 'react'
import BalanceCard from '../../components/BalanceCard'
import { Text, TouchableOpacity, View } from 'react-native'
import SignOutButton from '../../components/SignOutButton'
import { useTransactions } from '../hooks/useTransactions'
import { useEffect } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.styles'
import { useRouter } from 'expo-router'
import { Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TransactionsItem } from '../../components/TransactionsItem'
import NoTransactionsFound from '../../components/NotFoundTransaction'
import { RefreshControl } from 'react-native'
//import '../global.css'
 function Page() {
  const handleDelete =(id)=>
  {
    Alert.alert ('Delete Transaction',
    'Are you sure you want to delete this transaction?',
  [
    {text:"Cancel", style:'cancel'},
    {text:"Delete", style:'destructive',onPress:()=>deleteTransactions(id)}
  ])

  }
  const { user } = useUser()
const [refreshing, setRefreshing] = useState(false)
  const [isLoading,setisLoading]=useState(false)
  const router=useRouter();
  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }
 const { transactions, summary, loading, loadData, deleteTransactions } = useTransactions(user.id)
 useEffect(()=>{
  
      loadData()

 }, [loadData])
 console.log('summary', summary)
 console.log('Transactions:', transactions)
 if (isLoading && refreshing) return <PageLoader/>

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View  style={styles.header}>
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
          <Ionicons name="add-circle-sharp" size={24} color="white" />
          <Text style={styles.addButtonText}>Add </Text>
        </TouchableOpacity>
        <SignOutButton/>
      </View> 
        </View>
      <BalanceCard summary={summary}/>
      <View>
        <Text style={{fontSize: 26, fontWeight: 'bold', color: '#200e0e'}}>Recent Transactions</Text>
      </View>
      {transactions && transactions.length > 0 ? (
  <>
    
    <FlatList
      ListEmptyComponent={<NoTransactionsFound />}
      data={[]}
      renderItem={({ item }) => {
        console.log("Rendering item:", item);
        return <TransactionsItem item={item} onDelete={handleDelete} />;
      }}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  </>
) : (
  <Text>No transactions available</Text>
)}
      </View>
    </View>
  )
}
export default Page