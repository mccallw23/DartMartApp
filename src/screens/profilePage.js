import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Modal, Pressable, Button, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { updateUser } from '../actions/index';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

function ProfilePage(props){

    const user = useSelector(state => state.user.user);

    const futureFeatureAlertPayment = () => {
        Alert.alert('Coming Soon!', 'Users will be able to update payment info from settings.');
    }

    const futureFeatureAlertPersonalInfo = () => {
        Alert.alert('Coming Soon!', 'Users will be able to show photo and change name on order tickets.');
    }

    return (
        <View backgroundColor='red' style={styles.container}>

                <Text style={styles.featuredText}> {user?.name}</Text>
                {user?.isDriver === false ? <Text style={styles.text2}> Customer </Text> :  
                <Text style={styles.text2}> Driver </Text> }
                <View style={styles.buttonsSection}>
                    <TouchableOpacity style={styles.profileButton} onPress={futureFeatureAlertPersonalInfo}>
                        <AntDesign name="user" size={50} color="whitesmoke" />
                        <Text style={styles.text1}>Personal Info</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileButton} onPress={futureFeatureAlertPayment}>
                        <Ionicons name='card' size={50} color={'whitesmoke'}/>
                        <Text style={styles.text1}>Payment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={props.route.params.logout} style={styles.profileButton}>
                        <MaterialIcons name="logout" size={50} color="whitesmoke" />
                        <Text style={styles.text1}>Logout</Text>
                    </TouchableOpacity>

                    {user?.isDriver === false ? <TouchableOpacity onPress={() => props.updateUser(user.id, {isDriver: true})} style={styles.profileButton}>
                        <MaterialCommunityIcons name="account-switch-outline" size={50} color="whitesmoke" />
                        <Text style={styles.text1}>Driver View</Text>
                    </TouchableOpacity> : null}
                    {user?.isDriver === true ? <TouchableOpacity onPress={() => props.updateUser(user.id, {isDriver: false})} style={styles.profileButton}>
                        <MaterialCommunityIcons name="account-switch-outline" size={50} color="whitesmoke" />
                        <Text style={styles.text1}>Customer View</Text>
                    </TouchableOpacity> : null}
                </View>
        </View>
    );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    text1: {
        color: 'whitesmoke',
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text2: {
        color: 'whitesmoke',
        fontSize: 20,
        fontWeight: 'normal',
      },
    container: {
        margin: 0,
        padding: 0,
        alignItems: 'center',
        width: windowWidth,
        height:windowHeight,
        backgroundColor: '#02604E',
        borderRadius: 30,
        overflow: 'hidden',
    },
    featuredText: {
        marginTop:20,
        color: 'whitesmoke',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonsSection : {
        marginTop:30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileButton : {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'whitesmoke',
        borderWidth: '2',
        padding: 10,
        borderRadius: 20,
        width: 250,
        margin: 10
    }
});

const orderDetail = {
    userName : 'USER',
    role : "Customer",
    estimatedTime : '4:20 PM',
    orderNumber : '69',
}
export default connect(null, { updateUser })(ProfilePage);