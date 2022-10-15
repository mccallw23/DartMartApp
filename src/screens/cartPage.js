import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TextInput   } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { StyleSheet, Text, Image, View, TouchableOpacity, Dimensions, ScrollView, Modal, Pressable, Button, Alert} from 'react-native';
import { CardField, retrievePaymentIntent, useStripe} from '@stripe/stripe-react-native';
import { addItem, submitOrder, removeItem, confirmPayment } from '../actions/index';
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { ROUTE_PAYMENT_SHEET, SERVER_URL_HEROKU } from '../Constants';
import { useClientSocket } from '../components/clientSocket';

function CartPage(props){
    const [joinRoomForPayment] = useClientSocket({
        enabled: true
    })

    const [paymentSubmitted, setPaymentSubmitted] = useState(false);

    const paymentConfirmed = useSelector((state) => state.payment.paymentConfirmed);
    console.log("paymentConfirmed:", paymentConfirmed);
    const user = useSelector(state => state.user.user);
    const cart = useSelector((state) => state.item.cart);

    const [modalVisible, setModalVisible] = useState(false); 
    const [selectedItem, setSelectedItem] = useState(null);
    const [tempQuantity, setTempQuantity] = useState(1);
    const [cartTotal, setCartTotal] = useState(0);
    const [fees, setFees] = useState(0);
    const [sum, setSum] = useState(0);
    const [address, setAddress] = useState(null);
   
    const { initPaymentSheet, presentPaymentSheet} = useStripe();

  const fetchPaymentSheetParams = async () => {
    const response = await axios.post(`${SERVER_URL_HEROKU}${ROUTE_PAYMENT_SHEET}`, {
        amount: cartTotal,
        stripeId: user.stripeId
    });
    const { paymentIntentId, paymentIntent, ephemeralKey, customer } = response.data;
    joinRoomForPayment(paymentIntentId)

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
      console.log("initializePaymentSheet");
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });;
    if (error) {
        console.log('error found:', error)
    }
  };

   const openPaymentSheet = async () => {
       if(cart.length > 0){
           const cartInfo = {
            customerId: user.id,
            orderItems: cart,
            status: "queued",
            orderPaymentAmount: cartTotal
           }
        //    console.log('cartPage.js || openPaymentSheet || cartInfo:', cartInfo);
        //    props.submitOrder({
        //        customerId: user.id,
        //        orderItems: cart,
        //        status: "queued",
        //        orderPaymentAmount: cartTotal
        //    })
       
        const initialize = await initializePaymentSheet();
        const {clientSecret, errorWhatever} = await fetchPaymentIntentClientSecret();
        const { error } = await presentPaymentSheet({ clientSecret, confirmPayment: false });
        

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
                  //Handle successful payment here
                  props.submitOrder({
                    customerId: user.id,
                    orderItems: cart,
                    status: "queued",
                    orderPaymentAmount: cartTotal
                    })

                    setPaymentSubmitted(true);
                }
        } else {
            Alert.alert('Hold on!', 'Your cart is empty!');
        }

  };
 
  useEffect(() => {
    var tempSum = 0;
        cart.forEach(({item, quantity}) => {
            tempSum += quantity * item.cost;
        })
        setSum(Math.round(tempSum * 100) / 100);
        setFees(Math.round((tempSum * .05 + 1.99) * 100) / 100)
        setCartTotal(Math.round((tempSum + fees) * 100))
  }, []);

  useEffect(() => {
    if (paymentConfirmed) {
        Alert.alert('Payment confirmed! Your order has been created!');
        props.navigation.navigate('Delivery')
    }
    
    return () => {
        props.confirmPayment(false);
    }}, [paymentConfirmed]);


    const fetchSuccessCode = async () => 
    {
        const response = axios.post(`${SERVER_URL_HEROKU}/payment-success`, 
        {
            method: "POST",
            headers: 
            {
                "Content-Type" : "application/json",
            },
        });
        // const {success} = await response.json();
        console.log("client secret: ", success);
        return success;
    }

    const fetchPaymentIntentClientSecret = async () => 
    {
        const response = await axios.post(`${SERVER_URL_HEROKU}/create-payment-intent`, 
        {
                amount: cartTotal
        });
        console.log('rseponse', response.data);
        const {clientSecret, error} = response.data;
        console.log("client secret: ", clientSecret);
        return {clientSecret, error};
    }
    


    useEffect(() => {
        setTempQuantity(1);
    }, [modalVisible])

    useEffect(() => {
        var tempSum = 0;
        cart.forEach(({item, quantity}) => {
            tempSum += quantity * item.cost;
        })
        setSum(Math.round(tempSum * 100) / 100);
    }, [cart])

    useEffect(() => {
        setFees(Math.round((sum * .05 + 1.99) * 100) / 100)
    }, [sum])

    useEffect(() => {
        setCartTotal(Math.round((sum + fees) * 100))
    }, [fees])
    // useEffect(() => {
    //     setCartTotal(Math.round((sum + fees) * 100));
    // }, [fees, sum])

    if (paymentSubmitted && !paymentConfirmed) {
        return (
            <>
            <View style={styles.container}>
                <Text
                    style={styles.featuredText}
                >Waiting for Payment confirmation</Text>
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}> 
                <ActivityIndicator size="large" color="green" />
            </View>
            </>
        )
    }
    return (
        <View backgroundColor='#02604E' style={{height: windowHeight * .9}}>
            {/* SCROLL VIEW FOR ITEMS IN CART */}
            <Text style={styles.featuredText}>Shopping Cart</Text>
            <ScrollView contentContainerStyle={styles.itemsContainer}>
                {/* text entry space for a delivery address */}
                <View style={styles.addressContainer}>
                    <Text style={styles.addressText}>Delivery Address:</Text>
                    <TextInput
                        style={styles.addressInput}
                        placeholder='Enter your address'
                        placeholderTextColor='white'
                        onChangeText={text => setAddress(text)}
                        value={address}
                    />
                    <Text>*** address information must be complete, and within 1.5 miles of Dartmouth college ***</Text>
                </View>
                {/* <View style={styles.itemsContainer}> */}
                    {cart.map(({item, quantity}) => {
                        return (
                            <View key={item.name} style={styles.itemContainer}>
                                {/* <View style={styles.imageContainer}>
                                    <
                                </View> */}
                                <View style={styles.imageContainer}>
                                    <Image source={{uri: item.imageURL}} style={styles.image} />
                                </View>
                                <View style={styles.itemInfoContainer}>
                                    <View style={styles.itemNameContainer}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                    </View>


                                    <View style= {styles.costAndQuantity}>
                                        <View style = {styles.itemCostContainer}>
                                            <Text style={styles.itemCost}>${Math.round((item.cost * quantity) * 100) / 100}</Text>
                                        </View>
                                        <View style={styles.quantityContainer}>
                                            <TouchableOpacity style={styles.quantityButton} onPress={()=> {if(quantity > 0) props.addItem(item, -1)}}>
                                                <Text style={styles.quantitySymbol}>-</Text>
                                            </TouchableOpacity>    
                                            <Text style={styles.text1}>{quantity}</Text>
                                            <TouchableOpacity style={styles.quantityButton} onPress={()=>props.addItem(item, 1)}>
                                                <Text style={styles.quantitySymbol}>+</Text>
                                            </TouchableOpacity> 
                                        </View>
                                    </View>
                                </View>
                                <Pressable style={{position: 'absolute', top: 10, right: 10}} onPress={() => {props.removeItem(item)}}>
                                    <Ionicons name="close" size={25}/>
                                </Pressable>
                            </View>
                        )
                    })}
                {/* </View> */}
            </ScrollView>

            <View style={styles.checkoutInfo}>
                <View>
                    <View>
                        <View style={styles.subtotal}>
                            <View style={styles.costLine}>
                                <Text style={styles.text2}>Cart Total</Text>
                                <Text style={styles.text2}>${sum}</Text>
                            </View>
                            <View style={styles.costLine}>
                                <Text style={styles.text2}>Tax and Fees</Text>
                                <Text style={styles.text2}>${fees}</Text>
                            </View>
                            <View style={styles.costLine}>
                                <Text style={styles.text2}>Tips</Text>
                                <Text style={styles.text2}>$0</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.dividerLine}>
                    <Text style={styles.text1} justifyContent='center' ></Text>
                </View>
                <View style={styles.subtotal}>
                    <View style={styles.costLine}>
                        <Text style={styles.text2}>Total</Text>
                        <Text style={styles.text2}>${cartTotal / 100}</Text>
                    </View>
                    {/* <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 15,
        }}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
      /> */}
                </View>
                
                <TouchableOpacity key="uniqueId1" style={styles.checkOutButton} onPress={openPaymentSheet}>
                  <Text style={styles.text1} justifyContent='center'>Check Out</Text>
                </TouchableOpacity>
                 {/* <CardField 
                  postalCodeEnabled={true}
                    cardStyle={styles.card}
                    style={styles.cardContainer}
                    placeholder={'Card Number:' + '4242 4242 4242 4242'}
                    onCardChange={(cardDetails) => {
                        setCardDetails(cardDetails);
                    }}
                  /> */}

                  {/* <TouchableOpacity key="uniqueId1" style={styles.checkOutButton} onPress={openPaymentSheet}>
                  <Text style={styles.text1} justifyContent='center'>Submit Order</Text>
                </TouchableOpacity> */}
                  
            </View>
        </View>
        
    );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    card:
    {
        backgroundColor: '#efefefef',
    },
    addressContainer:
    {
        backgroundColor: '#02604E',
        width: windowWidth * .9,
        height: windowHeight * .1,
        borderRadius: 10,
        margin: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    addressInput:
    {
        backgroundColor: '#02604E',
        width: windowWidth * .8,
        height: windowHeight * .05,
        borderRadius: 10,
        margin: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },

    addressText:
    {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardContainer:
    {
        height: 50,
        marginVertical: 30,

    },

    text1: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text2: {
        color: 'black',
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
    featuredText: {
        color: 'white',
        fontSize: 30,
        paddingBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: windowHeight * .05,
    },
    itemsContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 30,
        paddingBottom: 30,
    },
    image:{
        width: '100%',
        height: '100%',
        borderRadius: 18
    },  
    itemContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        width: windowWidth * .95,
        margin: windowWidth * .025,
        borderRadius: 10,
        height: windowWidth * .35,
        backgroundColor: '#BBDDBB',
        padding: 10,
    },
    imageContainer:{
        borderRadius: 18,
        justifyContent: 'center',
        alignSelf: 'center',
        width: windowWidth * .25,
        height: windowWidth * .25,
        backgroundColor:'white',
    },
    itemInfoContainer:{
        // alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: windowWidth * .7 - 20,
    },
    itemNameContainer:{
        width: '80%',
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    itemName: {
        // width: '80%',
        color: 'black',
        fontSize: 18,
        padding: 10,
        fontWeight: 'bold',
        // alignSelf: 'baseline',
        // overflow: 'hidden'
    },
    costAndQuantity : {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        width: '100%',
        // alignItems:'flex-end',
        justifyContent: 'space-between'
    },
    itemCostContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    itemCost: {
        fontSize: 20,
        alignSelf: 'center',
        color: '#02604E',
        fontWeight: 'bold',
    },
    removeItemText:{
        fontSize: 25, 
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
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20
    },
    quantityButton : {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        margin: 5
        },
    quantitySymbol : {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black'
    },
    checkoutInfo : {
        width: windowWidth,
        borderRadius: 22,
        padding: 20,
        height: windowHeight * .25,
        paddingTop: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        opacity: 0.9,
        paddingRight: 30,
    },
    subtotal :{
        marginBottom: 20,
        paddingLeft: 10,
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
        alignContent: 'center',
        justifyContent: 'center',
        opacity: 12,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 33,
        backgroundColor: '#BBDDBB',
      },
});

export default connect(null, { addItem, removeItem, submitOrder, confirmPayment })(CartPage);
