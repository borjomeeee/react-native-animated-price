import React from "react";
import * as RN from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ROTATE_SPEED = 200;
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const Block = RN.View;

const RotationLetter = React.memo(({ letter, textStyle, textHeight }) => {
  const animatedIndex = useSharedValue(0);

  React.useEffect(() => {
    animatedIndex.value = withTiming(NUMBERS.indexOf(letter), {
      duration: ROTATE_SPEED,
      easing: Easing.bezier(0.11, 0.69, 0.67, 0.89),
    });
  }, [letter]);

  const animatedMargin = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -((animatedIndex.value + 1) * textHeight),
        },
      ],
    };
  });

  const renderLetter = React.useCallback(
    (num, index) => {
      return (
        <RN.View
          key={index.toString()}
          style={[styles.abs, { marginTop: index * textHeight }]}
        >
          <RN.Text style={textStyle}>{num}</RN.Text>
        </RN.View>
      );
    },
    [textStyle, textHeight]
  );

  if (!/\d{1}/g.test(letter))
    return <RN.Text style={textStyle}>{letter}</RN.Text>;

  return (
    <Block style={styles.ofh}>
      <RN.Text style={[textStyle, styles.hidedLetter]}>{letter}</RN.Text>
      <Animated.View style={animatedMargin}>
        {NUMBERS.map(renderLetter)}
      </Animated.View>
    </Block>
  );
});

const RotatingText = ({ text, fontSize, lineHeight }) => {
  const [textSize] = React.useState(fontSize);
  const [textHeight] = React.useState(lineHeight ?? fontSize + 5);

  const [showedLetters, setShowedLetters] = React.useState([]);

  // On text was changed
  React.useEffect(() => {
    const textReversed = Array.from(text).reverse();
    setShowedLetters(textReversed);
  }, [text]);

  const textStyle = React.useMemo(
    () => [styles.text, { fontSize: textSize, lineHeight }],
    [textSize, lineHeight]
  );

  const renderRotatitonLetter = React.useCallback(
    ({ item }) => {
      return (
        <RotationLetter
          letter={item}
          textStyle={textStyle}
          textHeight={textHeight}
        />
      );
    },
    [textStyle, textHeight]
  );

  return (
    <RN.FlatList
      data={showedLetters}
      keyExtractor={keyExtractor}
      renderItem={renderRotatitonLetter}
      contentContainerStyle={styles.container}
    />
  );
};

function keyExtractor(_, index) {
  return index.toString();
}

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",

    paddingTop: 200,
  },
  text: {
    fontWeight: "bold",
    fontSize: 35,
  },

  scrollLetterContainer: {},
  abs: {
    position: "absolute",
  },
  ofh: {
    overflow: "hidden",
  },
  hidedLetter: {
    opacity: 0,
    zIndex: -10,
  },
});

export default RotatingText;
