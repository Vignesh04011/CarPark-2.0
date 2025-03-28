import React, { useEffect, useState } from "react";
import { View, StyleSheet, PermissionsAndroid, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

const NavigationScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.ACCESS_COARSE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        setHasPermission(true);
        getCurrentLocation();
      } else {
        Alert.alert("Permission Denied", "Location access is required to use this feature.");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location: ", error);
        Alert.alert("Error", "Unable to fetch location. Ensure GPS is enabled.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  if (!hasPermission) {
    return null; // Prevent rendering until permissions are granted
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 18.990713, // Default: San Francisco
          longitude: userLocation ? userLocation.longitude :   73.116844,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location" description="You are here" />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default NavigationScreen;
