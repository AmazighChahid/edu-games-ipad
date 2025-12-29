import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SequenceElement as ElementType } from '../types';
import { DIMENSIONS, ELEMENT_COLORS } from '../constants/gameConfig';

// Import des SVG
import {
  CircleSVG,
  SquareSVG,
  TriangleSVG,
  DiamondSVG,
} from './svg/GeometricShapes';
import {
  CowSVG,
  PigSVG,
  ChickenSVG,
  SheepSVG,
  HorseSVG,
} from './svg/FarmAnimals';
import {
  RocketSVG,
  MoonSVG,
  StarSpaceSVG,
  PlanetSVG,
  AlienSVG,
} from './svg/SpaceElements';
import {
  NoteSVG,
  DoubleNoteSVG,
  ClefSVG,
  DrumSVG,
} from './svg/MusicElements';

// ============================================
// COMPOSANT SEQUENCE ELEMENT
// Affiche un élément de la suite (couleur, forme, nombre, image)
// ============================================

interface Props {
  element: ElementType;
  index?: number;
  isPulsing?: boolean;
  isHighlighted?: boolean;
  size?: number;
}

export const SequenceElement: React.FC<Props> = ({
  element,
  index = 0,
  isPulsing = false,
  isHighlighted = false,
  size = DIMENSIONS.sequenceElement.size,
}) => {
  // Animation de pulsation pour les indices
  const pulseStyle = useAnimatedStyle(() => {
    if (!isPulsing) return {};

    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.1, {
                duration: 500,
                easing: Easing.inOut(Easing.ease),
              }),
              withTiming(1.0, {
                duration: 500,
                easing: Easing.inOut(Easing.ease),
              })
            ),
            -1,
            true
          ),
        },
      ],
      shadowOpacity: withRepeat(
        withSequence(withTiming(0.5, { duration: 500 }), withTiming(0.2, { duration: 500 })),
        -1,
        true
      ),
    };
  }, [isPulsing]);

  // Rendu du contenu selon le type
  const renderContent = () => {
    switch (element.type) {
      case 'image':
        return renderImageElement();

      case 'color':
        return renderColorElement();

      case 'shape':
        return renderShapeElement();

      case 'number':
        return renderNumberElement();

      default:
        return null;
    }
  };

  // Rendu pour les images (animaux, espace, musique)
  const renderImageElement = () => {
    const svgSize = size - 16;
    const assetName = element.displayAsset;

    // Animaux de ferme
    if (assetName === 'cow') return <CowSVG size={svgSize} />;
    if (assetName === 'pig') return <PigSVG size={svgSize} />;
    if (assetName === 'chicken') return <ChickenSVG size={svgSize} />;
    if (assetName === 'sheep') return <SheepSVG size={svgSize} />;
    if (assetName === 'horse') return <HorseSVG size={svgSize} />;

    // Éléments d'espace
    if (assetName === 'rocket') return <RocketSVG size={svgSize} />;
    if (assetName === 'moon') return <MoonSVG size={svgSize} />;
    if (assetName === 'star') return <StarSpaceSVG size={svgSize} />;
    if (assetName === 'planet') return <PlanetSVG size={svgSize} />;
    if (assetName === 'alien') return <AlienSVG size={svgSize} />;

    // Éléments musicaux
    if (assetName === 'note') return <NoteSVG size={svgSize} />;
    if (assetName === 'doubleNote') return <DoubleNoteSVG size={svgSize} />;
    if (assetName === 'clef') return <ClefSVG size={svgSize} />;
    if (assetName === 'drum') return <DrumSVG size={svgSize} />;

    return null;
  };

  // Rendu pour les couleurs (cercles de couleur)
  const renderColorElement = () => {
    const colorSize = size - 16;
    return (
      <View
        style={[
          styles.colorCircle,
          {
            backgroundColor: element.displayAsset,
            width: colorSize,
            height: colorSize,
            borderRadius: colorSize / 2,
          },
        ]}
      />
    );
  };

  // Rendu pour les formes géométriques
  const renderShapeElement = () => {
    const shapeSize = size - 16;
    // Utiliser element.color si disponible, sinon displayAsset (rétrocompatibilité)
    const color = element.color || element.displayAsset;
    const rotation = element.rotation || 0;
    // Utiliser element.shape si disponible, sinon element.value (rétrocompatibilité)
    const shapeType = element.shape || element.value;

    switch (shapeType) {
      case 'circle':
        return <CircleSVG size={shapeSize} color={color} rotation={rotation} />;
      case 'square':
        return <SquareSVG size={shapeSize} color={color} rotation={rotation} />;
      case 'triangle':
        return <TriangleSVG size={shapeSize} color={color} rotation={rotation} />;
      case 'diamond':
        return <DiamondSVG size={shapeSize} color={color} rotation={rotation} />;
      default:
        return null;
    }
  };

  // Rendu pour les nombres
  const renderNumberElement = () => {
    const fontSize = size * 0.5;
    return (
      <Text style={[styles.numberText, { fontSize }]}>{element.value}</Text>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size },
        isHighlighted && styles.highlighted,
        pulseStyle,
      ]}
      accessibilityLabel={element.label || `Élément ${index + 1}`}
    >
      {renderContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ELEMENT_COLORS.white,
    borderRadius: DIMENSIONS.sequenceElement.borderRadius,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  highlighted: {
    borderWidth: 3,
    borderColor: ELEMENT_COLORS.highlight,
  },
  colorCircle: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  numberText: {
    fontWeight: 'bold',
    color: ELEMENT_COLORS.text,
  },
});
