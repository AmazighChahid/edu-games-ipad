/**
 * Onboarding Screen
 * Carousel de 5 slides pour présenter l'app
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ViewToken } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/store';
import { OnboardingSlide, OnboardingPageControl } from '@/components/onboarding';
import { AuthButton } from '@/components/auth';
import { colors } from '@/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: 'welcome',
    emoji: '🦉',
    title: 'Bienvenue !',
    subtitle: 'Je suis Piou, ton guide',
    description: 'Ensemble, on va apprendre plein de choses en s\'amusant !',
  },
  {
    id: 'games',
    emoji: '🎮',
    title: 'Des jeux éducatifs',
    subtitle: 'Logique, mémoire, maths...',
    description: 'Plus de 12 activités pour développer tes compétences.',
  },
  {
    id: 'method',
    emoji: '💡',
    title: 'Apprends à réfléchir',
    subtitle: 'Pas juste des bonnes réponses',
    description: 'On t\'apprend LA MÉTHODE pour résoudre les problèmes.',
  },
  {
    id: 'profiles',
    emoji: '👨‍👩‍👧‍👦',
    title: 'Toute la famille',
    subtitle: 'Chacun son profil',
    description: 'Plusieurs enfants peuvent jouer avec leur propre progression.',
  },
  {
    id: 'start',
    emoji: '🚀',
    title: 'C\'est parti !',
    subtitle: 'Crée ton compte pour commencer',
    description: '',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }, [currentIndex]);

  const handleGetStarted = useCallback(() => {
    completeOnboarding();
    router.replace('/(auth)/signup' as Href);
  }, [completeOnboarding, router]);

  const handleLogin = useCallback(() => {
    completeOnboarding();
    router.replace('/(auth)/login' as Href);
  }, [completeOnboarding, router]);

  const handleSkip = useCallback(() => {
    completeOnboarding();
    router.replace('/(auth)/login' as Href);
  }, [completeOnboarding, router]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <OnboardingSlide
            emoji={item.emoji}
            title={item.title}
            subtitle={item.subtitle}
            description={item.description}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <OnboardingPageControl count={SLIDES.length} currentIndex={currentIndex} />

        <View style={styles.buttons}>
          {isLastSlide ? (
            <>
              <AuthButton
                label="Créer mon compte"
                onPress={handleGetStarted}
                variant="primary"
              />
              <AuthButton
                label="J'ai déjà un compte"
                onPress={handleLogin}
                variant="ghost"
              />
            </>
          ) : (
            <View style={styles.navigationButtons}>
              <AuthButton
                label="Passer"
                onPress={handleSkip}
                variant="ghost"
              />
              <AuthButton
                label="Suivant"
                onPress={handleNext}
                variant="primary"
                icon="→"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  buttons: {
    gap: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
