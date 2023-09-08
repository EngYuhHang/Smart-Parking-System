import React, { useEffect, useState } from "react";
import {View, StyleSheet, Text, Image, TextInput, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    
    //navigate to home page after log in success
    useEffect(() =>{
        const unsubscribe = auth.onAuthStateChanged(user =>{
            if (user){
                navigation.navigate('Profile')
            }
        })
        return unsubscribe
    }, [])

    //user log in function
    const login = () =>{
        signInWithEmailAndPassword(auth, email, password)
        .then((re) =>{
            console.log('Login successful');
        })
        .catch((re) =>{
            alert('Please insert valid credential');
            console.log(re);
        })
    }

    return (
        <SafeAreaView style = {{backgroundColor: 'White',flex:1, justifyContent:'center', alignItems:'center'}}>
           <View style = {styles.container}>
            <Image 
                source={require('../assets/logo.png')} 
                resizeMode="center" 
                style = {styles.image}>
            </Image>

            <Text style = {styles.title}>Welcome Back</Text>
            </View>
            <View style = {styles.input}>
                <MaterialIcon name = 'person' size={24} color= '#988686' style = {{marginRight:10}} />
                <TextInput placeholder="Email" value = {email} onChangeText={text => setEmail(text)} style = {{flex :1, paddingVertical:0}}/>
            </View> 

            <View style = {styles.input}>
                <MaterialIcon name = 'lock' size={24} color= '#988686' style = {{marginRight:10}} />
                <TextInput placeholder="Password" value = {password} onChangeText={text => setPassword(text)} style = {{flex :1, paddingVertical:0}} secureTextEntry={true}/>
            </View> 

            <TouchableOpacity onPress = {login} style = {styles.btn}> 
                <Text style = {{textAlign:'center', fontSize:20, color: 'white', width:100}}> Login </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress = {() => navigation.navigate('Register')} style = {styles.btn}>
                <Text style = {{textAlign:'center', fontSize:20, color: 'white', width:100}}> Register </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
};


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:''
    },
    image:{
        width: 200,
        height: 200,
        marginTop:30,
        marginBottom:20
    },
    title:{
        fontSize :36,
        fontStyle: "italic",
        color: 'black'
    },
    input:{
        flexDirection: "row",
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 20,
        marginHorizontal:25
    },
    btn:{
        backgroundColor: '#145DA0',
        padding:20,
        borderRadius: 10,
        marginHorizontal:30,
        marginVertical:10
    }
});

export default Login;