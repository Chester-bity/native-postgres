import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer,DefaultTheme2 } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import HomeScreen from "./main/home";

const Stack = createNativeStackNavigator();
const theme = {
   ...DefaultTheme,
   dark: false,
   colors: {
      ...DefaultTheme.colors,
      background: "white",
      // text:"#ffffff",

   },
   // fonts: Fonts;
};
function App() {
   // console.log(DefaultTheme2);
   return (
      <PaperProvider theme={theme} >
         <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName="Home">
               <Stack.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }} />
            </Stack.Navigator>
         </NavigationContainer>
         </PaperProvider>
   );
}

export default App;