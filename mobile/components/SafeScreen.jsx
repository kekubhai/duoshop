import { View, Text } from 'react-native'
import React, { use } from 'react'
import { COLORS } from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const SafeScreen = ({children}) => {
  const insets=useSafeAreaInsets()
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top, paddingBottom: insets.bottom,  }}>
      {children}
    </View>
  )
}

export default SafeScreen