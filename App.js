import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from './design/Login';
import Register from './design/Register';
import Profile from './design/Profile';
import Maps from './design/Maps';
import History from './design/History';
import Reload from './design/Reload';

const Stack = createNativeStackNavigator();

const App = () => {
  return(
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name ="Login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name ="Register" component={Register} options={{headerShown:false}}/>
          <Stack.Screen name ="Profile" component={Profile} options={{headerShown:false}}/>
          <Stack.Screen name ="Maps" component={ Maps } options={{headerShown:false}}/>
          <Stack.Screen name ="History" component={History} options={{headerShown:false}}/>
          <Stack.Screen name ="Reload" component={Reload} options={{headerShown:false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;