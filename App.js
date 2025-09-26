import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HaryanaRoadwaysGame = () => {
  const [gameState, setGameState] = useState({
    currentLocation: 'Chandigarh',
    time: 0,
    passengerSatisfaction: 100,
    busCondition: 100,
    fuel: 100,
    speed: 60,
    gameOver: false,
    gameWon: false,
    currentEvent: null,
    routeProgress: 0,
    messages: ['Welcome to Original HRTC Bus Simulator! Start driving from Chandigarh depot...'],
    inDrivingMode: true,
    obstaclePosition: width / 2
  });

  const route = [
    { name: 'Chandigarh', distance: 0 },
    { name: 'Panchkula', distance: 20 },
    { name: 'Ambala', distance: 50 },
    { name: 'Yamunanagar', distance: 80 },
    { name: 'Kurukshetra', distance: 110 },
    { name: 'Karnal', distance: 150 },
    { name: 'Panipat', distance: 190 },
    { name: 'Sonipat', distance: 230 },
    { name: 'Rohtak', distance: 270 },
    { name: 'Jhajjar', distance: 300 },
    { name: 'Bahadurgarh', distance: 320 },
    { name: 'Hisar', distance: 370 },
    { name: 'Sirsa', distance: 420 },
    { name: 'Bhiwani', distance: 450 },
    { name: 'Rewari', distance: 480 },
    { name: 'Gurugram', distance: 500 },
    { name: 'Faridabad', distance: 530 }
  ];

  const events = [
    {
      id: 1,
      description: "Chandigarh: Morning rush at Sector 17. No AC complaint from passenger.",
      options: [
        { text: "Ignore - focus on road", time: 0, satisfaction: -10, busCondition: 0, fuel: 0 },
        { text: "Explain politely (HRTC standard bus)", time: 5, satisfaction: 0, busCondition: 0, fuel: 0 },
        { text: "Stop at dhaba for cold drinks", time: 10, satisfaction: 10, busCondition: 0, fuel: -5 }
      ]
    },
    {
      id: 2,
      description: "Ambala: Border jam with Punjab buses. Pothole tire issue.",
      options: [
        { text: "Drive carefully", time: 5, satisfaction: 0, busCondition: -10, fuel: -5 },
        { text: "Quick fix at depot", time: 10, satisfaction: -5, busCondition: 5, fuel: 0 },
        { text: "Call roadside help", time: 15, satisfaction: 5, busCondition: 10, fuel: -3 }
      ]
    },
    {
      id: 3,
      description: "Kurukshetra: Tourists at Brahma Sarovar. Crying kid in back seat.",
      options: [
        { text: "Honk and overtake", time: 0, satisfaction: -5, busCondition: 0, fuel: -2 },
        { text: "Tell a Mahabharata story", time: 5, satisfaction: 15, busCondition: 0, fuel: 0 },
        { text: "Short stop for photo", time: 10, satisfaction: 10, busCondition: -2, fuel: -5 }
      ]
    },
    {
      id: 4,
      description: "Panipat: Industrial traffic. Passenger wants factory detour.",
      options: [
        { text: "Stick to NH-44", time: 0, satisfaction: -10, busCondition: 0, fuel: 0 },
        { text: "Allow 5km detour", time: 10, satisfaction: 10, busCondition: -3, fuel: -8 },
        { text: "Play local history audio", time: 5, satisfaction: 5, busCondition: 0, fuel: 0 }
      ]
    },
    {
      id: 5,
      description: "Rohtak: Festival crowd at Jindal Stadium. Engine heat in summer.",
      options: [
        { text: "Push forward", time: 0, satisfaction: 0, busCondition: -15, fuel: -10 },
        { text: "Cool engine at depot", time: 10, satisfaction: -5, busCondition: 10, fuel: 5 },
        { text: "Refuel and rest break", time: 15, satisfaction: 5, busCondition: 15, fuel: 20 }
      ]
    },
    {
      id: 6,
      description: "Hisar: Farmers blocking with goods. Low fuel warning.",
      options: [
        { text: "Honk to clear", time: 0, satisfaction: -10, busCondition: 0, fuel: -5 },
        { text: "Help load goods", time: 10, satisfaction: 15, busCondition: -5, fuel: 0 },
        { text: "Refuel at Hisar depot", time: 5, satisfaction: 0, busCondition: 0, fuel: 25 }
      ]
    },
    {
      id: 7,
      description: "Bhiwani: Rural rain on bad roads. Sudden pothole!",
      options: [
        { text: "Speed through", time: 0, satisfaction: -5, busCondition: -10, fuel: -3 },
        { text: "Brake and swerve", time: 5, satisfaction: 0, busCondition: -5, fuel: 0 },
        { text: "Stop to inspect", time: 15, satisfaction: -10, busCondition: 5, fuel: 0 }
      ]
    },
    {
      id: 8,
      description: "Gurugram: Corporate rush on NH-48 to Delhi. Heavy traffic.",
      options: [
        { text: "Take expressway toll", time: 0, satisfaction: 5, busCondition: -5, fuel: -15 },
        { text: "Wait at signal", time: 10, satisfaction: -5, busCondition: 0, fuel: 0 },
        { text: "Play Haryanvi folk music", time: 5, satisfaction: 10, busCondition: 0, fuel: 0 }
      ]
    }
  ];

  useEffect(() => {
    const { time, passengerSatisfaction, busCondition, fuel, routeProgress } = gameState;
    if (time > 480 || passengerSatisfaction <= 0 || busCondition <= 0 || fuel <= 0) {
      setGameState(prev => ({ ...prev, gameOver: true, inDrivingMode: false }));
    }
    if (routeProgress >= route.length - 1 && time <= 480 && passengerSatisfaction > 60 && busCondition > 40 && fuel > 20) {
      setGameState(prev => ({ ...prev, gameWon: true, inDrivingMode: false }));
    }
    const interval = setInterval(() => {
      if (gameState.inDrivingMode && !gameState.gameOver && !gameState.gameWon) {
        setGameState(prev => ({
          ...prev,
          time: prev.time + 1,
          fuel: Math.max(0, prev.fuel - 0.5),
          speed: Math.min(100, prev.speed + (Math.random() - 0.5) * 2)
        }));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleChoice = (choice) => {
    if (gameState.gameOver || gameState.gameWon) return;
    const { time: addTime, satisfaction, busCondition: addBus, fuel: addFuel } = choice;
    const newTime = gameState.time + addTime;
    const newSatisfaction = Math.min(100, Math.max(0, gameState.passengerSatisfaction + satisfaction));
    const newBusCondition = Math.min(100, Math.max(0, gameState.busCondition + addBus));
    const newFuel = Math.min(100, Math.max(0, gameState.fuel + (addFuel || 0)));
    const progress = Math.min(route.length - 1, Math.floor(newTime / 30));
    setGameState(prev => ({
      ...prev,
      time: newTime,
      passengerSatisfaction: newSatisfaction,
      busCondition: newBusCondition,
      fuel: newFuel,
      currentLocation: route[progress].name,
      routeProgress: progress,
      currentEvent: null,
      messages: [...prev.messages, `Decision: ${choice.text} | Arrived at ${route[progress].name}`],
      inDrivingMode: true
    }));
    setTimeout(triggerRandomEvent, 3000);
  };

  const triggerRandomEvent = () => {
    if (gameState.gameOver || gameState.gameWon || gameState.routeProgress >= route.length - 1) return;
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setGameState(prev => ({
      ...prev,
      currentEvent: randomEvent,
      messages: [...prev.messages, `Event at ${gameState.currentLocation}: ${randomEvent.description}`],
      inDrivingMode: false
    }));
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const restartGame = () => {
    setGameState({
      currentLocation: 'Chandigarh',
      time: 0,
      passengerSatisfaction: 100,
      busCondition: 100,
      fuel: 100,
      speed: 60,
      gameOver: false,
      gameWon: false,
      currentEvent: null,
      routeProgress: 0,
      messages: ['Welcome to Original HRTC Bus Simulator! Start driving from Chandigarh depot...'],
      inDrivingMode: true,
      obstaclePosition: width / 2
    });
    setTimeout(triggerRandomEvent, 5000);
  };

  const handleSteer = (direction) => {
    if (!gameState.inDrivingMode) return;
    let newProgress = gameState.routeProgress;
    let newBusCondition = gameState.busCondition;
    let newFuel = Math.max(0, gameState.fuel - 2);
    let newObstacle = gameState.obstaclePosition;
    if (direction === 'left') {
      newObstacle = Math.max(0, newObstacle - 20);
      if (Math.random() > 0.3) {
        newProgress = Math.min(route.length - 1, newProgress + 0.5);
        gameState.messages.push('Steer left: Avoided truck! Progress +');
      } else {
        newBusCondition -= 8;
        gameState.messages.push('Steer left failed: Side scrape!');
      }
    } else if (direction === 'right') {
      newObstacle = Math.min(width, newObstacle + 20);
      if (Math.random() > 0.3) {
        newProgress = Math.min(route.length - 1, newProgress + 0.5);
        gameState.messages.push('Steer right: Dodged pothole! Progress +');
      } else {
        newBusCondition -= 8;
        gameState.messages.push('Steer right failed: Hit barrier!');
      }
    }
    setGameState(prev => ({ ...prev, routeProgress: newProgress, busCondition: newBusCondition, fuel: newFuel, obstaclePosition: newObstacle }));
    if (newProgress >= route.length - 1) setGameState(prev => ({ ...prev, gameWon: true }));
  };

  const handleBrake = () => {
    if (!gameState.inDrivingMode) return;
    const newSpeed = Math.max(20, gameState.speed - 30);
    const newSatisfaction = Math.max(0, gameState.passengerSatisfaction - 3);
    gameState.messages.push(`Brake applied! Speed: ${newSpeed} km/h | Careful stop.`);
    setGameState(prev => ({ ...prev, speed: newSpeed, passengerSatisfaction: newSatisfaction }));
  };

  const handleAccelerate = () => {
    if (!gameState.inDrivingMode) return;
    const newSpeed = Math.min(100, gameState.speed + 25);
    const newFuel = Math.max(0, gameState.fuel - 8);
    gameState.messages.push(`Accelerated! Speed: ${newSpeed} km/h | Overtaking.`);
    setGameState(prev => ({ ...prev, speed: newSpeed, fuel: newFuel }));
  };

  const ProgressBar = ({ value, color }) => (
    <View style={[styles.progressBar, { backgroundColor: '#e5e7eb' }]}>
      <View style={[styles.progressFill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );

  const RoadView = () => (
    <View style={styles.roadContainer}>
      <View style={styles.roadLine} />
      <View style={[styles.roadLine, { top: height * 0.3 }]} />
      <View style={[styles.roadLine, { top: height * 0.6 }]} />
      <View style={styles.busIcon}>🚌</View>
      <View style={[styles.obstacle, { left: gameState.obstaclePosition }]}>🚗</View>
    </View>
  );

  if (gameState.gameOver || gameState.gameWon) {
    return (
      <LinearGradient colors={['#dbeafe', '#bbf7d0']} style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.endScreen}>
          <Text style={[styles.endTitle, { color: gameState.gameWon ? '#10b981' : '#ef4444' }]}>
            {gameState.gameWon ? 'Congratulations! Full Tour Complete!' : 'Game Over - Tour Incomplete'}
          </Text>
          <Text style={styles.endText}>
            {gameState.gameWon ? 'You covered all Haryana depots like a pro driver!' : 'Fuel ran out or bus damaged. Try again!'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#dbeafe', '#bbf7d0']} style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Haryana Roadways Bus Simulator</Text>
        <Text style={styles.subtitle}>Drive from Chandigarh to Faridabad - All Depots!</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatTime(gameState.time)} / 8h</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Speed</Text>
            <Text style={styles.statValue}>{gameState.speed} km/h</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Satisfaction</Text>
            <ProgressBar value={gameState.passengerSatisfaction} color="#10b981" />
            <Text style={styles.statValue}>{gameState.passengerSatisfaction}%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Bus Condition</Text>
            <ProgressBar value={gameState.busCondition} color="#f59e0b" />
            <Text style={styles.statValue}>{gameState.busCondition}%</Text>
          </View>
          <View style={styles
