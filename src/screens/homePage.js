import React, { useEffect, useState, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
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
import { Ionicons } from '@expo/vector-icons';
import { readRemoteFile } from 'react-native-csv';
import { addItem, fetchItems, setCategory } from '../actions/index';
import CategorySelect from '../components/homeComponents/categorySelect';
import ProductCard from '../components/homeComponents/ProductCard';

function HomePage({
  fetchItems, addItem, setCategory, navigation,
}) {
  const ref = useRef(null);

  const allItems = useSelector((state) => state.item.allItems);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [TJData, setTJData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const categoryDict = {};

  useEffect(() => {
    setTempQuantity(1);
  }, [modalVisible]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (count < 2) {
      const request = new XMLHttpRequest();
      request.open(
        'GET',
        'https://raw.githubusercontent.com/mccallw23/DartMartApp/master/src/assets/csv/TJproducts2.csv',
        true,
      );
      request.onload = function () {
        const data = new Uint8Array(this.response);
        readRemoteFile(
          'https://raw.githubusercontent.com/mccallw23/DartMartApp/master/src/assets/csv/TJproducts2.csv',
          {
            worker: true,
            complete: (results) => {
              setTJData(results.data);
              const tempCats = [];
              // populate categoryDict with tj category names as keys and number of items as values
              TJData.forEach((item) => {
                if (item[1] != 'Category' && item[2] != 'Wine, Beer & Liquor') {
                  if (item[2] in categoryDict) {
                    categoryDict[item[2]] += 1;
                  } else {
                    categoryDict[item[2]] = 1;
                  }
                }
              });
              allItems.forEach((item) => {
                if (!tempCats.includes(item.category)) {
                  tempCats.push(item.category);
                }
              });
              Object.keys(categoryDict)
                .sort((a, b) => categoryDict[b] - categoryDict[a])
                .map((category) => {
                  tempCats.push(`Trader Joe's ${category}`);
                });
              setCategories(tempCats);
              console.log(count);
              console.log('categories:', categories);
              setCount(count + 1);
              setLoading(false);
            },
          },
        );
      };
      request.send();
    }
  }, [categoryDict]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading Store...</Text>
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: '#02604E' }}>
      <ScrollView
        ref={ref}
        contentContainerStyle={styles.container}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Dartmart"
            style={{
              backgroundColor: 'white',
              width: windowWidth * 0.8,
              height: 40,
              borderRadius: 20,
              fontSize: 15,
              paddingLeft: 10,
              marginTop: 10,
            }}
            onSubmitEditing={(event) => {
              setSearch(event.nativeEvent.text);
              ref.current.scrollToEnd({ animated: false });
            }}
          />
        </View>
        <View style={styles.categoryHeaderContainer}>
          <Text style={styles.categoryHeaderText}>Categories</Text>
        </View>
        <CategorySelect
          categories={categories}
          setCategory={setCategory}
          navigation={navigation}
        />
        {
          // if search is empty, show all items
          search === ''
            ? categories.map((category) => {
              return (
                <View key={`${category}b`} style={styles.categoryContainer}>
                  <View style={{ padding: 10 }}>
                    <Text style={styles.subheader}>
                      {category?.toUpperCase()}
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.categoryItemScroll}
                  >
                    {allItems
                      .filter(
                        (item) => item.category === category,
                        // && search === "" || search.length > 0 &&
                        // item.name.toUpperCase().includes(search.toUpperCase())
                      )
                      .map((item) => (
                        <ProductCard
                          key={category + item.name}
                          item={item}
                          category={category}
                          setSelectedItem={setSelectedItem}
                          setModalVisible={setModalVisible}
                          modalVisible={modalVisible}
                        />
                      ))}
                    {TJData.filter(
                      (item) => `Trader Joe's ${item[2]}` === category,
                      // &&
                      // search === "" || search.length > 0 &&
                      // item[1].toUpperCase().includes(search.toUpperCase())
                    ).map((item) => {
                      return (
                        <TouchableHighlight
                          key={category + item[0] + item[3]}
                          underlayColor="transparent"
                          onPress={() => {
                            setSelectedItem({
                              name: item[0],
                              category,
                              cost: item[3].slice(1),
                              imageURL: item[6],
                            });
                            setModalVisible(!modalVisible);
                          }}
                        >
                          <View style={styles.itemContainer}>
                            <Text style={styles.itemName}>{item[0]}</Text>
                            <Image
                              source={{
                                uri: item[6],
                              }}
                              style={styles.image}
                            />
                            <Text style={styles.itemCost}>{item[3]}</Text>
                          </View>
                        </TouchableHighlight>
                      );
                    })}
                  </ScrollView>
                </View>
              );
            })
            : (
          // create one scrollview to hold all search results
              <View style={styles.categoryContainer}>
                <View style={{ padding: 10 }}>
                  <Text style={styles.subheader}>SEARCH RESULTS</Text>
                </View>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.categoryItemScroll}
                >
                  {allItems
                    .filter(
                      (item) => search.length > 0
                            && item.name
                              .toUpperCase()
                              .includes(search.toUpperCase()),
                    )
                    .map((item) => (
                      <ProductCard
                        key={item.name}
                        item={item}
                        category={item.category}
                        setSelectedItem={setSelectedItem}
                        setModalVisible={setModalVisible}
                        modalVisible={modalVisible}
                      />
                    ))}
                  {TJData.filter(
                    (item) => search.length > 0
                          && item[0].toUpperCase().includes(search.toUpperCase()),
                  ).map((item) => {
                    return (
                      <TouchableHighlight
                        key={item[0] + item[3]}
                        underlayColor="transparent"
                        onPress={() => {
                          setSelectedItem({
                            name: item[0],
                            category: `Trader Joe's ${item[2]}`,
                            cost: item[3].slice(1),
                            imageURL: item[6],
                          });
                          setModalVisible(!modalVisible);
                        }}
                      >
                        <View style={styles.itemContainer}>
                          <Text style={styles.itemName}>{item[0]}</Text>
                          <Image
                            source={{
                              uri: item[6],
                            }}
                            style={styles.image}
                          />
                          <Text style={styles.itemCost}>{item[3]}</Text>
                        </View>
                      </TouchableHighlight>
                    );
                  })}
                </ScrollView>
              </View>
            )
        }

        <Text style={styles.subheader}>All Convenience Items</Text>
        <View style={styles.itemsContainer}>
          {allItems
            .filter((item) => item.name.toUpperCase().includes(search.toUpperCase()))
            .map((item) => {
              return (
                <ProductCard
                  key={`${item.name + item.category}C`}
                  item={item}
                  category={item.category}
                  setSelectedItem={setSelectedItem}
                  setModalVisible={setModalVisible}
                  modalVisible={modalVisible}
                />
              );
            })}
        </View>
      </ScrollView>
      <View
        style={{
          width: windowWidth,
          height: windowHeight,
          backgroundColor: modalVisible ? 'rgba(0,0,0,.5)' : 'transparent',
        }}
      >
        <Modal
          animationType="slide"
          visible={modalVisible}
          transparent
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.itemModal}>
            <Text style={styles.itemModalName}>{selectedItem?.name}</Text>
            <Image
              style={styles.modalImage}
              source={{ uri: selectedItem?.imageURL }}
            />
            <Text style={styles.itemModalCost}>{selectedItem?.cost}</Text>
            <Pressable
              style={{ position: 'absolute', top: 20, right: 20 }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Ionicons name="close" size={25} />
            </Pressable>
            <View style={styles.controlContainer}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    if (tempQuantity > 0) setTempQuantity(tempQuantity - 1);
                  }}
                >
                  <Text style={styles.quantitySymbol}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{tempQuantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setTempQuantity(tempQuantity + 1)}
                >
                  <Text style={styles.quantitySymbol}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cartButtons}>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <View style={styles.submitButton}>
                  <Ionicons
                    name="close-circle"
                    size={60}
                    color="red"
                  />
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  addItem(selectedItem, tempQuantity);
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.discardButton}>
                  <Ionicons
                    name="checkmark-circle"
                    size={60}
                    color="green"
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>

  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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

export default connect(null, { addItem, fetchItems, setCategory })(HomePage);
