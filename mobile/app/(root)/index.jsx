import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { FlatList, SafeAreaView } from 'react-native'
import { useState, useEffect } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { useTransactions } from '../hooks/useTransactions'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { TransactionsItem } from '../../components/TransactionsItem'
import NoTransactionsFound from '../../components/NotFoundTransaction'
import { RefreshControl } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { Alert, ActivityIndicator } from 'react-native'
function Page() {
  const { user } = useUser()
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  
  const { transactions, summary, loading, loadData, deleteTransactions } = useTransactions(user?.id)
  
  useEffect(() => {
    loadData()
  }, [loadData])
  
  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }
  
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {text: "Cancel", style: 'cancel'},
        {text: "Delete", style: 'destructive', onPress: () => deleteTransactions(id)}
      ]
    )
  }

  const firstName = user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0] || 'User'

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#ff6b6b', '#ff9e9e']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <Text style={styles.greetingText}>Namaste</Text>
              <Text style={styles.nameText}>{firstName}</Text>
            </View>
            
            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={styles.addButtonNew}
                onPress={() => router.push('/create')}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => router.push('/profile')}>
                <Image
                  style={styles.avatarImage}
                  source={require('../../assets/images/logo1.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Balance card is now part of header */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>
                ₹{parseFloat(summary?.balanceResult || 0).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.iconCircle, styles.incomeCircle]}>
                  <Ionicons name="arrow-up" size={18} color="#00b894" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text style={styles.statAmount}>₹{parseFloat(summary?.incomeResult || 0).toFixed(2)}</Text>
                </View>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={[styles.iconCircle, styles.expenseCircle]}>
                  <Ionicons name="arrow-down" size={18} color="#ff7675" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Expenses</Text>
                  <Text style={styles.statAmount}>₹{parseFloat(summary?.expenseResult || 0).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
      
      {/* Transactions section */}
      <View style={styles.transactionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/transactions')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6b6b" />
          </View>
        ) : transactions && transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={({ item }) => <TransactionsItem item={item} onDelete={handleDelete} />}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <NoTransactionsFound />
        )}
      </View>
      
      {/* Floating action button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/create')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeSection: {},
  greetingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonNew: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  incomeCircle: {
    backgroundColor: 'rgba(0, 184, 148, 0.1)',
  },
  expenseCircle: {
    backgroundColor: 'rgba(255, 118, 117, 0.1)',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  transactionsContainer: {
    flex: 1,
    padding: 20,
    marginTop: -20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAllText: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
};

export default Page;