import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function ProductCard({
  item,
  category,
  setSelectedItem,
  setModalVisible,
  modalVisible,
}) {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Image
          source={item.imageURL ? { uri: item.imageURL } : null}
          style={styles.image}
        />
        <Text style={styles.itemCost}>{item.cost}</Text>
      </View>
    </TouchableHighlight>
  );
}

export default ProductCard;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: 'white',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: 'white',
  },
  container: {
    margin: 0,
    padding: 0,
    alignItems: 'center',
    width: windowWidth,
    backgroundColor: '#02604E',
  },
  categoryHeaderContainer: {
    height: windowHeight * 0.05,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#02604E',
  },
  categoryHeaderText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  searchContainer: {
    width: windowWidth,
    height: 60,
    backgroundColor: '#02604E',
    alignItems: 'center',
  },
  categoryScroll: {
    width: windowWidth,
    backgroundColor: '#02604E',
  },
  categoryTagContainer: {
    width: windowWidth * 0.35,
    margin: windowWidth * 0.025,
    marginHorizontal: 5,
    height: windowWidth * 0.1,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    height: windowWidth * 0.65,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  categoryItemScroll: {
    alignItems: 'center',
    minWidth: windowWidth,
    backgroundColor: '#f0f0f0',
    height: windowWidth * 0.5,
    borderTopColor: 'lightgray',
    borderTopWidth: 2,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 2,
  },
  subheader: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  itemsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: windowHeight * 0.15,
    marginTop: 10,
    // minHeight: windowHeight * .7
  },
  image: {
    height: '40%',
    width: '40%',
    marginTop: 10,
    // borderRadius: 30,
  },
  itemContainer: {
    width: windowWidth * 0.35,
    margin: windowWidth * 0.025,
    height: windowWidth * 0.45,
    borderRadius: 30,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderColor: '#BBDDBB',
    borderWidth: 1,
  },
  itemName: {
    fontSize: 15,
    width: '85%',
    paddingTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemCost: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#02604E',
    margin: 2,
  },
  itemModal: {
    // height: 350,
    // width: windowWidth * .8,
    height: 'auto',
    width: 'auto',
    marginHorizontal: windowWidth * 0.05,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // marginBottom: windowHeight * .25,
    marginTop: windowHeight * 0.15,
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: 'whitesmoke',
    borderColor: 'darkgray',
    borderWidth: 1.5,
  },
  modalImage: {
    width: '70%',
    height: '45%',
  },
  itemModalName: {
    marginTop: 40,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemModalCost: {
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
    overflow: 'hidden',
  },
  controlContainer: {
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
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    // borderColor: 'white',
    // borderWidth: 3,
    backgroundColor: 'white',
    margin: 5,
  },
  quantitySymbol: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  quantityText: {
    fontSize: 20,
  },
  cartButtons: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    paddingBottom: 10,
    paddingTop: 10,
  },
  submitButton: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discardButton: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
  },
});
