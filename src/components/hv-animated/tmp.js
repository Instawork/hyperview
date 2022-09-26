// @flow

import { Animated, AppRegistry, View } from 'react-native';
import React, { useEffect, useRef } from 'react';

const titleStyle = { fontSize: 28, lineHeight: 40, marginHorizontal: 24 };
const stepStyle = { fontSize: 16, lineHeight: 24, marginHorizontal: 24 };

const App = () => {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const step1 = useRef(new Animated.Value(-100)).current;
  const step2 = useRef(new Animated.Value(-100)).current;
  // <animated>
  //   <value id="titleOpacity" from="0" property="opacity" />
  //   <value id="step1" from="-100" property="left" />
  //   <value id="step2" from="-100" property="left" />
  //   <animation type="sequence" id="intro">
  //     <animation value="titleOpacity" to="1" duration="1000" />
  //     <animation type="delay" duration="100" />
  //     <animation type="parallel">
  //       <animation value="step1" to="0" duration="1200" />
  //       <animation value="step2" to="0" duration="1200" delay="100" />
  //     </animation>
  //   </animation>
  // </animated>
  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleOpacity, {
        duration: 1000,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(step1, {
          duration: 1200,
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.timing(step2, {
          delay: 100,
          duration: 1200,
          toValue: 0,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [titleOpacity, step1, step2]);
  return (
    <View>
      <Animated.Text style={{ ...titleStyle, opacity: titleOpacity }}>
        Title
      </Animated.Text>
      <Animated.Text style={{ ...stepStyle, left: step1 }}>
        Step 1
      </Animated.Text>
      <Animated.Text style={{ ...stepStyle, left: step2 }}>
        Step 2
      </Animated.Text>
    </View>
  );
};

AppRegistry.registerComponent('app', () => App);
