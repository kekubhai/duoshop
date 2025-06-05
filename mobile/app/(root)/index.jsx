import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import SignOutButton from '../../components/SignOutButton'


 function Page() {
  const { user } = useUser()

  return (
    <View style={{ padding: 20 }}>
      <SignedIn>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Welcome, {user?.emailAddresses[0]?.emailAddress}!
        </Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Link href="/(auth)/sign-in">
            <Text style={{ color: 'blue' }}>Sign In</Text>
          </Link>
          <Link href="/(auth)/sign-up">
            <Text style={{ color: 'green' }}>Sign Up</Text>
          </Link>
        </View>
      </SignedOut>
    </View>
  )
}
export default Page