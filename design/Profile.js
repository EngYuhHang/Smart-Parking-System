import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signOut } from "firebase/auth";
import { auth, fires } from "../config/firebase";
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import Modal from "react-native-modal";

const Profile = () =>{
    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);

    const [isModal2Visible, setModal2Visible] = useState(false);

    const toggleModal = (no) => {
        if (no === 1){
            setModalVisible(!isModalVisible);
        }else
            setModal2Visible(!isModal2Visible);
      };

    const [userInfo, setUserInfo] = useState({
        email:'', 
        password: '', 
        phoneNo: '', 
        username: '',
        balance:''
    });

    const [carNo, setCarNo] = useState({
        car1:'-',
        car2:'-',
        car3:'-'
    });

    const [updateField, setUpdateField] = useState('');
    const [newCarNo, setNewCarNo] = useState('');

    const [newUsername, setNewUsername] = useState('');
    const [newPhone, setNewPhone] = useState('');
    
    //user signout
    const signout = () =>{
        signOut(auth)
        .then((re)=>{
            navigation.replace('Login')
        })
        .catch((re)=>{
        console.log(er);
        })
    }

    useEffect(() =>{
        const interval = setInterval(()=>{
            getInfo();
            getCarNo();
        }, 3000);
        return () => clearInterval(interval)
    },[]);

    //fetch user info from firestore
    const getInfo = async() =>{
        const userId = auth.currentUser.uid
        const docRef = doc(fires, 'user' , userId);
        const dataList = await getDoc(docRef);

        if (dataList.exists())
        {
            setUserInfo(dataList.data());
        }
    }

    //fetch user register car plate from firestore
    const getCarNo = async() =>{
        const userId = auth.currentUser.uid
        const docRef = doc(fires, 'carNo' , userId);
        const dataList = await getDoc(docRef);

        if (dataList.exists())
        {
            setCarNo(dataList.data());
        }
    }

    //update car plate
    const updateCarNo = async() =>{
        if (newCarNo === ''){
            setNewCarNo('-');
        }
        const userId = auth.currentUser.uid;
        const docRef = await doc(fires, 'carNo' , userId);
        if (updateField === 'car1')
        {
            updateDoc(docRef, {
                car1: newCarNo
            }
            )
            .then(() =>{
                alert("Car 1 Info Updated");
            });
        }else if (updateField === 'car2') {
            updateDoc(docRef, {
                car2: newCarNo
            }
            )
            .then(() =>{
                alert("Car 2 Info Updated");
            });
        } else {
            updateDoc(docRef, {
                car3: newCarNo
            }
            )
            .then(() =>{
                alert("Car 3 Info Updated");
            });
        }
    }

    //update profile
    const updateProfile = async() =>{
        const userId = auth.currentUser.uid;
        const docRef = await doc(fires, 'user' , userId);

        console.log(newUsername, newPhone);

        if (newUsername != null && newPhone != null)
        {
            updateDoc(docRef, {
                username: newUsername,
                phoneNo: newPhone
            }
            )
            .then(() =>{
                alert("Info Updated");
            });
        }else if (newUsername === null){
            updateDoc(docRef, {
                phoneNo: newPhone
            }
            )
            .then(() =>{
                alert("Info Updated");
            });
        }else if (phoneNo === null){
            updateDoc(docRef, {
                username: newUsername
            }
            )
            .then(() =>{
                alert("Info Updated");
            });
        }
    }   

    return(
        <SafeAreaView style = {styles.container}>
            <View style = {styles.balanceTop}>
                <Icon name="wallet-outline" size={50} color='#988686'/>
                <Text style = {{fontFamily: 'sans-serif' , fontSize: 30, marginLeft: 10}}>My Balance:</Text>
            </View>

            <View style = {styles.balanceBottom}>
                <Text style = {{fontFamily: 'sans-serif' , fontSize: 26, marginLeft: 10}}> {userInfo.balance}</Text>

                <TouchableOpacity 
                    onPress= {()=> navigation.navigate('Reload')} 
                    style = {{backgroundColor: '#009698', marginLeft: 10, height:30, width:100, borderRadius: 30, marginLeft:100}} 
                    android_ripple= {{borderless:true, radius:50}}>
                    <Text style = {{fontSize: 18, padding: 5, textAlign: 'center'}}>+ Reload</Text>
                </TouchableOpacity>
            </View>
                <View style = {styles.infoContainer}>
                 <Icon name="account-circle" size={36} color='#988686'/>
                    <Text style={styles.text}> {userInfo.username} </Text>
                </View>
                <View style = {styles.infoContainer}>
                <Icon name="email" size={36} color='#988686'/>
                    <Text style={styles.text}> {auth.currentUser?.email} </Text>
                </View>
                <View style = {styles.infoContainer}>
                <Icon name="phone" size={36} color='#988686'/>
                    <Text style={styles.text}>{userInfo.phoneNo} </Text>
                </View>
                <View style = {styles.infoContainer}>
                    <Icon name="car-side" size={36} color='#988686'/>
                    <Text style ={styles.text}>My Car:</Text>
                    <Text style = {{fontSize: 14, padding:5, marginLeft: 10, fontStyle:'italic'}}>(Select car plate to edit)</Text>
                </View>
                
            <View style = {styles.carList}>
                <TouchableOpacity style = {styles.carBtnContainer} onPress={ ()=> {setUpdateField('car1');toggleModal(1); }}>
                    <Text style = {{fontSize: 18, fontFamily: 'sans-serif'}}> {carNo.car1}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.carBtnContainer} onPress={  ()=> {setUpdateField('car2');toggleModal(1); }}>
                    <Text style = {{fontSize: 18, fontFamily: 'sans-serif'}}>{carNo.car2}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.carBtnContainer} onPress={  ()=> { setUpdateField('car3');toggleModal(1);}}>
                    <Text style = {{fontSize: 18, fontFamily: 'sans-serif'}}>{carNo.car3}</Text>
                </TouchableOpacity>
                
            </View>

            <View style = {styles.btnContainer}>
                <TouchableOpacity onPress= {()=> navigation.navigate('Maps')} style = {styles.icon} android_ripple= {{borderless:true, radius:50}}>
                <Icon name="map" size={30} color='#c0c0c0'/>
                <Text style = {{fontSize: 18, paddingLeft: 10}}>Maps</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress= {()=> toggleModal(2)} style = {styles.icon} android_ripple= {{borderless:true, radius:50}}>
                <Icon name="account-edit" size={30} color='#c0c0c0'/>
                <Text style = {{fontSize: 18, paddingLeft: 10}}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
            <View style = {styles.btnContainer}>
                <TouchableOpacity onPress= {signout} style = {styles.icon} android_ripple= {{borderless:true, radius:50}}>
                    <Icon name="logout" size={30} color='#c0c0c0'/>
                    <Text style = {{fontSize: 18, paddingLeft: 10}}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <Modal isVisible= {isModalVisible} style = {{maxHeight:200, backgroundColor:'#D1D0D0',marginTop:250}}>
                <View>
                    <Text style = {{fontFamily: 'sans-serif' , fontSize: 30, textAlign:'center'}}>Update Car Plate</Text>
                    <TextInput 
                        onChangeText={text => setNewCarNo(text)}
                        style = {{marginVertical:30, backgroundColor: 'white', borderWidth:1,marginHorizontal:30}}></TextInput>
                    <View style = {{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                        <TouchableOpacity onPress={ ()=> toggleModal(1)} 
                            style ={{backgroundColor: 'red', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}} > 
                            <Text style = {styles.text}>Cancel</Text> 
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {updateCarNo(); toggleModal(1)}} 
                                style ={{backgroundColor: 'green', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}} > 
                                <Text style = {styles.text}>OK</Text> 
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal isVisible= {isModal2Visible} style = {{maxHeight:450, backgroundColor:'#D1D0D0',marginTop:100}}>
                <View>
                    <Text style = {{fontFamily: 'sans-serif' , fontSize: 30, textAlign:'center'}}>Update Profile</Text>
                    <TextInput 
                        placeholder="   Username" 
                        onChangeText={text => setNewUsername(text)} 
                        style = {{marginVertical:30, backgroundColor: 'white', borderWidth:1,marginHorizontal:30}}/>

                        <TextInput 
                            placeholder="   Phone Number" 
                            onChangeText={text => setNewPhone(text)}  
                            style = {{marginVertical:30, backgroundColor: 'white', borderWidth:1,marginHorizontal:30}}/>

                    <View style = {{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                        <TouchableOpacity onPress={() =>toggleModal(2)} 
                            style ={{backgroundColor: 'red', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}} > 
                            <Text style = {styles.text}>Cancel</Text> 
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {updateProfile(); toggleModal(2)}} 
                                style ={{backgroundColor: 'green', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}} > 
                                <Text style = {styles.text}>OK</Text> 
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
};

const styles =StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#D1D0D0'
    },
    balanceTop:{
        flexDirection:'row', 
        paddingHorizontal: 30, 
        paddingTop:50
    },
    balanceBottom:{
        flexDirection:'row', 
        borderBottomWidth:1, 
        borderBottomColor: 'black', 
        padding: 30,
    },
    icon:{
        backgroundColor: '#145DA0',
        fontWeight:500,
        marginTop:20,
        marginHorizontal:20,
        height:50,
        width:150,
        borderRadius:30,
        flexDirection:'row',
        padding:10,
        justifyContent:'center'
    },
    text:{
        fontSize: 18,
        fontFamily: 'sans-serif',
        marginLeft:20
    },
    carList:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor: 'black',
        marginVertical: 10,
        alignItems:'center',
        justifyContent:'center'
    },
    infoContainer :{
        flexDirection: 'row',
        marginLeft:50,
        marginVertical:25
    },
    btnContainer:{
        flexDirection:'row',
        marginHorizontal:20, 
        alignItems:'center', 
        justifyContent:'center'
    },
    carBtnContainer:{
        flexDirection:'row',
        marginHorizontal:5, 
        alignItems:'center', 
        justifyContent:'center',
        borderWidth:1,
        marginBottom:20,
        paddingHorizontal:5,
        paddingVertical:10,
        borderRadius:20,
        width:110
    }
});

export default Profile;