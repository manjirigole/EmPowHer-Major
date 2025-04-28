import React from 'react'
import { SplashScreen, Stack } from 'expo-router'


const PreandPostLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{headerShown: false}}/>
    </Stack>
  )
}

export default PreandPostLayout