import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

// Ảnh 0 là trạng thái ban đầu (số 8), ảnh 1-5 là các câu trả lời
const ballImages = [
  require('./assets/ball/ball0.png'),
  require('./assets/ball/ball1.png'),
  require('./assets/ball/ball2.png'),
  require('./assets/ball/ball3.png'),
  require('./assets/ball/ball4.png'),
  require('./assets/ball/ball5.png'),
];

// Văn bản tiếng Việt tương ứng với từng ảnh (chỉ số trùng với ballImages)
const answers = [
  'Hãy đặt câu hỏi trong đầu rồi lắc!',
  'Có!',
  'Không.',
  'Có thể.',
  'Hỏi lại sau nhé.',
  'Rất có khả năng.',
];

const SHAKE_THRESHOLD = 1.8;

const haptic = (fn) => {
  try {
    fn();
  } catch (e) {}
};

export default function App() {
  // Tương đương StatefulWidget + setState trong Flutter
  const [ballIndex, setBallIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [shakeEnabled, setShakeEnabled] = useState(true);

  const shakeX = useRef(new Animated.Value(0)).current;
  const isShaking = useRef(false);

  const askBall = useCallback(() => {
    if (isShaking.current) return;
    isShaking.current = true;

    haptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
    setBallIndex(0); // quay về mặt số 8 trong lúc lắc

    // Hiệu ứng lắc ngang quả cầu
    Animated.sequence([
      ...[-18, 18, -14, 14, -8, 8, 0].map((v) =>
        Animated.timing(shakeX, {
          toValue: v,
          duration: 80,
          useNativeDriver: true,
        })
      ),
    ]).start(() => {
      // Tương đương Random().nextInt(5) + 1 của dart:math
      const next = Math.floor(Math.random() * 5) + 1;
      setBallIndex(next);
      setHistory((h) => [answers[next], ...h].slice(0, 5));
      isShaking.current = false;
      haptic(() =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      );
    });
  }, [shakeX]);

  // Lắc điện thoại để hỏi
  useEffect(() => {
    if (!shakeEnabled) return;
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      if (Math.sqrt(x * x + y * y + z * z) > SHAKE_THRESHOLD) askBall();
    });
    return () => sub && sub.remove();
  }, [shakeEnabled, askBall]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Magic 8 Ball</Text>
      </View>

      {/* Center + Column */}
      <View style={styles.body}>
        <Animated.Image
          source={ballImages[ballIndex]}
          style={[styles.ball, { transform: [{ translateX: shakeX }] }]}
        />

        <Text style={styles.answer}>{answers[ballIndex]}</Text>

        <Pressable
          onPress={askBall}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Hỏi quả cầu</Text>
        </Pressable>

        <Pressable onPress={() => setShakeEnabled((v) => !v)} style={styles.toggle}>
          <Text style={styles.toggleText}>
            Lắc điện thoại: {shakeEnabled ? 'BẬT' : 'TẮT'}
          </Text>
        </Pressable>

        {history.length > 0 && (
          <View style={styles.history}>
            <Text style={styles.historyTitle}>Lịch sử gần đây</Text>
            {history.map((h, i) => (
              <Text key={i} style={styles.historyItem}>
                {i + 1}. {h}
              </Text>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6',
  },
  appBar: {
    height: 56,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 4,
  },
  appBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ball: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
  },
  answer: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '600',
    color: '#1A237E',
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#1A237E',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggle: {
    marginTop: 12,
    padding: 8,
  },
  toggleText: {
    color: '#3949AB',
    fontSize: 15,
    fontWeight: '500',
  },
  history: {
    marginTop: 12,
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3949AB',
    marginBottom: 4,
  },
  historyItem: {
    fontSize: 14,
    color: '#5C6BC0',
  },
});