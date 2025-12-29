import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Polygon, Path, Line } from 'react-native-svg';

// ============================================
// COMPOSANTS SVG - ÉLÉMENTS D'ESPACE
// Design minimaliste et reconnaissable
// ============================================

interface SpaceElementProps {
  size?: number;
  color?: string;
}

// Fusée
export const RocketSVG: React.FC<SpaceElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps de la fusée */}
        <Rect x="22" y="20" width="16" height="30" rx="2" fill="#E74C3C" stroke="#333" strokeWidth="2" />
        {/* Pointe */}
        <Polygon points="30,8 38,20 22,20" fill="#C0392B" stroke="#333" strokeWidth="2" />
        {/* Hublot */}
        <Circle cx="30" cy="28" r="5" fill="#87CEEB" stroke="#333" strokeWidth="1.5" />
        {/* Ailerons */}
        <Polygon points="22,40 16,50 22,50" fill="#FFD700" stroke="#333" strokeWidth="1.5" />
        <Polygon points="38,40 44,50 38,50" fill="#FFD700" stroke="#333" strokeWidth="1.5" />
        {/* Flammes */}
        <Ellipse cx="26" cy="52" rx="3" ry="4" fill="#FFA500" />
        <Ellipse cx="30" cy="54" rx="3" ry="5" fill="#FF6347" />
        <Ellipse cx="34" cy="52" rx="3" ry="4" fill="#FFA500" />
      </Svg>
    </View>
  );
};

// Lune
export const MoonSVG: React.FC<SpaceElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps de la lune */}
        <Circle cx="30" cy="30" r="22" fill="#F4E5C2" stroke="#D4C5A2" strokeWidth="2" />
        {/* Cratères */}
        <Circle cx="25" cy="24" r="4" fill="#E0D4B0" stroke="#C4B89E" strokeWidth="1" />
        <Circle cx="38" cy="28" r="3" fill="#E0D4B0" stroke="#C4B89E" strokeWidth="1" />
        <Circle cx="32" cy="38" r="5" fill="#E0D4B0" stroke="#C4B89E" strokeWidth="1" />
        <Circle cx="22" cy="36" r="2.5" fill="#E0D4B0" stroke="#C4B89E" strokeWidth="1" />
        {/* Détails de surface */}
        <Circle cx="35" cy="20" r="2" fill="#E0D4B0" opacity="0.6" />
        <Circle cx="18" cy="28" r="1.5" fill="#E0D4B0" opacity="0.6" />
      </Svg>
    </View>
  );
};

// Étoile (contour uniquement)
export const StarSpaceSVG: React.FC<SpaceElementProps> = ({ size = 60 }) => {
  const cx = 30;
  const cy = 30;
  const outerRadius = 20;
  const innerRadius = 8;
  const points = [];

  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Étoile contour uniquement */}
        <Polygon
          points={points.join(' ')}
          fill="none"
          stroke="#FFD700"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// Planète
export const PlanetSVG: React.FC<SpaceElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Corps de la planète */}
        <Circle cx="30" cy="30" r="18" fill="#5B8DEE" stroke="#4A7ACC" strokeWidth="2" />
        {/* Bandes de couleur */}
        <Ellipse cx="30" cy="26" rx="18" ry="3" fill="#4A7ACC" opacity="0.5" />
        <Ellipse cx="30" cy="34" rx="18" ry="4" fill="#4A7ACC" opacity="0.3" />
        {/* Anneaux */}
        <Ellipse
          cx="30"
          cy="30"
          rx="28"
          ry="8"
          fill="none"
          stroke="#FFD700"
          strokeWidth="3"
          opacity="0.8"
        />
        <Ellipse
          cx="30"
          cy="30"
          rx="28"
          ry="8"
          fill="none"
          stroke="#FFA500"
          strokeWidth="1.5"
          opacity="0.5"
        />
        {/* Ombrage pour profondeur */}
        <Circle cx="30" cy="30" r="18" fill="rgba(0,0,0,0.1)" />
      </Svg>
    </View>
  );
};

// Alien
export const AlienSVG: React.FC<SpaceElementProps> = ({ size = 60 }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        {/* Tête */}
        <Ellipse cx="30" cy="25" rx="16" ry="18" fill="#7BC74D" stroke="#6AAD3E" strokeWidth="2" />
        {/* Antennes */}
        <Line x1="22" y1="10" x2="20" y2="4" stroke="#6AAD3E" strokeWidth="2" />
        <Circle cx="20" cy="4" r="2" fill="#E056FD" />
        <Line x1="38" y1="10" x2="40" y2="4" stroke="#6AAD3E" strokeWidth="2" />
        <Circle cx="40" cy="4" r="2" fill="#E056FD" />
        {/* Grands yeux */}
        <Ellipse cx="24" cy="22" rx="5" ry="7" fill="#2C3E50" />
        <Ellipse cx="36" cy="22" rx="5" ry="7" fill="#2C3E50" />
        {/* Reflets dans les yeux */}
        <Circle cx="25" cy="20" r="2" fill="#FFF" opacity="0.8" />
        <Circle cx="37" cy="20" r="2" fill="#FFF" opacity="0.8" />
        {/* Bouche souriante */}
        <Path d="M 22 32 Q 30 36 38 32" stroke="#6AAD3E" strokeWidth="2" fill="none" />
        {/* Corps */}
        <Ellipse cx="30" cy="46" rx="12" ry="10" fill="#7BC74D" stroke="#6AAD3E" strokeWidth="2" />
        {/* Bras */}
        <Ellipse cx="16" cy="42" rx="4" ry="8" fill="#7BC74D" stroke="#6AAD3E" strokeWidth="1.5" />
        <Ellipse cx="44" cy="42" rx="4" ry="8" fill="#7BC74D" stroke="#6AAD3E" strokeWidth="1.5" />
      </Svg>
    </View>
  );
};
