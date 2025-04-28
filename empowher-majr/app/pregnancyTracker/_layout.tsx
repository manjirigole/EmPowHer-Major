import React from 'react'
import {  Stack } from 'expo-router'


const PregnancyLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{headerShown: false}}/>
    </Stack>
  )
}

export default PregnancyLayout