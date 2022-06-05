import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { StyleSheet, Image, Text, View, TouchableOpacity, Dimensions, ScrollView, Modal, Pressable, Button, TouchableHighlight} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchInProgressOrders } from '../services/datastore';
import { fetchOrders, updateOrder } from '../actions/index';
import { Ionicons } from "@expo/vector-icons";


function DriverView(props) {
    const allOrders = useSelector((state) => state.order.all)
    const user = useSelector((state) => state.user.user)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(false);
    useEffect(() => {
        props.fetchOrders();
        console.log(allOrders);
    }, []);

    return (
        <View backgroundColor='#02604E' style={{height: windowHeight * .9}}>
            <Text style={styles.featuredText}>My Ongoing Orders</Text>
            <ScrollView contentContainerStyle={styles.allOrdersContainer}>
                <View style={styles.itemsContainer}>
                    {allOrders?.filter((order) => order?.hasOwnProperty('delivererId') && order.status === "in-progress").map(order => {
                        return (
                            <View key={order.id} style={styles.order}>
                                <Text>{order.id}</Text>
                                <Text>Deliver to: {order.deliveryAddress}</Text>
                            </View>)
                    })}
                </View>
            </ScrollView>
            <Text style={styles.featuredText}>Order Queue</Text>
            <ScrollView contentContainerStyle={styles.allOrdersContainer}>
                <View style={styles.itemsContainer}>
                    {allOrders?.filter((order) => order?.status === "queued").map(order => {
                        return (
                            <TouchableHighlight key={order.id} style={styles.order} onPress={() => {setSelectedOrder(order); setModalVisible(!modalVisible)}}>
                                <View>
                                    <Text>{order.id}</Text>
                                    <Text>{order.orderPaymentAmount}</Text>
                                </View>
                            </TouchableHighlight>)
                    })}
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.itemModal}  >
                        <Text style={styles.itemModalCost}>{selectedOrder?.id}</Text>
                        <Pressable style={{position: 'absolute', top: 20, right: 20}} onPress={() => setModalVisible(!modalVisible)}>
                            <Ionicons name="close" size={25}/>
                        </Pressable>
                        <View style={styles.cartButtons}>
                            <Pressable onPress={() => setModalVisible(!modalVisible)}>
                                <View style={styles.submitButton}>
                                    <Ionicons name="close-circle" size={60} color={'red'}></Ionicons>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => {props.updateOrder(selectedOrder.id, {status: "in-progress", delivererId: user.id}); setModalVisible(!modalVisible)}}>
                                <View style={styles.discardButton}>
                                    <Ionicons name="checkmark-circle" size={60} color={'green'}></Ionicons>
                                </View>
                            </Pressable>
                        </View>
                        
                    </View>
                </Modal>
            
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    text1: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text2: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'normal',
      },
    container: {
        margin: 0,
        padding: 0,
        alignItems: 'center',
        width: windowWidth,
        backgroundColor: '#02604E',
        borderRadius: 30,
    },
    featured:{
        width: "90%",
        height: windowHeight * .3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginTop: 20
    },
    featuredText: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: windowHeight * .025,
    },
    itemsContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 30
    },
    allOrdersContainer:{
        alignItems: 'center',
        height: 'auto',
    },
    image:{
        width: '100%',
        height: '100%',
        borderRadius: 18
    },  
    itemContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        width: windowWidth,
        margin: windowWidth * .025,
        borderRadius: 8,
        height: windowWidth * .35,
        backgroundColor: 'green',
        padding: 10,
    },
    imageContainer:{
        borderWidth:2,
        borderRadius: 18,
        justifyContent: 'center',
        width: windowWidth * 0.3,
        backgroundColor:'white',
    },
    itemInfoContainer:{
        justifyContent: 'space-between',
        width: windowWidth*.62,
        padding:5,
    },
    itemName: {
        color: 'white',
        fontSize: 24,
        height: 30,
        fontWeight: 'bold',
        alignSelf: 'baseline',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    costAndQuantity : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',

    },
    itemCostContainer: {
        borderWidth: 1, 
        borderColor: 'white', 
        borderRadius: 22,
        paddingVertical: 5,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0
    },
    itemCost: {
        fontSize: 15,
        position: 'absolute',
        bottom: 13,
        left: 13
    },
    itemModal:{
        height: 350,
        width: windowWidth * .8,
        marginHorizontal: windowWidth * .1,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 30,
        alignItems:'center',
        marginBottom: windowHeight * .25,
        marginTop: windowHeight * .25,
    },
    quantityContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    quantityButton : {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        // borderColor: 'white',
        // borderWidth: 3,
        backgroundColor: 'white',
        margin: 5
        },
    quantitySymbol : {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black'
    },
    checkoutInfo : {
        position: 'absolute',
        bottom: 0,
        width: windowWidth,
        height: 300,
        backgroundColor: 'black',
        flexDirection: 'row',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        flexWrap: 'wrap',
        justifyContent: 'center',
        // marginBottom: windowWidth * .22,
        opacity: 0.9,
        padding: 20,
    },
    subtotal :{
        marginBottom: 20,
        padding: 10,
        width: windowWidth* 0.95,
    },  
    dividerLine : {
        backgroundColor: 'grey',
        width: windowWidth* 0.9,
        height: 3,
        borderRadius: 10,
        opacity: 0.5
    },
    costLine : {
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    checkOutButton: {
        width: windowWidth*.9,
        marginTop: 10,
        alignContent: 'center',
        justifyContent: 'center',
        opacity: 12,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 33,
        backgroundColor: '#01D177',
      },
      order: {
        flexDirection:'row',
        justifyContent: 'space-between',
        width: "95%",
        margin: windowWidth * .025,
        borderRadius: 8,
        height: windowWidth * .2,
        backgroundColor: '#FFF',
        padding: 10,
      },
      itemModal:{
        // height: 350,
        // width: windowWidth * .8,
        height: 'auto',
        width: 'auto',
        marginHorizontal: windowWidth * .05,
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems:'center',
        justifyContent: 'space-evenly',
        // marginBottom: windowHeight * .25,
        marginTop: windowHeight * .15,
        // flex: 1,
        flexDirection: 'column',
        backgroundColor: 'whitesmoke',
        borderColor: 'darkgray',
        borderWidth: 1.5,
    },
    modalImage:{
        width: "70%",
        height: "45%",
    },
    itemModalName:{
        marginTop: 40,
        marginBottom: 15,
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemModalCost:{
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'white',
        position: 'relative', 
        top: -25, 
        right: -90,
        padding: 7,
        paddingLeft: 12,
        paddingRight: 12,
        borderStyle: 'solid',
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 20,
        overflow: 'hidden'
    },
    controlContainer:{
        alignItems: 'center',
        margin: 2,
        marginTop: 2,
    },
    quantityContainer: {
        height: 60,
        width: 150,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'darkgray',
        
    },
    quantityButton : {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        // borderColor: 'white',
        // borderWidth: 3,
        backgroundColor: 'white',
        margin: 5
        },
    quantitySymbol : {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black'
    },
    quantityText : {
        fontSize: 20,
    },
    cartButtons : {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 250,
        paddingBottom: 10,
        paddingTop: 10,
    },
    submitButton:{
        width: 60,
        height: 60,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    discardButton:{
        width: 60,
        height: 60,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default connect(null, { fetchOrders, updateOrder})(DriverView);