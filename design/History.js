import React, { useEffect, useState } from "react";
import {View, StyleSheet, Text, TouchableOpacity,FlatList, SafeAreaView} from 'react-native';
import { useNavigation } from "@react-navigation/core";
import { collection, getDocs, limit, query, where} from "firebase/firestore";
import { auth, fires } from "../config/firebase";
import Modal from 'react-native-modal';

const History = () =>{
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState('');
    const [reloadData, setReloadData] = useState('');
    
    useEffect(()=>{
        getData();
        getReloadData();
    },[]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }
    

    const getData = async() =>{
        const userId = auth.currentUser.uid;
        console.log(userId);
        const colRef = query(collection(fires, userId), where("Type","==","Pay"),limit(20));
        const querySnapshot = await getDocs(colRef);
        const list= [];
        querySnapshot.forEach((docs) =>{
            list.push({
                name: docs.data().parkingName,
                duration: docs.data().duration,
                total: docs.data().total,
                start: docs.data().startTime,
                end: docs.data().expireTime
            })
        });
        setData(list);
        console.log(data);
    }

    const getReloadData = async() =>{
        const userId = auth.currentUser.uid;
        const colRef = query(collection(fires, userId), where("Type","==","Top Up"),limit(20));
        const querySnapshot = await getDocs(colRef);
        const list= [];
        querySnapshot.forEach((docs) =>{
            list.push({
                total: docs.data().total,
                date: docs.data().date,
                paymentType: docs.data().paymentType
            })
        });
        setReloadData(list);
        console.log(reloadData);
    }

    return(
        <SafeAreaView style = {styles.container}>
            <Text style = {{fontSize: 24, fontFamily:'sans-serif',marginVertical:30, textAlign:'center'}}>History</Text>
                <FlatList 
                    style = {{padding:10}} 
                    scrollEnabled={true}
                    data = {data} 
                    numColumns={1} 
                    renderItem={({item}) => (
                        <TouchableOpacity style = {styles.itemContainer}>
                            <View style ={styles.innerCon}>
                                <Text style = {styles.itemHeading}>
                                    Parking: {item.name}
                                </Text>
                                <Text style = {styles.itemText}>
                                    Duration: {item.duration}
                                </Text>
                                <Text style = {styles.itemText}>
                                    Total: {item.total}
                                </Text>
                                <Text style = {styles.itemText}>
                                    Start Time: {item.start}
                                </Text>
                                <Text style = {styles.itemText}>
                                    End Time: {item.end}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            
            <View style = {styles.btnContainer}>
                <TouchableOpacity onPress = {()=>{toggleModal();}} style = {styles.btn}>
                    <Text style = {{textAlign:'center', fontSize:20, color: 'white', width:100}}>Top up History</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => navigation.navigate('Maps')} style = {styles.btn}>
                        <Text style = {{textAlign:'center', fontSize:20, color: 'white', width:100}}>Back</Text>
                </TouchableOpacity>
            </View>


            <Modal isVisible={isModalVisible} style = {{maxHeight:800}}>
                <View style = {styles.container}>
                    <Text style = {{fontSize: 24, fontFamily:'sans-serif',marginVertical:30, textAlign:'center'}}>Top Up History</Text>
                    <FlatList 
                        style = {{padding:10, backgroundColor:'#c0c0c0'}} 
                        scrollEnabled={true}
                        data = {reloadData} 
                        numColumns={1} 
                        renderItem={({item}) => (
                            <TouchableOpacity style = {styles.itemContainer}>
                                <View style ={styles.innerCon}>
                                    <Text style = {styles.itemHeading}>
                                        Date: {item.date}
                                    </Text>
                                    <Text style = {styles.itemText}>
                                        Total: {item.total}
                                    </Text>
                                    <Text style = {styles.itemText}>
                                        Payment Method: {item.paymentType}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <View style = {styles.btnContainer}>
                        <TouchableOpacity onPress={toggleModal} 
                                style ={{backgroundColor: '#145DA0', padding:10, borderRadius: 10, width:120, marginVertical:20, justifyContent:'center'}} > 
                                <Text style =  {{textAlign:'center', fontSize:20, color: 'white', width:100}}>Done</Text> 
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
        backgroundColor:'#c0c0c0',
        marginTop: 40
    },
    btn:{
        backgroundColor: '#145DA0',
        padding:10,
        borderRadius: 10,
        marginHorizontal:30,
        marginVertical:10,
        width:120,
        height:80,
        marginTop:20,
        justifyContent:'center'
    },
    itemContainer:{
        padding:20,
        margin:5,
        borderRadius:20,
        borderWidth:1,
        borderColor:'black',
        backgroundColor:'#D1D0D0'
    },
    innerCon:{
        alignItems:'center',
        flexDirection:'column'
    },
    itemHeading:{
        fontFamily:'sans-serif',
        fontSize:16
    },
    itemText:{
        fontFamily:'sans-serif',
        fontSize:14
    },
    btnContainer:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
    }
});

export default History;