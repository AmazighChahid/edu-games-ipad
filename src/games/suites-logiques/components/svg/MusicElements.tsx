import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Polygon, Path, Line } from 'react-native-svg';

// ============================================
// COMPOSANTS SVG - ÉLÉMENTS MUSICAUX
// Simplifiés pour reconnaissance enfants
// ============================================

interface MusicElementProps {
  size?: number;
  color?: string;
}

// Note de musique simple
export const NoteSVG: React.FC<MusicElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Tête de note */}
        <Ellipse
          cx="25"
          cy="42"
          rx="8"
          ry="6"
          fill="#2C3E50"
          transform="rotate(-20 25 42)"
        />
        {/* Tige */}
        <Rect x="32" y="16" width="3" height="26" fill="#2C3E50" />
        {/* Drapeau */}
        <Path
          d="M 35 16 Q 45 14 45 22 Q 45 28 35 26"
          fill="#2C3E50"
        />
      </Svg>
    </View>
  );
};

// Double croche
export const DoubleNoteSVG: React.FC<MusicElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Première note */}
        <Ellipse
          cx="22"
          cy="42"
          rx="7"
          ry="5"
          fill="#2C3E50"
          transform="rotate(-20 22 42)"
        />
        <Rect x="28" y="18" width="2.5" height="24" fill="#2C3E50" />

        {/* Deuxième note */}
        <Ellipse
          cx="36"
          cy="46"
          rx="7"
          ry="5"
          fill="#2C3E50"
          transform="rotate(-20 36 46)"
        />
        <Rect x="42" y="22" width="2.5" height="24" fill="#2C3E50" />

        {/* Barre de liaison */}
        <Rect x="30" y="18" width="15" height="3" fill="#2C3E50" />

        {/* Drapeaux connectés */}
        <Path
          d="M 30 21 L 45 21 L 45 26 L 30 26 Z"
          fill="#2C3E50"
        />
      </Svg>
    </View>
  );
};

// Clé de sol
export const ClefSVG: React.FC<MusicElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps de la clé de sol (simplifié) */}
        <Path
          d="M 35 15
             Q 40 12 40 18
             Q 40 24 35 27
             Q 30 30 30 36
             Q 30 42 34 45
             Q 38 48 38 42
             Q 38 38 35 36
             Q 32 34 30 36
             C 28 38 26 40 26 42
             C 26 46 28 50 32 50
             C 36 50 42 48 42 42
             C 42 36 38 32 32 30
             Q 28 28 28 22
             Q 28 16 32 12
             Q 36 8 40 10"
          fill="none"
          stroke="#2C3E50"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Point central */}
        <Circle cx="35" cy="36" r="3" fill="#2C3E50" />
      </Svg>
    </View>
  );
};

// Tambour
export const DrumSVG: React.FC<MusicElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps du tambour */}
        <Ellipse cx="30" cy="24" rx="18" ry="6" fill="#D2691E" stroke="#8B4513" strokeWidth="2" />
        <Rect x="12" y="24" width="36" height="20" fill="#CD853F" stroke="#8B4513" strokeWidth="2" />
        <Ellipse cx="30" cy="44" rx="18" ry="6" fill="#D2691E" stroke="#8B4513" strokeWidth="2" />

        {/* Lacets en zigzag */}
        <Line x1="16" y1="26" x2="20" y2="42" stroke="#FFD700" strokeWidth="2" />
        <Line x1="24" y1="26" x2="20" y2="42" stroke="#FFD700" strokeWidth="2" />
        <Line x1="24" y1="26" x2="28" y2="42" stroke="#FFD700" strokeWidth="2" />
        <Line x1="32" y1="26" x2="28" y2="42" stroke="#FFD700" strokeWidth="2" />
        <Line x1="32" y1="26" x2="36" y2="42" stroke="#FFD700" strokeWidth="2" />
        <Line x1="40" y1="26" x2="36" y2="42" stroke="#FFD700" strokeWidth="2" />
        <Line x1="40" y1="26" x2="44" y2="42" stroke="#FFD700" strokeWidth="2" />

        {/* Baguettes (optionnel) */}
        <Line x1="8" y1="18" x2="18" y2="10" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="8" cy="18" r="2" fill="#FFB6C1" />
        <Line x1="52" y1="18" x2="42" y2="10" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="52" cy="18" r="2" fill="#FFB6C1" />
      </Svg>
    </View>
  );
};

// Portée avec note (bonus - plus complexe)
export const StaffNoteSVG: React.FC<MusicElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Lignes de la portée */}
        <Line x1="10" y1="20" x2="50" y2="20" stroke="#333" strokeWidth="1" />
        <Line x1="10" y1="26" x2="50" y2="26" stroke="#333" strokeWidth="1" />
        <Line x1="10" y1="32" x2="50" y2="32" stroke="#333" strokeWidth="1" />
        <Line x1="10" y1="38" x2="50" y2="38" stroke="#333" strokeWidth="1" />
        <Line x1="10" y1="44" x2="50" y2="44" stroke="#333" strokeWidth="1" />

        {/* Note sur la portée */}
        <Ellipse
          cx="30"
          cy="32"
          rx="5"
          ry="4"
          fill="#2C3E50"
          transform="rotate(-20 30 32)"
        />
        <Rect x="34" y="16" width="2" height="16" fill="#2C3E50" />

        {/* Petit drapeau */}
        <Path d="M 36 16 Q 42 15 42 20 Q 42 24 36 23" fill="#2C3E50" />
      </Svg>
    </View>
  );
};
