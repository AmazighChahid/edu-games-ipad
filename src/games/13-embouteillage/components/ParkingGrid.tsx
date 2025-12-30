/**
 * ParkingGrid component
 * Affiche la grille 6x6 du parking avec les véhicules
 * Gère le drag & drop pour déplacer les véhicules
 */

import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

import type { Vehicle, MoveValidation } from '../types';
import { borderRadius, shadows } from '../../../theme';

// ============================================
// CONSTANTS
// ============================================

const GRID_SIZE = 6;
const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16;
const MAX_GRID_WIDTH = Math.min(SCREEN_WIDTH - GRID_PADDING * 2, 400);
const CELL_SIZE = Math.floor(MAX_GRID_WIDTH / GRID_SIZE);
const GRID_WIDTH = CELL_SIZE * GRID_SIZE;

const COLORS = {
  gridBackground: '#4A5568',
  gridLine: '#2D3748',
  cellBackground: '#718096',
  exitZone: '#48BB78',
  exitArrow: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// ============================================
// TYPES
// ============================================

interface ParkingGridProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  exitRow: number;
  exitCol: number;
  onSelectVehicle: (vehicle: Vehicle | null) => void;
  onMoveVehicle: (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right', distance?: number) => boolean;
  canMove: (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right') => MoveValidation;
  getMaxMoveDistance: (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right') => number;
  status: string;
  hintVehicleId?: string;
}

// ============================================
// VEHICLE COMPONENT
// ============================================

interface VehicleItemProps {
  vehicle: Vehicle;
  isSelected: boolean;
  isHinted: boolean;
  cellSize: number;
  onSelect: () => void;
  onMove: (direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
  canMove: (direction: 'up' | 'down' | 'left' | 'right') => MoveValidation;
  getMaxDistance: (direction: 'up' | 'down' | 'left' | 'right') => number;
}

function VehicleItem({
  vehicle,
  isSelected,
  isHinted,
  cellSize,
  onSelect,
  onMove,
  canMove,
  getMaxDistance,
}: VehicleItemProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const width = vehicle.orientation === 'horizontal' ? cellSize * vehicle.length - 4 : cellSize - 4;
  const height = vehicle.orientation === 'vertical' ? cellSize * vehicle.length - 4 : cellSize - 4;

  const panGesture = useMemo(() => Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.05);
      runOnJS(onSelect)();
    })
    .onUpdate((event) => {
      if (vehicle.orientation === 'horizontal') {
        translateX.value = event.translationX;
        translateY.value = 0;
      } else {
        translateX.value = 0;
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      scale.value = withSpring(1);

      const threshold = cellSize / 2;

      if (vehicle.orientation === 'horizontal') {
        const cellsMoved = Math.round(event.translationX / cellSize);
        if (cellsMoved !== 0) {
          const direction = cellsMoved > 0 ? 'right' : 'left';
          const distance = Math.abs(cellsMoved);
          const maxDist = getMaxDistance(direction);
          const actualDistance = Math.min(distance, maxDist);

          if (actualDistance > 0) {
            runOnJS(onMove)(direction, actualDistance);
          }
        }
      } else {
        const cellsMoved = Math.round(event.translationY / cellSize);
        if (cellsMoved !== 0) {
          const direction = cellsMoved > 0 ? 'down' : 'up';
          const distance = Math.abs(cellsMoved);
          const maxDist = getMaxDistance(direction);
          const actualDistance = Math.min(distance, maxDist);

          if (actualDistance > 0) {
            runOnJS(onMove)(direction, actualDistance);
          }
        }
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }), [vehicle, cellSize, onMove, getMaxDistance, onSelect]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const baseStyle = {
    position: 'absolute' as const,
    left: vehicle.col * cellSize + 2,
    top: vehicle.row * cellSize + 2,
    width,
    height,
    borderRadius: 8,
    backgroundColor: vehicle.color,
    borderWidth: isSelected ? 3 : 0,
    borderColor: '#FFFFFF',
    ...shadows.md,
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[baseStyle, animatedStyle, isHinted && styles.hintedVehicle]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id={`grad_${vehicle.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <Stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
            </LinearGradient>
          </Defs>

          {/* Body shine */}
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx="6"
            fill={`url(#grad_${vehicle.id})`}
          />

          {/* Windows for cars */}
          {vehicle.type === 'car' && vehicle.orientation === 'horizontal' && (
            <>
              <Rect
                x={width * 0.15}
                y={height * 0.15}
                width={width * 0.3}
                height={height * 0.5}
                rx="3"
                fill="rgba(100, 200, 255, 0.6)"
              />
              <Rect
                x={width * 0.55}
                y={height * 0.15}
                width={width * 0.3}
                height={height * 0.5}
                rx="3"
                fill="rgba(100, 200, 255, 0.6)"
              />
            </>
          )}

          {vehicle.type === 'car' && vehicle.orientation === 'vertical' && (
            <>
              <Rect
                x={width * 0.15}
                y={height * 0.1}
                width={width * 0.7}
                height={height * 0.25}
                rx="3"
                fill="rgba(100, 200, 255, 0.6)"
              />
              <Rect
                x={width * 0.15}
                y={height * 0.55}
                width={width * 0.7}
                height={height * 0.25}
                rx="3"
                fill="rgba(100, 200, 255, 0.6)"
              />
            </>
          )}

          {/* Truck cargo area */}
          {vehicle.type === 'truck' && (
            <Rect
              x={vehicle.orientation === 'horizontal' ? width * 0.4 : width * 0.1}
              y={vehicle.orientation === 'horizontal' ? height * 0.1 : height * 0.35}
              width={vehicle.orientation === 'horizontal' ? width * 0.55 : width * 0.8}
              height={vehicle.orientation === 'horizontal' ? height * 0.8 : height * 0.6}
              rx="4"
              fill="rgba(0,0,0,0.15)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          )}

          {/* Target car arrow indicator */}
          {vehicle.isTarget && vehicle.orientation === 'horizontal' && (
            <Path
              d={`M ${width - 15} ${height / 2 - 6} L ${width - 5} ${height / 2} L ${width - 15} ${height / 2 + 6}`}
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
            />
          )}
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ParkingGrid({
  vehicles,
  selectedVehicle,
  exitRow,
  exitCol,
  onSelectVehicle,
  onMoveVehicle,
  canMove,
  getMaxMoveDistance,
  status,
  hintVehicleId,
}: ParkingGridProps) {

  const handleMoveVehicle = useCallback((
    vehicleId: string,
    direction: 'up' | 'down' | 'left' | 'right',
    distance: number
  ) => {
    onMoveVehicle(vehicleId, direction, distance);
  }, [onMoveVehicle]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.gridContainer}>
        {/* Grid background */}
        <Svg width={GRID_WIDTH + 20} height={GRID_WIDTH} viewBox={`0 0 ${GRID_WIDTH + 20} ${GRID_WIDTH}`}>
          {/* Background */}
          <Rect
            x="0"
            y="0"
            width={GRID_WIDTH}
            height={GRID_WIDTH}
            rx="12"
            fill={COLORS.gridBackground}
          />

          {/* Grid cells */}
          {Array.from({ length: GRID_SIZE }).map((_, row) =>
            Array.from({ length: GRID_SIZE }).map((_, col) => (
              <Rect
                key={`cell_${row}_${col}`}
                x={col * CELL_SIZE + 2}
                y={row * CELL_SIZE + 2}
                width={CELL_SIZE - 4}
                height={CELL_SIZE - 4}
                rx="4"
                fill={COLORS.cellBackground}
                opacity={0.3}
              />
            ))
          )}

          {/* Exit zone */}
          <Rect
            x={GRID_WIDTH}
            y={exitRow * CELL_SIZE}
            width={20}
            height={CELL_SIZE}
            fill={COLORS.exitZone}
          />

          {/* Exit arrow */}
          <Path
            d={`M ${GRID_WIDTH + 5} ${exitRow * CELL_SIZE + CELL_SIZE / 2 - 8}
                L ${GRID_WIDTH + 15} ${exitRow * CELL_SIZE + CELL_SIZE / 2}
                L ${GRID_WIDTH + 5} ${exitRow * CELL_SIZE + CELL_SIZE / 2 + 8}`}
            stroke={COLORS.exitArrow}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>

        {/* Vehicles layer */}
        <View style={styles.vehiclesLayer}>
          {vehicles.map((vehicle) => (
            <VehicleItem
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicle?.id === vehicle.id}
              isHinted={hintVehicleId === vehicle.id}
              cellSize={CELL_SIZE}
              onSelect={() => onSelectVehicle(vehicle)}
              onMove={(direction, distance) => handleMoveVehicle(vehicle.id, direction, distance)}
              canMove={(dir) => canMove(vehicle.id, dir)}
              getMaxDistance={(dir) => getMaxMoveDistance(vehicle.id, dir)}
            />
          ))}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    position: 'relative',
    width: GRID_WIDTH + 20,
    height: GRID_WIDTH,
  },
  vehiclesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: GRID_WIDTH,
    height: GRID_WIDTH,
  },
  hintedVehicle: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default ParkingGrid;
