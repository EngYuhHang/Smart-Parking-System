import React, {useState, useEffect} from "react";
import {View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/core";
import Modal from 'react-native-modal';
import Moment from 'moment';
import {auth, fires} from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const Reload = () =>{

    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);

    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [currTime, setCurrTime] = useState('');
    const [type, setType] = useState('');

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setTimeout(()=>{
            setModalVisible(false);
        },3000);
    }

    const toggleModal2 = () => {
        setModal2Visible(!isModal2Visible);
    }

    useEffect(()=>{
        const interval = setInterval(()=>{
        var date = Moment().format('YYYY-MM-DD hh:mm:ss a');
        setCurrTime(date);
        getBalance();
    }, 3000);
    return () => clearInterval(interval)
    },[]);
    
    //get user balance amount
    const getBalance = async() =>{
        const userId = auth.currentUser.uid
        const docRef = doc(fires, 'user' , userId);
        const dataList = await getDoc(docRef)
        .catch((error) =>{
            console.log(error);
        });

        if (dataList.exists())
        {
            setBalance(dataList.data().balance);
            return true;
        }else {
            return false;
        }
    }

    const recordTranx = async() =>{
        const userId = auth.currentUser.uid;

        console.log('bal ',balance);
        console.log('amt ', amount);
        var newBal = parseInt(balance) + parseInt(amount);

        console.log(newBal);

        setDoc(doc(fires, userId, currTime),{
            Type: 'Top Up',
            total: amount,
            paymentType: type,
            date: currTime
        })
        .catch((error) =>{
            console.log(error);
        });

        //update user balance
        updateDoc(doc(fires, "user", userId), {
            balance: newBal
        })
        .catch((error) =>{
            console.log(error);
        });

        toggleModal();
    }
    return(
        <SafeAreaView style = {styles.container}>
            <View>
                <Text style = {{fontSize: 24, fontFamily:'sans-serif',marginVertical:30}}>Please Choose a Payment Method</Text>
            </View>
            <View>
                <TouchableOpacity style = {styles.btnContainer} onPress={ ()=> { toggleModal2(); setType('Debit/Credit Card')}}>
                    <Image source={require('../assets/card.png')}style ={styles.Image}></Image>
                    <Text style = {{fontSize: 18, fontFamily: 'sans-serif', marginLeft:20}}> Debit/Credit Card</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.btnContainer} onPress={ ()=> { toggleModal2(); setType('TNG eWallet')}}>
                  <Image source={require('../assets/tng.png')} style ={styles.Image}></Image>
                    <Text style = {{fontSize: 18, fontFamily: 'sans-serif', marginLeft:20}}>TNG eWallet</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.btnContainer} onPress={ ()=> { toggleModal2(); setType('GrabPay eWallet')}}>
                   <Image source={require('../assets/grab.png')} style ={styles.Image}></Image>
                    <Text style = {{fontSize: 18, fontFamily: 'sans-serif', marginLeft:20}}>GrabPay eWallet</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.btnContainer} onPress={ ()=> { toggleModal2(); setType('Boost eWallet')}}>
                   <Image source={require('../assets/boost.jpg')} style ={styles.Image}></Image>
                    <Text style = {{fontSize: 18, fontFamily: 'sans-serif', marginLeft:20}}>Boost eWallet</Text>
                </TouchableOpacity>
            </View>
            

            <TouchableOpacity onPress = {() => navigation.navigate('Profile')} style = {styles.btn}>
                    <Text style = {{textAlign:'center', fontSize:20, color: 'white', width:100}}> Back </Text>
            </TouchableOpacity>

            <Modal isVisible= {isModalVisible} style = {{maxHeight:150, backgroundColor:'#D1D0D0',marginTop:200}}>
                <View style = {styles.container}>
                    <Icon name="check-circle" size={40} color='green'></Icon>
                </View>
            </Modal>

            <Modal isVisible= {isModal2Visible} style = {{maxHeight:300, backgroundColor:'#D1D0D0',marginTop:200}}>
                <Text style = {{fontFamily: 'sans-serif' , fontSize: 30, textAlign:'center', marginTop:30}}>Top Up</Text>
                <View style = { styles.container}>
                    <TextInput 
                        onChangeText={text => setAmount(text)}
                        placeholder="  Enter Top Up Amount"
                        inputMode="numeric"
                        style = {{marginVertical:30, backgroundColor: 'white', borderWidth:1,marginHorizontal:30}}>
                    </TextInput>
                    <View style = {{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                        <TouchableOpacity onPress={ toggleModal2 } 
                                style ={{backgroundColor: 'red', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}} > 
                                <Text style = {styles.text}>Cancel</Text> 
                            </TouchableOpacity>
                        <TouchableOpacity onPress={ ()=> { toggleModal2(); recordTranx(); }} 
                                style ={{backgroundColor: 'green', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}} > 
                                <Text style = {styles.text}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
        
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    btn:{
        backgroundColor: '#145DA0',
        padding:20,
        borderRadius: 10,
        marginHorizontal:30,
        marginVertical:50
    },
    btnContainer:{
        flexDirection:'row',
        margin:20, 
        alignItems:'center', 
        justifyContent:'center'
    },
    input:{
        alignItems:'center',
        justifyContent:'center',
        marginVertical: 30,
        flexDirection:'row'
    },
    text:{
        fontSize: 18,
        fontFamily: 'sans-serif',
        marginLeft:20
    }
});

export default Reload;