import { Stack } from 'expo-router'
import React from 'react'

const OnboardingLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="NameStep" options={{headerShown: false}}/>
        <Stack.Screen name="LastMenstrualStep" options={{headerShown: false}}/>
        <Stack.Screen name="NotificationStep" options={{headerShown: false}}/>
        <Stack.Screen name="ConfirmationStep" options={{headerShown: false}}/>
    </Stack>
  )
}

export default OnboardingLayout