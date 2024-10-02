import React from 'react';
import {Image, Text, View, StyleSheet, Button} from 'react-native';
import Header from '../Header/Header';
const Home = () => {
  const aboutUsImage = require('../../assets/homeAboutUsImage.jpg');
  return (
    <View style={{flex: 1, backgroundColor: 'rgb(226	244	254	)'}}>
      <Header />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 15,
        }}>
        <Text>WELCOME TO MAVERICK HEALTH</Text>
      </View>
      <View>
        <View style={{marginTop: 20, padding: 10}}>
          <Text>About Us</Text>
          <Image
            source={aboutUsImage}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={{marginTop: 20, padding: 10}}>
          <Text>Who are we?</Text>
          <Image
            source={aboutUsImage}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={{margin: 10}}>
          <Button title="Take Questionnaire" />
        </View>
        <View style={{margin: 10}}>
          <Button title="Maverick Website" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '95%',
    height: 230,
    marginBottom: 20,
  },
});

export default Home;
