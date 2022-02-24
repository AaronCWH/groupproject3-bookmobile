import React, { useState, useEffect } from 'react';
import { ScrollView, Image, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { List, Text, Searchbar, Provider as PaperP } from "react-native-paper";
import { userA, indexBooks, swap } from '../../components/test-data';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';


function BookSearch() {

    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = React.useState('');
    const [data, setData] = React.useState(indexBooks);
    const [filteredData, setFilteredData] = React.useState([]);

    const bookindex = indexBooks.reduce(function (p, c) {
        p[c.indexId] = c;
        return p;
    }, {});
    // console.log("BOOKS: ", bookindex)

    const mergedSwapandIndexBooks = swap.map(function (c) {
        const d = bookindex[c.indexId];
        return {
            indexId: c.indexId,
            title: d.title,
            author: d.author,
            imageURL: d.imageURL
        };
    });
    // console.log("MERGED: ", mergedSwapandIndexBooks)

    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = () => console.log("book_search blur");
            console.log('book_search focus');
            return unsubscribe;
        }, [navigation])
    );

    useEffect(() => {
        navigation.setOptions({
            headerShadowVisible: true,
            headerSearchBarOptions: {
                placeholder: "Search books by Title",
                onChangeText: (event) => {
                    searchFilter(event.nativeEvent.text);
                }
            },
        });
    }, [navigation]);

    // if book not found?
    const searchFilter = (text) => {
        if (text) {
            const newData = indexBooks.filter(item => {
                const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilteredData(newData);
            console.log(newData);
            setSearch(text);
        } else {
            setData(indexBooks);
            setSearch(text);
        }
    }

    return (
        <ScrollView >
            {search ? (filteredData.map((element, index) => {
                return (
                    <View key={index}>
                        <PaperP>
                            <List.Item
                                left={props => (
                                    <Image {...props}
                                        style={{ width: 66, height: 95 }}
                                        source={element.imageURL}
                                    />
                                )}
                                title={element.title}
                                description={element.author}
                                onPress={() => navigation.navigate("Book Details", { screen: "Book Details" })}
                            />
                        </PaperP>
                    </View>
                )
            })
            ) :
                (data.slice(0, 7).map((element, index) => {
                    return (
                        <View key={index}>
                            <PaperP>
                                <List.Item
                                    left={props => (
                                        <Image {...props}
                                            style={{ width: 66, height: 95 }}
                                            source={element.imageURL}
                                        />
                                    )}
                                    title={element.title}
                                    description={element.author}
                                    onPress={() => navigation.navigate("Book Details", { screen: "Book Details" })}
                                />
                            </PaperP>
                        </View>
                    )
                })
                )}
        </ScrollView>
    )

};

export default BookSearch;

