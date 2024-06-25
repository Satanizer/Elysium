import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Text, TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Screens} from '../misc/Screens';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {navigate} = useNavigation<NavigationProp<Screens>>();

  const handleDonePress = () => {
    // if (username === 'almond' && password == 'password') {
    navigate('Home');
    // } else {
    // Alert.alert('Username atau password salah!');
    // }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 25,
          fontWeight: 'bold',
          color: 'black',
          marginBottom: 24,
        }}>
        Sign In
      </Text>
      <View style={{width: '100%', marginBottom: 12}}>
        <Text style={{fontSize: 15, marginBottom: 5}}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={{
            height: 50,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#FF008A',
            backgroundColor: '#ffccec',
          }}
        />
      </View>
      <View style={{width: '100%', marginBottom: 200}}>
        <Text style={{fontSize: 15, marginBottom: 5}}>Password</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            height: 50,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#FF008A',
            backgroundColor: '#ffccec',
          }}
        />
      </View>
      <KeyboardAvoidingView style={{width: '100%'}}>
        <TouchableOpacity
          onPress={handleDonePress}
          style={{
            height: 50,
            borderRadius: 10,
            backgroundColor: '#FF008A',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: 0,
          }}>
          <Text style={{color: 'white'}}>Done</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};
