import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flexGrow: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlsButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  controlText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  messagesCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  messagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

const HaryanaRoadwaysGame = () => {
  // Route data
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
    { name: 'Faridabad', distance: 530 },
  ];

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
    obstaclePosition: width / 2,
  });

  // Format time helper
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // Accelerate handler
  const handleAccelerate = () => {
    if (gameState.gameOver || gameState.gameWon || !gameState.inDrivingMode) return;
    const newSpeed = Math.min(100, gameState.speed + 10);
    const newFuel = Math.max(0, gameState.fuel - 3);
    let newProgress = gameState.routeProgress;
    let newLocation = gameState.currentLocation;

    if (newSpeed > 70) {
      newProgress = Math.min(route.length - 1, gameState.routeProgress + 0.2);
      const progressIndex = Math.floor(newProgress);
      newLocation = route[progressIndex].name;
    }

    setGameState(prev => ({
      ...prev,
      speed: newSpeed,
      fuel: newFuel,
      routeProgress: newProgress,
      currentLocation: newLocation,
      messages: [...prev.messages.slice(-9), `Accelerated - Progress to ${newLocation}, Fuel: ${newFuel}%`],
    }));
  };

  // Brake handler
  const handleBrake = () => {
    if (gameState.gameOver || gameState.gameWon || !gameState.inDrivingMode) return;
    const newSpeed = Math.max(0, gameState.speed - 10);
    let newSatisfaction = gameState.passengerSatisfaction;
    if (newSpeed < 40) {
      newSatisfaction = Math.max(0, gameState.passengerSatisfaction - 5);
    }
    setGameState(prev => ({
      ...prev,
      speed: newSpeed,
      passengerSatisfaction: newSatisfaction,
      messages: [...prev.messages.slice(-9), `Braked - Speed: ${newSpeed} km/h`],
    }));
  };

  // Steer handler
  const handleSteer = (direction) => {
    if (gameState.gameOver || gameState.gameWon || !gameState.inDrivingMode) return;
    let newPosition = gameState.obstaclePosition;
    if (direction === 'left') {
      newPosition = Math.max(20, gameState.obstaclePosition - 50);
    } else if (direction === 'right') {
      newPosition = Math.min(width - 50, gameState.obstaclePosition + 50);
    }
    const busCenter = width / 2;
    const distance = Math.abs(newPosition - busCenter);
    let newBusCondition = gameState.busCondition;
    let newMessages = gameState.messages;
    if (distance < 30) {
      newBusCondition = Math.max(0, gameState.busCondition - 20);
      newMessages = [...gameState.messages.slice(-9), 'Collision! Bus damage -20%'];
    } else {
      newMessages = [...gameState.messages.slice(-9), `Steered ${direction} - Safe drive!`];
    }
    setGameState(prev => ({
      ...prev,
      obstaclePosition: newPosition,
      busCondition: newBusCondition,
      messages: newMessages,
    }));
  };

  // Game over or win check (simple)
  useEffect(() => {
    if (
      gameState.time > 480 ||
      gameState.passengerSatisfaction <= 0 ||
      gameState.busCondition <= 0 ||
      gameState.fuel <= 0
    ) {
      if (!gameState.gameOver) {
        setGameState(prev => ({ ...prev, gameOver: true, inDrivingMode: false, messages: [...prev.messages, 'Game Over!'] }));
      }
    } else if (
      gameState.routeProgress >= route.length - 1 &&
      gameState.passengerSatisfaction > 60 &&
      gameState.busCondition > 40 &&
      gameState.fuel > 20
    ) {
      if (!gameState.gameWon) {
        setGameState(prev => ({ ...prev, gameWon: true, inDrivingMode: false, messages: [...prev.messages, 'You Won! Congratulations!'] }));
      }
    }
  }, [gameState.time, gameState.passengerSatisfaction, gameState.busCondition, gameState.fuel, gameState.routeProgress,gameState.gameOver,  gameState.gameWon,   route.length,       
]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollView}>
      <Text style={styles.locationText}>Location: {gameState.currentLocation}</Text>

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(gameState.time)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Satisfaction</Text>
          <Text style={styles.statValue}>{gameState.passengerSatisfaction}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Bus Condition</Text>
          <Text style={styles.statValue}>{gameState.busCondition}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Fuel</Text>
          <Text style={styles.statValue}>{gameState.fuel}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Speed</Text>
          <Text style={styles.statValue}>{gameState.speed} km/h</Text>
        </View>
      </View>

      {/* Controls */}
      {gameState.inDrivingMode && !gameState.gameOver && !gameState.gameWon && (
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlsButton} onPress={() => handleSteer('left')}>
            <Text style={styles.controlText}>Steer Left</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlsButton} onPress={handleBrake}>
            <Text style={styles.controlText}>Brake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlsButton} onPress={handleAccelerate}>
            <Text style={styles.controlText}>Accelerate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlsButton} onPress={() => handleSteer('right')}>
            <Text style={styles.controlText}>Steer Right</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Messages */}
      <View style={styles.messagesCard}>
        <Text style={styles.messagesTitle}>Recent Messages:</Text>
        {gameState.messages.slice(-5).map((msg, index) => (
          <Text key={index} style={styles.messageText}>{msg}</Text>
        ))}
      </View>

      {/* Game Over / Win Message */}
      {(gameState.gameOver || gameState.gameWon) && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: gameState.gameWon ? 'green' : 'red' }}>
            {gameState.gameWon ? '🎉 You Won! 🎉' : 'Game Over'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HaryanaRoadwaysGame;
