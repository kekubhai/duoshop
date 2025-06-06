import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Ionicons } from '@expo/vector-icons'
import { Alert, Text, TouchableOpacity } from 'react-native'
import {styles} from'../assets/styles/home.styles'
export default function SignOutButton() {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {
   Alert.alert("Logout", "Are you sure you want to log out?", [ 
    {text: "Cancel", style: "cancel" },
    {text:'LogOut',style:'destructive',onPress:signOut}
   ])
  }
  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
     <Ionicons name="log-out-sharp" size={24} color="#755c5c" />
    </TouchableOpacity>
  )
}