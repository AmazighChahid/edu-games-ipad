import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Polygon, Path } from 'react-native-svg';

// ============================================
// COMPOSANTS SVG - ANIMAUX DE FERME
// Style plat vectoriel simplifié
// ============================================

interface AnimalProps {
  size?: number;
  color?: string;
}

// Vache
export const CowSVG: React.FC<AnimalProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps */}
        <Ellipse cx="30" cy="35" rx="20" ry="15" fill="#F5F5F5" stroke="#333" strokeWidth="2" />
        {/* Tête */}
        <Circle cx="30" cy="20" r="12" fill="#F5F5F5" stroke="#333" strokeWidth="2" />
        {/* Taches */}
        <Ellipse cx="25" cy="35" rx="5" ry="4" fill="#333" />
        <Ellipse cx="35" cy="38" rx="4" ry="3" fill="#333" />
        {/* Oreilles */}
        <Ellipse cx="20" cy="16" rx="4" ry="6" fill="#FFB6C1" />
        <Ellipse cx="40" cy="16" rx="4" ry="6" fill="#FFB6C1" />
        {/* Yeux */}
        <Circle cx="26" cy="18" r="2" fill="#333" />
        <Circle cx="34" cy="18" r="2" fill="#333" />
        {/* Museau */}
        <Ellipse cx="30" cy="24" rx="6" ry="4" fill="#FFB6C1" />
        {/* Pattes */}
        <Rect x="22" y="48" width="3" height="10" fill="#333" />
        <Rect x="35" y="48" width="3" height="10" fill="#333" />
      </Svg>
    </View>
  );
};

// Cochon
export const PigSVG: React.FC<AnimalProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps */}
        <Ellipse cx="30" cy="32" rx="18" ry="14" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
        {/* Tête */}
        <Circle cx="30" cy="22" r="11" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
        {/* Oreilles */}
        <Polygon points="20,14 18,10 22,12" fill="#FFB6C1" stroke="#333" strokeWidth="1.5" />
        <Polygon points="40,14 42,10 38,12" fill="#FFB6C1" stroke="#333" strokeWidth="1.5" />
        {/* Yeux */}
        <Circle cx="26" cy="20" r="2" fill="#333" />
        <Circle cx="34" cy="20" r="2" fill="#333" />
        {/* Groin */}
        <Ellipse cx="30" cy="26" rx="5" ry="4" fill="#FF91A4" stroke="#333" strokeWidth="1.5" />
        <Circle cx="28" cy="26" r="1.5" fill="#333" />
        <Circle cx="32" cy="26" r="1.5" fill="#333" />
        {/* Queue en tire-bouchon */}
        <Path d="M 48 32 Q 52 30 50 26" stroke="#FFB6C1" strokeWidth="2" fill="none" />
      </Svg>
    </View>
  );
};

// Poule
export const ChickenSVG: React.FC<AnimalProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps */}
        <Ellipse cx="30" cy="35" rx="16" ry="13" fill="#FFF" stroke="#333" strokeWidth="2" />
        {/* Tête */}
        <Circle cx="30" cy="20" r="8" fill="#FFF" stroke="#333" strokeWidth="2" />
        {/* Crête */}
        <Path d="M 26 14 L 28 10 L 30 14 L 32 10 L 34 14" fill="#FF4444" stroke="#333" strokeWidth="1" />
        {/* Bec */}
        <Polygon points="30,22 34,24 30,26" fill="#FFA500" stroke="#333" strokeWidth="1" />
        {/* Œil */}
        <Circle cx="27" cy="20" r="2" fill="#333" />
        {/* Aile */}
        <Ellipse cx="35" cy="35" rx="6" ry="10" fill="#F5F5F5" stroke="#333" strokeWidth="1.5" />
        {/* Pattes */}
        <Path d="M 26 48 L 26 52 M 24 52 L 28 52" stroke="#FFA500" strokeWidth="2" fill="none" />
        <Path d="M 34 48 L 34 52 M 32 52 L 36 52" stroke="#FFA500" strokeWidth="2" fill="none" />
      </Svg>
    </View>
  );
};

// Mouton
export const SheepSVG: React.FC<AnimalProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps laineux */}
        <Ellipse cx="30" cy="32" rx="18" ry="14" fill="#E8E8E8" stroke="#999" strokeWidth="2" />
        {/* Flocons de laine */}
        <Circle cx="20" cy="28" r="5" fill="#F5F5F5" stroke="#999" strokeWidth="1" />
        <Circle cx="40" cy="28" r="5" fill="#F5F5F5" stroke="#999" strokeWidth="1" />
        <Circle cx="30" cy="24" r="5" fill="#F5F5F5" stroke="#999" strokeWidth="1" />
        <Circle cx="25" cy="36" r="5" fill="#F5F5F5" stroke="#999" strokeWidth="1" />
        <Circle cx="35" cy="36" r="5" fill="#F5F5F5" stroke="#999" strokeWidth="1" />
        {/* Tête */}
        <Ellipse cx="30" cy="18" rx="7" ry="8" fill="#2C2C2C" stroke="#333" strokeWidth="2" />
        {/* Oreilles */}
        <Ellipse cx="24" cy="16" rx="3" ry="5" fill="#2C2C2C" />
        <Ellipse cx="36" cy="16" rx="3" ry="5" fill="#2C2C2C" />
        {/* Yeux */}
        <Circle cx="27" cy="18" r="1.5" fill="#FFF" />
        <Circle cx="33" cy="18" r="1.5" fill="#FFF" />
        {/* Pattes */}
        <Rect x="22" y="44" width="3" height="12" fill="#2C2C2C" />
        <Rect x="35" y="44" width="3" height="12" fill="#2C2C2C" />
      </Svg>
    </View>
  );
};

// Cheval
export const HorseSVG: React.FC<AnimalProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps */}
        <Ellipse cx="32" cy="35" rx="16" ry="12" fill="#8B4513" stroke="#333" strokeWidth="2" />
        {/* Cou */}
        <Rect x="18" y="20" width="8" height="18" fill="#8B4513" stroke="#333" strokeWidth="2" />
        {/* Tête */}
        <Ellipse cx="22" cy="15" rx="6" ry="8" fill="#8B4513" stroke="#333" strokeWidth="2" />
        {/* Oreilles */}
        <Polygon points="20,8 18,4 22,8" fill="#8B4513" stroke="#333" strokeWidth="1.5" />
        <Polygon points="24,8 26,4 22,8" fill="#8B4513" stroke="#333" strokeWidth="1.5" />
        {/* Œil */}
        <Circle cx="20" cy="14" r="2" fill="#333" />
        {/* Crinière */}
        <Path d="M 22 8 Q 24 12 22 16 Q 20 12 22 8" fill="#654321" stroke="#333" strokeWidth="1" />
        {/* Naseaux */}
        <Circle cx="20" cy="18" r="1" fill="#333" />
        {/* Pattes */}
        <Rect x="24" y="44" width="3" height="14" fill="#654321" />
        <Rect x="40" y="44" width="3" height="14" fill="#654321" />
        {/* Queue */}
        <Path d="M 48 36 Q 54 40 52 46" stroke="#654321" strokeWidth="3" fill="none" />
      </Svg>
    </View>
  );
};
