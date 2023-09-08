import React, {useEffect, useState, useRef} from "react";
import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import {View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Alert, TextInput} from 'react-native';
import { useNavigation } from "@react-navigation/core";
import { GOOGLE_API } from "../config/googleKey";
import Moment, { duration } from 'moment';
import {auth, fires} from '../config/firebase';
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import Modal from 'react-native-modal';

const Maps =() => {
    const navigation = useNavigation();

    const mapRef = useRef();
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () =>{
        setModalVisible(!isModalVisible);
    }

    //parking location list
    const [parkingLoc, setParkingLoc] = useState({
        P1: {
            latitude : 3.140852 , longitude : 101.693207,
        },
        P2: {
            latitude : 3.127887 , longitude : 101.594490,
        },
        P3: {
            latitude : 1.485561 , longitude : 103.387856,
        },
        P4: {
            latitude: 3.068962, longitude : 101.684316,
        }
    })

    //destination location
    const [destinationLoc, setDestinationLoc] = useState('');

    //user location 
    const [userLoc, setUserLoc] = useState({
        latitude: 3.140853,
        longitude: 101.693207,
        latitudeDelta: 0.0050,
        longitudeDelta: 0.0050,
    });

    //parking transaction info
    const [parkingName, setParkingName] = useState('');
    const [rate, setRate] = useState('');
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [newBalance, setNewBalance] = useState(0);
    const [currTime, setCurrTime] = useState('');

    const checkAvailability = () =>{
        if (parkingName === ''){
            alert('Please choose a location on map first');
        }else
        {
            setStartTime(currTime);
            toggleModal();
        }
    }

    const storeToDB = async() =>{
        const userId = auth.currentUser.uid;
        
        const docRef = doc(fires, 'user' , userId);
        const dataList = await getDoc(docRef);
        const endTime = Moment().add(duration, 'h').format('YYYY-MM-DD hh:mm:ss a');

        if (dataList.exists())
        {
            var total = parseInt(duration) * parseInt(rate);
            var balance = parseInt(dataList.data().balance);

            if ( balance >= total)
            {
                const newBalance = balance - total;
                const docRef = doc(fires, userId, currTime);
                await setDoc(docRef,
                    {
                        Type: 'Pay',
                        parkingName: parkingName,
                        duration: duration,
                        startTime: startTime,
                        expireTime: endTime,
                        total: total
                    }).then((re)=>{
                        alert('Check In Successful for ', duration, ' hours');
                        setDestinationLoc('');
                        recenter();
                    }).then(()=>{

                        //update user balance
                        updateDoc(doc(fires, "user", userId), {
                            balance: newBalance
                        })
                    }).catch((error) =>{
                        console.log(error);
                    })
            }else
            {
                alert('Not enough balance, please top up!!');
            }
        }else{
            alert('Something went wrong, please try again!!');
        }
    }

    //if user confirm destination system will update destinationLoc and price
    const confirmLocation = async(loc, name , fee) =>{
        await Alert.alert(
            'Destination Confirm',
            'Do you want to set this place as your destination ?',
            [
                { text: 'Cancel', onPress: () => {
                    console.log('Cancel');
                    }},
                { text: 'OK', onPress: ()=> {
                    setParkingName(name);
                    setRate(fee);
                    setDestinationLoc(loc);
                    recenter();
                    } 
                }
            ]
        )
    }

    useEffect(()=>{
        const interval = setInterval(()=>{
        var date = Moment().format('YYYY-MM-DD hh:mm:ss a');
        setCurrTime(date);
    }, 3000);
    return () => clearInterval(interval)
    },[]);

    //get user location every 5 seconds
    useEffect(()=>{
        const interval = setInterval(()=>{
            getLocation()
        console.log('auto refresh loc' , userLoc);
        }, 5000);
        return () => clearInterval(interval)
    },[]);
    
    //get user current location
    const getLocation =async () =>{
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            setErrorMsg('Location permission access denied');
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
            accuracy: Location.Accuracy.BestForNavigation
        });
        setUserLoc({ latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude});
    };

    //navigate map to user location
    const recenter = () => {
        mapRef.current.animateToRegion({
            latitude: userLoc.latitude,
            longitude: userLoc.longitude,
            latitudeDelta: 0.0050,
            longitudeDelta: 0.0050,
        }, 1000)
    }
    
    return(
        <SafeAreaView>
            <MapView 
                ref={mapRef}
                provider= {PROVIDER_GOOGLE}
                style= {styles.map}
                initialRegion= {userLoc}  
                zoomControlEnabled = {true}
            >
                <Marker
                    coordinate={userLoc}
                    title="Me"
                    image={require('../assets/marker.png')}
                />

                <Marker
                    coordinate={ parkingLoc.P1 }
                    title ='Parking 1'
                    description = 'RM2/h'
                    onPress={()=> confirmLocation(parkingLoc.P1, 'P1', 2) }
                />
                <Marker
                    coordinate={ parkingLoc.P2 }
                    title ='Parking 2'
                    description = 'RM2/h'
                    onPress={ ()=> confirmLocation(parkingLoc.P2, 'P2' , 2)}
                />
                <Marker
                    coordinate={ parkingLoc.P3 }
                    title ='Parking 3'
                    description = 'RM1/h'
                    onPress={ ()=> confirmLocation(parkingLoc.P3, 'P3' , 1)}
                />

                <Marker
                    coordinate={ parkingLoc.P4 }
                    title ='Parking 3'
                    description = 'RM2/h'
                    onPress={ ()=> confirmLocation(parkingLoc.P4, 'P4' , 2)}
                />

                <MapViewDirections 
                    origin={userLoc}
                    destination={destinationLoc}
                    apikey = {GOOGLE_API}
                    strokeWidth={3}
                    strokeColor="green"
                    optimizeWaypoints= {true}
                />
            </MapView> 
            <View style ={ styles.btnContainer }>
                <TouchableOpacity onPress={() => navigation.navigate('History')} style ={ styles.btn} > 
                    <Text style = {styles.txt}>History</Text> 
                </TouchableOpacity>
                <TouchableOpacity onPress={recenter} style ={ styles.btn} > 
                    <Text style = {styles.txt}>Recenter</Text> 
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style ={ styles.btn} > 
                    <Text style = {styles.txt}>Profile</Text> 
                </TouchableOpacity>
            </View>

            <View style ={ styles.btnContainer }>
                <TouchableOpacity onPress={()=> {setDestinationLoc(''); recenter()}} 
                    style ={{backgroundColor: 'red', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}}> 
                    <Text style = {styles.txt}>Cancel</Text> 
                </TouchableOpacity>
                <TouchableOpacity onPress={checkAvailability} 
                    style ={{backgroundColor: 'green', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}}> 
                    <Text style = {styles.txt}>Book</Text> 
                </TouchableOpacity>
            </View>

            <Modal isVisible= {isModalVisible} style = {{maxHeight:300, backgroundColor:'#D1D0D0',marginTop:200}}>
                <View style = { styles.container}>
                    <Text style = {{fontFamily: 'sans-serif' , fontSize: 30, textAlign:'center', marginTop:30}}>Insert Duration</Text>
                    <View >
                        <TextInput 
                            onChangeText={text => setDuration(text)}
                            placeholder="  Enter Duration (Hour)"
                            inputMode="numeric"
                            maxLength = {2}
                            style = {{marginVertical:30, backgroundColor: 'white', borderWidth:1,marginHorizontal:30}}>
                        </TextInput>
                        <View style = {{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                            <TouchableOpacity onPress={ toggleModal } 
                                    style ={{backgroundColor: 'red', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}} > 
                                    <Text style = {styles.txt}>Cancel</Text> 
                                </TouchableOpacity>
                            <TouchableOpacity onPress={ ()=> { toggleModal(); storeToDB() }} 
                                    style ={{backgroundColor: 'green', padding:10, borderRadius: 10, marginHorizontal:10, marginVertical:10, width:120}} > 
                                    <Text style = {styles.txt}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    btnContainer :{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
    },
    map:{
        height:'80%',
    },
    btn:{
        backgroundColor: '#145DA0',
        borderRadius: 10,
        marginHorizontal:10,
        marginVertical:20,
        padding:10,
        width:100
    },
    txt:{
        textAlign:'center',
        fontSize:18, 
        color: 'white', 
        fontFamily:'sans-serif'
    },
    image:{
        width: 40,
        height: 40,
        marginTop:5,
        marginBottom:5
    },
});

export default Maps;