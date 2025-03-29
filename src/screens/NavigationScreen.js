import React, { useState, useEffect } from 'react';
import { View, StyleSheet, PermissionsAndroid, Image, Modal, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const parkingSpots = [
    { id: 1, name: "Orion Mall", latitude: 18.9934303, longitude:  73.1157848, price: "₹10000", rating: 3, spaces: 3000, image: require('../assets/images/orion-mall.png') },
    { id: 2, name: "Seawoods Grand Central Mall", latitude: 19.02188, longitude: 73.017832, price: "₹12000", rating: 4, spaces: 2500, image: require('../assets/images/seawoods-mall.png') },
    { id: 3, name: "Inorbit Mall Vashi", latitude: 19.0659018, longitude: 73.0010695, price: "₹8000", rating: 5, spaces: 2000, image: require('../assets/images/Inorbit_Mall.jpg') },
];

const MapScreen = () => {
    const [region, setRegion] = useState({
        latitude: 18.9925,
        longitude: 73.1189,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const [selectedSpot, setSelectedSpot] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "This app requires access to your location.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getLocation();
                } else {
                    console.log("Location permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        };

        requestLocationPermission();
    }, []);

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    const handleMarkerPress = (spot) => {
        setSelectedSpot(spot);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                followsUserLocation={true}
                mapPadding={{ top: 70, right: 0, bottom: 100, left: 0 }}
            >
                {parkingSpots.map(spot => (
                    <Marker
                        key={spot.id}
                        coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                        title={spot.name}
                        onPress={() => handleMarkerPress(spot)}
                    >
                        <Image source={require('../assets/icons/available.png')} style={styles.markerIcon} />
                    </Marker>
                ))}
            </MapView>

            {/* Full-Screen Parking Spot Popup */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.fullScreenContainer}>
                    {selectedSpot && (
                        <>
                            <Image source={selectedSpot.image} style={styles.fullScreenImage} />
                            <View style={styles.infoOverlay}>
                                <Text style={styles.name}>{selectedSpot.name}</Text>
                                <Text style={styles.details}>Price: {selectedSpot.price}</Text>
                                <Text style={styles.details}>Rating: ⭐ {selectedSpot.rating}</Text>
                                <Text style={styles.details}>Total Spaces: {selectedSpot.spaces}</Text>

                                {/* Buttons */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.bookButton}>
                                        <Text style={styles.bookButtonText}>Book Slot</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.wishlistButton}>
                                        <Text style={styles.wishlistText}>❤️</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Close Button */}
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeText}>✖</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    markerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
    infoOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 45,
        padding: 20,
    },
    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 5,
    },
    details: {
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    bookButton: {
        flex: 1,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
    },
    bookButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    wishlistButton: {
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
    wishlistText: {
        fontSize: 18,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 8,
        borderRadius: 20,
    },
    closeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default MapScreen;
