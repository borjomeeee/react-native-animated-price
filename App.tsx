import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RotatingText from './src/RotatingText';

function generateRandomPrice() {
  const num = (Math.random() * 1000).toFixed(3);
  return `${num} $`
}

export default function App() {
  const [price, setPrice] = React.useState("1000 $");

  React.useEffect(() => {
    const changePriceInterval = setInterval(() => {
      setPrice(generateRandomPrice());
    }, 2000);

    return () => {
      clearInterval(changePriceInterval)
    }
  }, [])

  return (
    <View style={styles.container}>
      <RotatingText text={price} fontSize={27} lineHeight={27} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
