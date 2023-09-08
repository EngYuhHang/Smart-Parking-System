import React, { useState, useEffect } from "react";
import {View, StyleSheet, Text, TouchableOpacity, TextInput, Image, SafeAreaView, KeyboardAvoidingView} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { auth, db, fires } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { useNavigation } from '@react-navigation/core';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNo, setPhoneNo] = useState('');

    const navigation = useNavigation();

    const SignUp = () =>{
        createUserWithEmailAndPassword(auth,email,password)
        .then(async (result) =>{
            const ref = setDoc(doc(fires, "user", result.user.uid),{
                username: username,
                email: email,
                password: password,
                phoneNo: phoneNo,
                balance: 0
            })

            setDoc(doc(fires, "carNo", result.user.uid),{
                car1:'-',
                car2:'-',
                car3:'-'
            })
            navigation.navigate('Login')
            alert('User Register Successful!')
        }).catch( (error) =>{
            console.log(error);
            if (error.code === 'auth/email-already-in-use'){
                alert('Email already in use');
            }else{
                alert('Invalid credential, please try again');
            }
        })
    }

    return (
        <KeyboardAvoidingView style = {styles.container}>
                <Image 
                    source={require('../assets/register.png')} 
                    resizeMode="center" 
                    style = {styles.image}>
                </Image>

                <Text style = {styles.title}>Let's Get Started</Text>  
            

            <View style = {styles.input}>
                <MaterialIcon name = 'person' size={24} color= '#988686' style = {{marginRight:10}} />
                <TextInput placeholder="Username" value = {username} onChangeText={text => setUsername(text)} style = {{flex :1, paddingVertical:0}}/>
            </View> 

            <View style = {styles.input}>
                <MaterialIcon name = 'lock' size={24} color= '#988686' style = {{marginRight:10}} />
                <TextInput placeholder="Password" value = {password} onChangeText={text => setPassword(text)} style = {{flex :1, paddingVertical:0}} secureTextEntry={true}/>
            </View> 

            <View style = {styles.input}>
                <MaterialIcon name = 'email' size={24} color= '#988686' style = {{marginRight:10}} />
                <TextInput placeholder="Email Address" inputMode="email" value = {email} onChangeText={text => setEmail(text)} style = {{flex :1, paddingVertical:0}}/>
            </View> 

            <View style = {styles.input}>
                <MaterialIcon name = 'smartphone' size={24} color= '#988686' style = {{marginRight:10}} />
                <TextInput placeholder="Phone Number" inputMode="numeric" value = {phoneNo} onChangeText={text => setPhoneNo(text)}  style = {{flex :1, paddingVertical:0}}/>
            </View> 

            <TouchableOpacity onPress = {SignUp} style = {styles.btn}>
                <Text style = {{textAlign:'center', fontSize:20, color: 'white'}}> Register </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress = {() => navigation.navigate('Login')} style = {{marginHorizontal:25, marginBottom: 10, textAlign:'center'}}> 
                <Text style = {{color: '#988686',fontStyle:'italic', fontSize:16}}>Have an account? </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
        
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#D1D0D0'
    },
    image:{
        width: 150,
        height: 150,
        marginBottom:10
    },
    title:{
        fontSize :30,
        color: 'black',
        marginBottom:20
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

export default Register;