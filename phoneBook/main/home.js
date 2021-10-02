import React, { useEffect, useState } from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { DataTable, Searchbar, List, Text, Button, TextInput } from 'react-native-paper';
import { Modal, Portal, Provider, FAB } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';


const numberOfItemsPerPageList = [3, 5, 10];

const url = "http://localhost:5000"


const Home = () => {
    const [tableData, setTableData] = useState([]);
    const [state, setState] = useState([])
    const [mainData, setMainData] = useState([]);
    const [text, setText] = React.useState('');
    const [selected, setSelected] = React.useState();
    const [modalTitle, setModalTitle] = React.useState('');
    const [modalBody, setModalBody] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newModalVisible, setNewModalVisible] = useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [userDetail, setUserDetail] = useState({});

    // 
    function fetchData() {
        fetch(url + '/user/all',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((responseData) => {
                // console.log("responseData", responseData);
                setState(responseData.sort(function(a, b){
                    if(a.nickname < b.nickname) { return -1; }
                    if(a.nickname > b.nickname) { return 1; }
                    if(a.nickname == b.nickname) { return 0; }
                    return 0;
                }));
                setMainData(responseData)
                return responseData;
            }).catch(err => console.log(err))
    }
    useEffect(() => {
        fetchData();
    }, []);

    const [page, setPage] = React.useState(0);
    const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
    const from = page * numberOfItemsPerPage;
    const to = Math.min((page + 1) * numberOfItemsPerPage, state.length);

    React.useEffect(() => {
        setPage(0);
    }, [numberOfItemsPerPage]);

    const onChangeText = text => {
        if (text == "") {
            setState(mainData);
        } else {
            var data = state.filter(item => {
                return item["nickname"].includes(text)
            });
            setState(data);
        }
        setText(text);
    }

    function updateDetail() {
        if (selected) {
            fetch(url + '/user/' + selected, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(userDetail)
            })
                .then((response) => response.json())
                .then((responseData) => {
                    setNewModalVisible(false);
                    fetchData();
                });
        }
        else {
            fetch(url + '/user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetail)
            })
                .then((response) => response.json())
                .then((responseData) => {
                    setNewModalVisible(false);
                    fetchData();
                });
        };
    }

    function deleteUser(){
        fetch(url + '/user/'+selected, {
            method: 'delete',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetail)
        })
            .then((response) => response.json())
            .then((responseData) => {
                fetchData();
                setModalVisible(false);
            });
    }

    return (
        <View style={{ height: "100%" }}>

            <Searchbar
                placeholder="Search"
                onChangeText={onChangeText}
                value={text}
            />
            <DataTable style={{
                borderColor: '#000000',
                borderWidth: 1,
            }}>
                {
                    state
                        .slice(from, to)
                        .map((item, i) => {
                            return (
                                <DataTable.Row key={i}>
                                    <DataTable.Cell style={styles.innerText} onPress={() => {setUserDetail(item);setSelected(item.id);setModalVisible(true); }}>
                                        {item.nickname}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            );
                        })}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(state.length / numberOfItemsPerPage)}
                    onPageChange={page => setPage(page)}
                    label={`${from + 1}-${to} of ${state.length}`}
                    showFastPaginationControls
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={numberOfItemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>

            <Modal
                visible={newModalVisible}
                onDismiss={() => {
                    setNewModalVisible(!newModalVisible);
                }}
                contentContainerStyle={styles.containerStyle}
            >
                <View style={{ backgroundColor: "white" }}>
                    <TextInput
                        label="First Name"
                        value={userDetail.first_name}
                        onChangeText={text => setUserDetail({ ...userDetail, first_name: text })}
                    />
                    <TextInput
                        label="Last Name"
                        value={userDetail.last_name}
                        onChangeText={text => setUserDetail({ ...userDetail, last_name: text })}
                    />
                    <TextInput
                        label="NickName"
                        value={userDetail.nickname}
                        onChangeText={text => setUserDetail({ ...userDetail, nickname: text })}
                    />
                    <TextInput
                        label="Phone Number"
                        value={userDetail.phone_no}
                        onChangeText={text => setUserDetail({ ...userDetail, phone_no: text })}
                    />
                    <TextInput
                        label="Email"
                        value={userDetail.email}
                        onChangeText={text => setUserDetail({ ...userDetail, email: text })}
                    />
                    <SafeAreaView style={{ flexDirection: 'row', marginTop: "8%" }}>
                        <Button mode="contained" style={{ width: "fit-content", right: 0 }} onPress={() => { updateDetail() }}>
                            OK
                        </Button>
                    </SafeAreaView>
                </View>
            </Modal >

            <Provider>
                <Portal>
                    <Modal
                        visible={modalVisible}
                        onDismiss={() => {
                            setModalVisible(!modalVisible);
                        }}
                        contentContainerStyle={styles.containerStyle}
                    >
                        <View>
                            <List.Item
                                titleStyle={{ color: "black" }}
                                title="First Name"
                                descriptionStyle={{ color: "grey" }}
                                description={userDetail.first_name}
                            />
                            <List.Item
                                titleStyle={{ color: "black" }}
                                title="Last Name"
                                descriptionStyle={{ color: "grey" }}
                                description={userDetail.last_name}
                            />
                            <List.Item
                                titleStyle={{ color: "black" }}
                                title="Phone Number"
                                descriptionStyle={{ color: "grey" }}
                                description={userDetail.phone_no}
                            />
                            <List.Item
                                titleStyle={{ color: "black" }}
                                title="Email"
                                descriptionStyle={{ color: "grey" }}
                                description={userDetail.email}
                            />
                            <SafeAreaView style={{ flexDirection: 'row' }}>
                                <Button mode="contained" style={{ width: "fit-content", marginRight: "5%" }} onPress={() => {setModalVisible(false);setNewModalVisible(true);}}>
                                    Update
                                </Button>
                                <Button mode="contained" style={{ width: "fit-content" }} onPress={() =>{deleteUser()}}>
                                    Delete
                                </Button>
                            </SafeAreaView>
                        </View>
                    </Modal >
                </Portal>
            </Provider>

            <FAB
                style={styles.fab}
                small
                icon={"plus"}
                color={"rgb(255, 255, 225)"}
                onPress={() => {
                    setUserDetail({
                        first_name: "",
                        last_name: "",
                        phone_no: "",
                        email: "",
                        nickname: ""
                    });
                    setSelected(null);
                    setNewModalVisible(true);
                }}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    baseText: {
        fontWeight: 'bold'
    },
    innerText: {
        color: 'black',
        width: "auto"
    },
    input: {
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "auto"
    },
    picker: {
        height: 40,
        margin: 12,
        borderColor: "transparent",
        // borderWidth: 1,
        padding: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        marginLeft: "100%",
        marginBottom: "10px",
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "rgb(165,42,42)"
    },
    containerStyle: { backgroundColor: 'white', padding: 20 }
});

export default Home