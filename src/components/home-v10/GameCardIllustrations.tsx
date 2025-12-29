/**
 * GameCardIllustrations - Illustrations SVG pour les cartes de jeu
 * Extrait de GameCardV10.tsx pour réduire la taille du fichier principal
 */

import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Video, ResizeMode } from 'expo-av';
import { illustrationStyles as styles } from './GameCardStyles';

// Types pour les thèmes de widget Edoki
export type EdokiTheme =
  | 'barres' | 'fuseaux' | 'chiffres' | 'plage' | 'numberland' | 'nouveaux' | 'hanoi' | 'video'
  | 'suites-logiques' | 'labyrinthe' | 'balance' | 'sudoku' | 'memory' | 'tangram'
  | 'logix-grid' | 'mots-croises' | 'math-blocks' | 'matrices-magiques' | 'conteur-curieux'
  | 'embouteillage' | 'fabrique-reactions' | 'chasseur-papillons';

// ========================================
// ILLUSTRATIONS THÉMATIQUES
// ========================================

// Barres Numériques - Version améliorée avec SVG
const BarresIllustration = memo(() => (
  <View style={styles.illustrationContainer}>
    <Svg width={380} height={260} viewBox="0 0 380 260">
      <Defs>
        {/* Gradients pour les blocs */}
        <SvgLinearGradient id="barRedGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#EF5350" stopOpacity="1" />
          <Stop offset="1" stopColor="#C62828" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="barBlueGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#42A5F5" stopOpacity="1" />
          <Stop offset="1" stopColor="#1565C0" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="barGreenGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#66BB6A" stopOpacity="1" />
          <Stop offset="1" stopColor="#2E7D32" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="barYellowGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFEE58" stopOpacity="1" />
          <Stop offset="1" stopColor="#F9A825" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="numberBadgeGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#81C784" stopOpacity="1" />
          <Stop offset="1" stopColor="#4CAF50" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Rangée 2 */}
      <Rect x="30" y="40" width="50" height="50" rx="12" fill="url(#numberBadgeGradient)" />
      <Rect x="33" y="43" width="44" height="8" rx="4" fill="rgba(255,255,255,0.3)" />
      <Path d="M55 55 Q60 55 60 65 L60 75 L50 75 L50 65 Q50 60 55 60 L55 55 M45 75 L65 75" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      {/* Blocs pour 2 */}
      <Rect x="95" y="45" width="42" height="40" rx="8" fill="url(#barRedGradient)" />
      <Rect x="98" y="48" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
      <Rect x="145" y="45" width="42" height="40" rx="8" fill="url(#barBlueGradient)" />
      <Rect x="148" y="48" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />

      {/* Rangée 3 */}
      <Rect x="30" y="105" width="50" height="50" rx="12" fill="url(#numberBadgeGradient)" />
      <Rect x="33" y="108" width="44" height="8" rx="4" fill="rgba(255,255,255,0.3)" />
      <Path d="M45 120 Q55 115 65 120 Q65 130 55 135 Q45 140 55 145 L65 145" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Blocs pour 3 */}
      <Rect x="95" y="110" width="42" height="40" rx="8" fill="url(#barYellowGradient)" />
      <Rect x="98" y="113" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
      <Rect x="145" y="110" width="42" height="40" rx="8" fill="url(#barGreenGradient)" />
      <Rect x="148" y="113" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
      <Rect x="195" y="110" width="42" height="40" rx="8" fill="url(#barRedGradient)" />
      <Rect x="198" y="113" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />

      {/* Rangée 4 */}
      <Rect x="30" y="170" width="50" height="50" rx="12" fill="url(#numberBadgeGradient)" />
      <Rect x="33" y="173" width="44" height="8" rx="4" fill="rgba(255,255,255,0.3)" />
      <Path d="M50 185 L50 200 L60 200 M60 180 L60 210" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      {/* Blocs pour 4 */}
      <Rect x="95" y="175" width="42" height="40" rx="8" fill="url(#barBlueGradient)" />
      <Rect x="98" y="178" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
      <Rect x="145" y="175" width="42" height="40" rx="8" fill="url(#barYellowGradient)" />
      <Rect x="148" y="178" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
      <Rect x="195" y="175" width="42" height="40" rx="8" fill="url(#barGreenGradient)" />
      <Rect x="198" y="178" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
      <Rect x="245" y="175" width="42" height="40" rx="8" fill="url(#barRedGradient)" />
      <Rect x="248" y="178" width="36" height="6" rx="3" fill="rgba(255,255,255,0.35)" />

      {/* Petites étoiles décoratives */}
      <Path d="M320 60 L323 68 L320 76 L317 68 Z" fill="#FFD54F" />
      <Path d="M340 120 L342 126 L340 132 L338 126 Z" fill="#FFD54F" />
      <Path d="M310 180 L313 188 L310 196 L307 188 Z" fill="#FFD54F" />
    </Svg>
  </View>
));
BarresIllustration.displayName = 'BarresIllustration';

// Les Fuseaux - Version améliorée avec SVG
const FuseauxIllustration = memo(() => (
  <View style={styles.fuseauxContainer}>
    <Svg width={420} height={280} viewBox="0 0 420 280">
      <Defs>
        <SvgLinearGradient id="fuseauCardGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#F5F5F5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="fuseauBoxGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#455A64" stopOpacity="1" />
          <Stop offset="1" stopColor="#37474F" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="stickWoodGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#D4A574" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#E8C9A8" stopOpacity="1" />
          <Stop offset="1" stopColor="#D4A574" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Carte 1 */}
      <Rect x="40" y="60" width="100" height="160" rx="16" fill="url(#fuseauCardGradient)" />
      <Rect x="43" y="63" width="94" height="10" rx="5" fill="rgba(0,0,0,0.03)" />
      {/* Chiffre 1 - Orange */}
      <Path d="M85 85 L95 85 L95 125 L85 125 Z" fill="#F5A623" />
      <Rect x="80" y="120" width="25" height="8" rx="2" fill="#F5A623" />
      {/* Point */}
      <Rect x="87" y="138" width="10" height="10" rx="5" fill="#666666" />
      {/* Boîte avec fuseau */}
      <Rect x="45" y="160" width="90" height="55" rx="8" fill="url(#fuseauBoxGradient)" />
      <Rect x="48" y="163" width="84" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      {/* Fuseau unique */}
      <Rect x="86" y="175" width="8" height="35" rx="4" fill="url(#stickWoodGradient)" />
      <Rect x="88" y="178" width="2" height="30" fill="rgba(255,255,255,0.3)" />

      {/* Carte 2 */}
      <Rect x="160" y="60" width="100" height="160" rx="16" fill="url(#fuseauCardGradient)" />
      <Rect x="163" y="63" width="94" height="10" rx="5" fill="rgba(0,0,0,0.03)" />
      {/* Chiffre 2 - Orange */}
      <Path d="M195 85 Q220 85 220 100 Q220 110 200 115 L195 120 L220 120 L220 128 L190 128 L190 118 Q215 110 215 100 Q215 92 200 92 L195 92 Z" fill="#F5A623" />
      {/* Points */}
      <Rect x="197" y="138" width="10" height="10" rx="5" fill="#666666" />
      <Rect x="213" y="138" width="10" height="10" rx="5" fill="#666666" />
      {/* Boîte avec fuseaux */}
      <Rect x="165" y="160" width="90" height="55" rx="8" fill="url(#fuseauBoxGradient)" />
      <Rect x="168" y="163" width="84" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      {/* 2 Fuseaux */}
      <Rect x="196" y="175" width="8" height="35" rx="4" fill="url(#stickWoodGradient)" />
      <Rect x="198" y="178" width="2" height="30" fill="rgba(255,255,255,0.3)" />
      <Rect x="216" y="175" width="8" height="35" rx="4" fill="url(#stickWoodGradient)" />
      <Rect x="218" y="178" width="2" height="30" fill="rgba(255,255,255,0.3)" />

      {/* Carte 3 */}
      <Rect x="280" y="60" width="100" height="160" rx="16" fill="url(#fuseauCardGradient)" />
      <Rect x="283" y="63" width="94" height="10" rx="5" fill="rgba(0,0,0,0.03)" />
      {/* Chiffre 3 - Rose/Pink */}
      <Path d="M315 85 Q340 85 340 97 Q340 105 325 107 Q340 109 340 118 Q340 130 315 130 L310 130 L310 122 L315 122 Q332 122 332 118 Q332 112 320 112 L315 112 L315 105 L320 105 Q332 105 332 100 Q332 93 320 93 L310 93 L310 85 Z" fill="#E91E63" />
      {/* Points */}
      <Rect x="310" y="138" width="10" height="10" rx="5" fill="#666666" />
      <Rect x="326" y="138" width="10" height="10" rx="5" fill="#666666" />
      <Rect x="342" y="138" width="10" height="10" rx="5" fill="#666666" />
      {/* Boîte avec fuseaux */}
      <Rect x="285" y="160" width="90" height="55" rx="8" fill="url(#fuseauBoxGradient)" />
      <Rect x="288" y="163" width="84" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      {/* 3 Fuseaux */}
      <Rect x="306" y="175" width="8" height="35" rx="4" fill="url(#stickWoodGradient)" />
      <Rect x="308" y="178" width="2" height="30" fill="rgba(255,255,255,0.3)" />
      <Rect x="326" y="175" width="8" height="35" rx="4" fill="url(#stickWoodGradient)" />
      <Rect x="328" y="178" width="2" height="30" fill="rgba(255,255,255,0.3)" />
      <Rect x="346" y="175" width="8" height="35" rx="4" fill="url(#stickWoodGradient)" />
      <Rect x="348" y="178" width="2" height="30" fill="rgba(255,255,255,0.3)" />

      {/* Étoiles décoratives */}
      <Path d="M25 100 L28 108 L25 116 L22 108 Z" fill="#FFD54F" />
      <Path d="M395 140 L398 148 L395 156 L392 148 Z" fill="#FFD54F" />
    </Svg>
  </View>
));
FuseauxIllustration.displayName = 'FuseauxIllustration';

// Chiffres Rugueux - Version améliorée avec SVG et texture
const ChiffresIllustration = memo(() => (
  <View style={styles.chiffresContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="sandpaperGreen1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#66BB6A" stopOpacity="1" />
          <Stop offset="1" stopColor="#43A047" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="sandpaperGreen2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#81C784" stopOpacity="1" />
          <Stop offset="1" stopColor="#4CAF50" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="sandpaperGreen3" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#A5D6A7" stopOpacity="1" />
          <Stop offset="1" stopColor="#66BB6A" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Carte 1 - Inclinée à gauche */}
      <Rect x="30" y="70" width="120" height="160" rx="16" fill="url(#sandpaperGreen1)" transform="rotate(-8 90 150)" />
      <Rect x="33" y="73" width="114" height="12" rx="6" fill="rgba(255,255,255,0.2)" transform="rotate(-8 90 150)" />
      {/* Texture rugueuse simulée */}
      <Rect x="40" y="85" width="100" height="130" rx="10" fill="rgba(255,255,255,0.05)" transform="rotate(-8 90 150)" />
      {/* Chiffre 1 en relief */}
      <Path d="M80 110 L95 110 L95 190 L80 190 Z" fill="#FFFFFF" transform="rotate(-8 90 150)" />
      <Rect x="70" y="182" width="45" height="12" rx="4" fill="#FFFFFF" transform="rotate(-8 90 150)" />
      {/* Ombre du chiffre */}
      <Path d="M82 112 L97 112 L97 192 L82 192 Z" fill="rgba(0,0,0,0.1)" transform="rotate(-8 90 150)" />

      {/* Carte 2 - Droite */}
      <Rect x="140" y="60" width="120" height="160" rx="16" fill="url(#sandpaperGreen2)" />
      <Rect x="143" y="63" width="114" height="12" rx="6" fill="rgba(255,255,255,0.2)" />
      <Rect x="150" y="75" width="100" height="130" rx="10" fill="rgba(255,255,255,0.05)" />
      {/* Chiffre 2 en relief */}
      <Path d="M175 100 Q215 95 215 120 Q215 140 190 155 L175 170 L215 170 L215 185 L160 185 L160 165 Q200 145 200 125 Q200 110 185 110 L175 110 Z" fill="#FFFFFF" />
      {/* Ombre */}
      <Path d="M177 102 Q217 97 217 122 Q217 142 192 157" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="3" />

      {/* Carte 3 - Inclinée à droite */}
      <Rect x="250" y="70" width="120" height="160" rx="16" fill="url(#sandpaperGreen3)" transform="rotate(8 310 150)" />
      <Rect x="253" y="73" width="114" height="12" rx="6" fill="rgba(255,255,255,0.2)" transform="rotate(8 310 150)" />
      <Rect x="260" y="85" width="100" height="130" rx="10" fill="rgba(255,255,255,0.05)" transform="rotate(8 310 150)" />
      {/* Chiffre 3 en relief */}
      <Path d="M290 100 Q330 100 330 120 Q330 135 310 140 Q330 145 330 160 Q330 185 290 185 L280 185 L280 170 L290 170 Q315 170 315 158 Q315 148 300 148 L290 148 L290 133 L300 133 Q315 133 315 123 Q315 113 295 113 L280 113 L280 100 Z" fill="#FFFFFF" transform="rotate(8 310 150)" />

      {/* Main d'enfant stylisée touchant le chiffre */}
      <Path d="M350 200 Q360 190 365 195 Q370 185 378 190 Q385 182 392 188 Q398 195 395 205 L380 230 L350 220 Z" fill="#FFCCBC" />
      <Path d="M352 202 Q360 195 365 198" stroke="#FFAB91" strokeWidth="1" fill="none" />

      {/* Étoiles décoratives */}
      <Path d="M20 120 L23 128 L20 136 L17 128 Z" fill="#FFD54F" />
      <Path d="M380 80 L383 88 L380 96 L377 88 Z" fill="#FFD54F" />
    </Svg>
  </View>
));
ChiffresIllustration.displayName = 'ChiffresIllustration';

// La Plage des Chiffres - Version améliorée avec scène de plage SVG
const PlageIllustration = memo(() => (
  <View style={styles.plageContainer}>
    <Svg width={420} height={300} viewBox="0 0 420 300">
      <Defs>
        <SvgLinearGradient id="sandGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F5DEB3" stopOpacity="1" />
          <Stop offset="1" stopColor="#DEB887" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="seaGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#64B5F6" stopOpacity="1" />
          <Stop offset="1" stopColor="#42A5F5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#90CAF9" stopOpacity="0.8" />
          <Stop offset="1" stopColor="#64B5F6" stopOpacity="0.6" />
        </SvgLinearGradient>
        <SvgLinearGradient id="plageCardGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#66BB6A" stopOpacity="1" />
          <Stop offset="1" stopColor="#43A047" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Ciel */}
      <Rect x="0" y="0" width="420" height="100" fill="#87CEEB" />

      {/* Soleil */}
      <Rect x="340" y="20" width="50" height="50" rx="25" fill="#FFD54F" />
      <Rect x="345" y="25" width="40" height="15" rx="7" fill="rgba(255,255,255,0.4)" />

      {/* Mer */}
      <Rect x="0" y="80" width="420" height="60" fill="url(#seaGradient)" />
      {/* Vagues */}
      <Path d="M0 100 Q30 90 60 100 Q90 110 120 100 Q150 90 180 100 Q210 110 240 100 Q270 90 300 100 Q330 110 360 100 Q390 90 420 100 L420 140 L0 140 Z" fill="url(#waveGradient)" />
      <Path d="M0 115 Q25 108 50 115 Q75 122 100 115 Q125 108 150 115 Q175 122 200 115 Q225 108 250 115 Q275 122 300 115 Q325 108 350 115 Q375 122 400 115 L420 115 L420 140 L0 140 Z" fill="rgba(255,255,255,0.3)" />

      {/* Sable */}
      <Rect x="0" y="130" width="420" height="170" fill="url(#sandGradient)" />
      {/* Texture sable */}
      <Path d="M20 180 L25 180 M40 200 L45 200 M80 170 L85 170 M120 190 L125 190 M160 175 L165 175 M200 195 L205 195 M240 180 L245 180 M280 200 L285 200 M320 175 L325 175 M360 190 L365 190" stroke="rgba(139,90,43,0.2)" strokeWidth="2" strokeLinecap="round" />

      {/* Grand chiffre 2 dans le sable */}
      <Path d="M250 160 Q310 155 310 190 Q310 220 270 245 L250 265 L310 265 L310 280 L230 280 L230 255 Q290 225 290 195 Q290 175 265 175 L250 175 Z" fill="rgba(139,90,43,0.25)" />

      {/* Carte verte avec chiffre 2 */}
      <Rect x="80" y="155" width="100" height="130" rx="14" fill="url(#plageCardGradient)" />
      <Rect x="83" y="158" width="94" height="12" rx="6" fill="rgba(255,255,255,0.25)" />
      {/* Chiffre 2 blanc */}
      <Path d="M110 180 Q150 175 150 200 Q150 220 125 235 L110 250 L150 250 L150 265 L95 265 L95 245 Q135 220 135 205 Q135 190 120 190 L110 190 Z" fill="#FFFFFF" />

      {/* Crabe stylisé */}
      <Rect x="40" y="240" width="35" height="25" rx="12" fill="#E57373" />
      <Rect x="45" y="245" width="25" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
      {/* Pinces */}
      <Path d="M35 250 Q25 245 20 255 Q15 265 25 265 Q30 260 35 255" fill="#EF5350" />
      <Path d="M80 250 Q90 245 95 255 Q100 265 90 265 Q85 260 80 255" fill="#EF5350" />
      {/* Yeux */}
      <Rect x="48" y="235" width="6" height="10" rx="3" fill="#E57373" />
      <Rect x="61" y="235" width="6" height="10" rx="3" fill="#E57373" />
      <Rect x="49" y="233" width="4" height="4" rx="2" fill="#333" />
      <Rect x="62" y="233" width="4" height="4" rx="2" fill="#333" />
      {/* Pattes */}
      <Path d="M42 260 L35 275 M48 262 L42 275 M67 262 L73 275 M73 260 L80 275" stroke="#C62828" strokeWidth="3" strokeLinecap="round" />

      {/* Coquillages */}
      <Path d="M320 250 Q330 240 340 250 Q345 260 335 270 Q325 265 320 250" fill="#FFCCBC" />
      <Path d="M325 252 L332 258 M330 250 L335 260" stroke="#FFAB91" strokeWidth="1" />

      <Path d="M280 270 Q290 262 298 272 Q302 280 293 286 Q283 282 280 270" fill="#B0BEC5" />
      <Path d="M283 272 L290 278" stroke="#90A4AE" strokeWidth="1" />

      {/* Étoile de mer */}
      <Path d="M360 260 L365 250 L370 260 L380 255 L375 265 L385 270 L375 275 L380 285 L370 280 L365 290 L360 280 L350 285 L355 275 L345 270 L355 265 L350 255 Z" fill="#FF8A65" />
      <Rect x="362" y="267" width="6" height="6" rx="3" fill="rgba(255,255,255,0.3)" />

      {/* Petites vagues d'écume sur le sable */}
      <Path d="M0 135 Q20 130 40 135 Q60 140 80 135 Q100 130 120 135" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" />
    </Svg>
  </View>
));
PlageIllustration.displayName = 'PlageIllustration';

// Numberland - Version améliorée avec paysage fantastique SVG
const NumberlandIllustration = memo(() => (
  <View style={styles.numberlandContainer}>
    <Svg width={420} height={300} viewBox="0 0 420 300">
      <Defs>
        <SvgLinearGradient id="skyNumbGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#87CEEB" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#B8D4E3" stopOpacity="1" />
          <Stop offset="1" stopColor="#C9D4B8" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8FA876" stopOpacity="1" />
          <Stop offset="0.3" stopColor="#7A9968" stopOpacity="1" />
          <Stop offset="1" stopColor="#5A7D4A" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="mountain2Gradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6B8E5A" stopOpacity="1" />
          <Stop offset="1" stopColor="#4A6D3A" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="grassNumbGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7BC74D" stopOpacity="1" />
          <Stop offset="1" stopColor="#5BAE3D" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="treeGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4CAF50" stopOpacity="1" />
          <Stop offset="1" stopColor="#2E7D32" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="number3Gradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F48FB1" stopOpacity="1" />
          <Stop offset="1" stopColor="#E91E63" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Ciel */}
      <Rect x="0" y="0" width="420" height="300" fill="url(#skyNumbGradient)" />

      {/* Nuages */}
      <Path d="M50 50 Q70 35 90 50 Q110 35 130 50 Q115 60 100 55 Q80 65 60 55 Q45 60 50 50" fill="rgba(255,255,255,0.9)" />
      <Path d="M300 70 Q315 58 330 70 Q345 58 360 70 Q350 78 340 75 Q325 82 310 75 Q300 78 300 70" fill="rgba(255,255,255,0.85)" />

      {/* Montagnes lointaines */}
      <Path d="M-20 180 L60 80 L140 180 Z" fill="url(#mountainGradient)" />
      <Path d="M100 180 L180 60 L260 180 Z" fill="url(#mountain2Gradient)" />
      <Path d="M220 180 L320 90 L420 180 Z" fill="url(#mountainGradient)" />
      {/* Neige sur les sommets */}
      <Path d="M60 80 L45 105 L75 105 Z" fill="rgba(255,255,255,0.7)" />
      <Path d="M180 60 L165 85 L195 85 Z" fill="rgba(255,255,255,0.8)" />
      <Path d="M320 90 L305 115 L335 115 Z" fill="rgba(255,255,255,0.7)" />

      {/* Collines */}
      <Path d="M0 200 Q100 150 200 200 Q300 150 400 200 L420 200 L420 300 L0 300 Z" fill="url(#grassNumbGradient)" />
      <Path d="M0 220 Q80 190 160 220 Q240 180 320 220 Q380 200 420 220 L420 300 L0 300 Z" fill="#6BC74D" />

      {/* Arbres stylisés */}
      {/* Arbre gauche */}
      <Rect x="55" y="210" width="10" height="30" rx="2" fill="#8B5A2B" />
      <Path d="M60 150 L30 210 L90 210 Z" fill="url(#treeGradient)" />
      <Path d="M60 170 L35 220 L85 220 Z" fill="#43A047" />
      <Path d="M35 212 L85 212" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

      {/* Arbre droite */}
      <Rect x="355" y="200" width="10" height="35" rx="2" fill="#6B4423" />
      <Path d="M360 130 L325 200 L395 200 Z" fill="url(#treeGradient)" />
      <Path d="M360 155 L330 210 L390 210 Z" fill="#388E3C" />

      {/* Petit arbre */}
      <Rect x="280" y="230" width="6" height="20" rx="2" fill="#8B5A2B" />
      <Path d="M283 195 L265 230 L301 230 Z" fill="#66BB6A" />

      {/* Grand chiffre 3 au centre */}
      <Path d="M170 140 Q230 135 230 170 Q230 195 195 205 Q230 215 230 245 Q230 285 170 285 L155 285 L155 265 L170 265 Q210 265 210 248 Q210 230 185 230 L170 230 L170 210 L185 210 Q210 210 210 195 Q210 175 180 175 L155 175 L155 140 Z" fill="url(#number3Gradient)" />
      {/* Ombre du 3 */}
      <Path d="M173 143 Q233 138 233 173" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="4" />
      {/* Reflet */}
      <Path d="M165 150 Q200 145 210 165" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />

      {/* Fleurs */}
      <Rect x="120" y="260" width="8" height="8" rx="4" fill="#FF80AB" />
      <Rect x="200" y="270" width="6" height="6" rx="3" fill="#FFD54F" />
      <Rect x="320" y="255" width="8" height="8" rx="4" fill="#E040FB" />

      {/* Papillons */}
      <Path d="M100 120 Q95 115 100 110 Q105 115 100 120 M100 120 Q105 115 110 120 Q105 125 100 120" fill="#FF80AB" />
      <Path d="M380 150 Q375 145 380 140 Q385 145 380 150 M380 150 Q385 145 390 150 Q385 155 380 150" fill="#CE93D8" />
    </Svg>
  </View>
));
NumberlandIllustration.displayName = 'NumberlandIllustration';

// Nouveaux Jeux - Version améliorée avec SVG dynamique
const NouveauxIllustration = memo(() => (
  <View style={styles.nouveauxContainer}>
    <Svg width={420} height={300} viewBox="0 0 420 300">
      <Defs>
        <SvgLinearGradient id="rayGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="rgba(255,255,255,0.3)" stopOpacity="1" />
          <Stop offset="1" stopColor="rgba(255,255,255,0)" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="badgeGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#EF5350" stopOpacity="1" />
          <Stop offset="1" stopColor="#C62828" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="cardCircleGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFDE7" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFF8E1" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Rayons de lumière depuis le centre */}
      <Path d="M210 150 L180 0 L240 0 Z" fill="url(#rayGradient)" />
      <Path d="M210 150 L0 100 L0 180 Z" fill="url(#rayGradient)" />
      <Path d="M210 150 L420 80 L420 160 Z" fill="url(#rayGradient)" />
      <Path d="M210 150 L150 300 L270 300 Z" fill="url(#rayGradient)" />
      <Path d="M210 150 L50 0 L120 0 Z" fill="url(#rayGradient)" />
      <Path d="M210 150 L300 0 L370 0 Z" fill="url(#rayGradient)" />
      <Path d="M210 150 L0 250 L80 300 Z" fill="url(#rayGradient)" />
      <Path d="M210 150 L340 300 L420 250 Z" fill="url(#rayGradient)" />

      {/* Badge "NOUVEAUX JEUX" */}
      <Rect x="-10" y="35" width="220" height="45" rx="4" fill="url(#badgeGradient)" transform="rotate(-5 100 55)" />
      <Rect x="-5" y="38" width="210" height="8" rx="4" fill="rgba(255,255,255,0.2)" transform="rotate(-5 100 55)" />
      {/* Texte simulé par des rectangles */}
      <Rect x="25" y="50" width="160" height="18" rx="4" fill="rgba(255,255,255,0.9)" transform="rotate(-5 100 55)" />

      {/* Étoiles scintillantes */}
      <Path d="M80 100 L85 115 L80 130 L75 115 Z" fill="#FFFFFF" />
      <Path d="M80 100 L95 115 L80 130 L65 115 Z" fill="rgba(255,255,255,0.5)" />

      <Path d="M350 80 L354 92 L350 104 L346 92 Z" fill="#FFD54F" />

      <Path d="M120 180 L123 189 L120 198 L117 189 Z" fill="#FFFFFF" />

      <Path d="M320 170 L324 182 L320 194 L316 182 Z" fill="#FFD54F" />

      <Path d="M180 90 L183 99 L180 108 L177 99 Z" fill="rgba(255,255,255,0.8)" />

      <Path d="M280 130 L283 139 L280 148 L277 139 Z" fill="#FFFFFF" />

      {/* Cartes de prévisualisation circulaires */}
      {/* Carte 1 - Puzzle */}
      <Rect x="60" y="190" width="90" height="90" rx="45" fill="url(#cardCircleGradient)" />
      <Rect x="65" y="195" width="80" height="80" rx="40" fill="none" stroke="#FFECB3" strokeWidth="6" />
      <Rect x="68" y="198" width="74" height="20" rx="10" fill="rgba(255,255,255,0.5)" />
      {/* Icône puzzle stylisée */}
      <Path d="M90 225 L90 245 L100 245 L100 235 Q105 235 105 240 Q105 245 100 245 L110 245 L110 225 L100 225 L100 235 Q95 235 95 230 Q95 225 100 225 Z" fill="#9C27B0" />
      <Path d="M92 227 L92 233" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

      {/* Carte 2 - Chiffres */}
      <Rect x="165" y="190" width="90" height="90" rx="45" fill="url(#cardCircleGradient)" />
      <Rect x="170" y="195" width="80" height="80" rx="40" fill="none" stroke="#FFECB3" strokeWidth="6" />
      <Rect x="173" y="198" width="74" height="20" rx="10" fill="rgba(255,255,255,0.5)" />
      {/* Icône 123 */}
      <Path d="M195 230 L200 230 L200 250 L195 250 Z" fill="#2196F3" />
      <Path d="M207 225 Q217 225 217 235 L207 245 L217 245 L217 250 L202 250 L202 243 L212 233 Q212 230 207 230 Z" fill="#2196F3" />
      <Path d="M222 225 Q232 225 232 232 Q232 237 227 238 Q232 240 232 245 Q232 252 222 252 L220 252 L220 248 L222 248 Q228 248 228 245 Q228 241 224 241 L222 241 L222 237 L224 237 Q228 237 228 234 Q228 229 224 229 L220 229 L220 225 Z" fill="#2196F3" />

      {/* Carte 3 - Horloge */}
      <Rect x="270" y="190" width="90" height="90" rx="45" fill="url(#cardCircleGradient)" />
      <Rect x="275" y="195" width="80" height="80" rx="40" fill="none" stroke="#FFECB3" strokeWidth="6" />
      <Rect x="278" y="198" width="74" height="20" rx="10" fill="rgba(255,255,255,0.5)" />
      {/* Icône horloge */}
      <Rect x="295" y="220" width="40" height="40" rx="20" fill="none" stroke="#FF9800" strokeWidth="4" />
      <Path d="M315 240 L315 228 M315 240 L325 245" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />

      {/* Confettis */}
      <Rect x="40" y="140" width="8" height="8" rx="2" fill="#FF80AB" transform="rotate(25 44 144)" />
      <Rect x="380" y="120" width="6" height="6" rx="2" fill="#80DEEA" transform="rotate(-15 383 123)" />
      <Rect x="300" y="60" width="7" height="7" rx="2" fill="#AED581" transform="rotate(40 303 63)" />
      <Rect x="50" y="70" width="5" height="5" rx="1" fill="#FFD54F" transform="rotate(-30 52 72)" />
    </Svg>
  </View>
));
NouveauxIllustration.displayName = 'NouveauxIllustration';

// Tour de Hanoi - Illustration vectorielle SVG
const HanoiIllustration = memo(() => (
  <View style={styles.hanoiContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        {/* Gradient pour les tours en bois */}
        <SvgLinearGradient id="towerWoodGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#8B5A2B" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#A0522D" stopOpacity="1" />
          <Stop offset="1" stopColor="#8B5A2B" stopOpacity="1" />
        </SvgLinearGradient>
        {/* Gradient pour la base en bois */}
        <SvgLinearGradient id="baseWoodGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#A0522D" stopOpacity="1" />
          <Stop offset="1" stopColor="#6B3D1E" stopOpacity="1" />
        </SvgLinearGradient>
        {/* Gradients pour les disques */}
        <SvgLinearGradient id="diskRedGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E74C3C" stopOpacity="1" />
          <Stop offset="1" stopColor="#C0392B" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="diskBlueGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3498DB" stopOpacity="1" />
          <Stop offset="1" stopColor="#2980B9" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="diskGreenGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#27AE60" stopOpacity="1" />
          <Stop offset="1" stopColor="#1E8449" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="diskOrangeGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F39C12" stopOpacity="1" />
          <Stop offset="1" stopColor="#D68910" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Base plateau 3D - surface supérieure */}
      <Rect x="40" y="215" width="320" height="28" rx="6" fill="url(#baseWoodGradient)" />
      {/* Base plateau 3D - face avant (profondeur) */}
      <Rect x="45" y="243" width="310" height="14" rx="3" fill="#5D3A1E" />
      {/* Reflet subtil sur la base */}
      <Rect x="50" y="218" width="300" height="4" rx="2" fill="rgba(255,255,255,0.15)" />

      {/* Tour 1 (gauche) */}
      <Rect x="94" y="95" width="12" height="120" rx="6" fill="url(#towerWoodGradient)" />
      {/* Tour 2 (centre) */}
      <Rect x="194" y="95" width="12" height="120" rx="6" fill="url(#towerWoodGradient)" />
      {/* Tour 3 (droite) */}
      <Rect x="294" y="95" width="12" height="120" rx="6" fill="url(#towerWoodGradient)" />

      {/* Disques sur la tour 1 (empilés du plus grand au plus petit) */}
      {/* Grand disque orange (bas) */}
      <Rect x="50" y="185" width="100" height="26" rx="13" fill="url(#diskOrangeGradient)" />
      {/* Reflet sur disque orange */}
      <Rect x="55" y="188" width="90" height="6" rx="3" fill="rgba(255,255,255,0.25)" />

      {/* Disque rouge */}
      <Rect x="60" y="157" width="80" height="26" rx="13" fill="url(#diskRedGradient)" />
      {/* Reflet sur disque rouge */}
      <Rect x="65" y="160" width="70" height="6" rx="3" fill="rgba(255,255,255,0.25)" />

      {/* Disque bleu */}
      <Rect x="70" y="129" width="60" height="26" rx="13" fill="url(#diskBlueGradient)" />
      {/* Reflet sur disque bleu */}
      <Rect x="75" y="132" width="50" height="6" rx="3" fill="rgba(255,255,255,0.25)" />

      {/* Petit disque vert (haut) */}
      <Rect x="80" y="101" width="40" height="26" rx="13" fill="url(#diskGreenGradient)" />
      {/* Reflet sur disque vert */}
      <Rect x="85" y="104" width="30" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
    </Svg>
  </View>
));
HanoiIllustration.displayName = 'HanoiIllustration';

// Video Background Test
const VideoIllustration = memo(() => (
  <Video
    source={require('../../../assets/videos/test-background.mp4')}
    style={styles.videoBackground}
    resizeMode={ResizeMode.COVER}
    shouldPlay
    isLooping
    isMuted
  />
));
VideoIllustration.displayName = 'VideoIllustration';

// ========================================
// NOUVELLES ILLUSTRATIONS PAR JEU
// ========================================

// Suites Logiques - Robot Pixel amélioré avec séquence de formes
const SuitesLogiquesIllustration = memo(() => (
  <View style={styles.suitesContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="robotBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7C8CE0" stopOpacity="1" />
          <Stop offset="1" stopColor="#5B6BC0" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="robotHeadGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#9FA8DA" stopOpacity="1" />
          <Stop offset="1" stopColor="#7986CB" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="shapeRedGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FF8A80" stopOpacity="1" />
          <Stop offset="1" stopColor="#FF5252" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="shapeTealGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#64FFDA" stopOpacity="1" />
          <Stop offset="1" stopColor="#1DE9B6" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="shapeYellowGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFF8D" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFD740" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Fond décoratif avec motif circuit */}
      <Path d="M20 50 L20 30 L60 30" stroke="rgba(91,107,192,0.2)" strokeWidth="2" fill="none" />
      <Path d="M380 40 L380 60 L340 60" stroke="rgba(91,107,192,0.2)" strokeWidth="2" fill="none" />
      <Path d="M30 250 L50 250 L50 270" stroke="rgba(91,107,192,0.2)" strokeWidth="2" fill="none" />
      <Rect x="18" y="28" width="6" height="6" rx="3" fill="rgba(91,107,192,0.3)" />
      <Rect x="378" y="58" width="6" height="6" rx="3" fill="rgba(91,107,192,0.3)" />

      {/* Séquence de formes avec ombres et reflets */}
      {/* Carré rouge */}
      <Rect x="40" y="200" width="50" height="50" rx="10" fill="url(#shapeRedGradient)" />
      <Rect x="43" y="203" width="44" height="8" rx="4" fill="rgba(255,255,255,0.35)" />

      {/* Cercle turquoise */}
      <Rect x="110" y="200" width="50" height="50" rx="25" fill="url(#shapeTealGradient)" />
      <Path d="M120 215 Q135 205 150 215" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />

      {/* Carré jaune */}
      <Rect x="180" y="200" width="50" height="50" rx="10" fill="url(#shapeYellowGradient)" />
      <Rect x="183" y="203" width="44" height="8" rx="4" fill="rgba(255,255,255,0.4)" />

      {/* Cercle rouge */}
      <Rect x="250" y="200" width="50" height="50" rx="25" fill="url(#shapeRedGradient)" />
      <Path d="M260 215 Q275 205 290 215" stroke="rgba(255,255,255,0.35)" strokeWidth="3" fill="none" />

      {/* Carré mystère (à deviner) */}
      <Rect x="320" y="200" width="50" height="50" rx="10" fill="rgba(78,205,196,0.15)" strokeWidth="3" stroke="#4ECDC4" strokeDasharray="8,4" />
      <Path d="M335 220 L345 230 L355 220" stroke="#4ECDC4" strokeWidth="2" fill="none" />
      <Path d="M345 230 L345 240" stroke="#4ECDC4" strokeWidth="2" fill="none" />

      {/* Robot Pixel amélioré */}
      {/* Tête */}
      <Rect x="150" y="55" width="100" height="85" rx="14" fill="url(#robotHeadGradient)" />
      <Rect x="153" y="58" width="94" height="12" rx="6" fill="rgba(255,255,255,0.2)" />

      {/* Yeux avec effet lumineux */}
      <Rect x="168" y="82" width="24" height="24" rx="6" fill="#FFFFFF" />
      <Rect x="208" y="82" width="24" height="24" rx="6" fill="#FFFFFF" />
      <Rect x="173" y="87" width="14" height="14" rx="4" fill="#333" />
      <Rect x="213" y="87" width="14" height="14" rx="4" fill="#333" />
      {/* Reflets dans les yeux */}
      <Rect x="175" y="89" width="4" height="4" rx="2" fill="#FFFFFF" />
      <Rect x="215" y="89" width="4" height="4" rx="2" fill="#FFFFFF" />

      {/* Bouche LED */}
      <Rect x="175" y="115" width="50" height="8" rx="4" fill="rgba(0,0,0,0.2)" />
      <Rect x="180" y="117" width="8" height="4" rx="2" fill="#4ECDC4" />
      <Rect x="196" y="117" width="8" height="4" rx="2" fill="#4ECDC4" />
      <Rect x="212" y="117" width="8" height="4" rx="2" fill="#4ECDC4" />

      {/* Antenne */}
      <Rect x="195" y="35" width="10" height="25" rx="3" fill="#5B6BC0" />
      <Rect x="188" y="22" width="24" height="18" rx="9" fill="#FF6B6B" />
      <Rect x="191" y="25" width="18" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* Signal d'antenne */}
      <Path d="M175 18 Q200 5 225 18" stroke="rgba(255,107,107,0.4)" strokeWidth="2" fill="none" />
      <Path d="M180 10 Q200 0 220 10" stroke="rgba(255,107,107,0.3)" strokeWidth="2" fill="none" />

      {/* Corps */}
      <Rect x="158" y="145" width="84" height="55" rx="10" fill="url(#robotBodyGradient)" />
      <Rect x="161" y="148" width="78" height="10" rx="5" fill="rgba(255,255,255,0.15)" />

      {/* Panneau de contrôle */}
      <Rect x="170" y="160" width="60" height="30" rx="6" fill="rgba(0,0,0,0.15)" />
      {/* Boutons colorés */}
      <Rect x="178" y="167" width="14" height="14" rx="7" fill="#4ECDC4" />
      <Rect x="178" y="170" width="14" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="198" y="167" width="14" height="14" rx="7" fill="#FFE66D" />
      <Rect x="198" y="170" width="14" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="218" y="167" width="14" height="14" rx="7" fill="#FF6B6B" />
      <Rect x="218" y="170" width="14" height="4" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Bras */}
      <Rect x="135" y="155" width="20" height="8" rx="4" fill="#7986CB" />
      <Rect x="245" y="155" width="20" height="8" rx="4" fill="#7986CB" />
      <Rect x="125" y="150" width="12" height="18" rx="6" fill="#9FA8DA" />
      <Rect x="263" y="150" width="12" height="18" rx="6" fill="#9FA8DA" />
    </Svg>
  </View>
));
SuitesLogiquesIllustration.displayName = 'SuitesLogiquesIllustration';

// Labyrinthe - Écureuil Scout dans un mini-labyrinthe
const LabyrintheIllustration = memo(() => (
  <View style={styles.labyrintheContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="mazeWallGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#81C784" stopOpacity="1" />
          <Stop offset="1" stopColor="#4CAF50" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="squirrelBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#D4A574" stopOpacity="1" />
          <Stop offset="1" stopColor="#B8956C" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>
      {/* Murs du labyrinthe */}
      <Rect x="50" y="80" width="300" height="16" rx="4" fill="url(#mazeWallGradient)" />
      <Rect x="50" y="80" width="16" height="140" rx="4" fill="url(#mazeWallGradient)" />
      <Rect x="334" y="80" width="16" height="100" rx="4" fill="url(#mazeWallGradient)" />
      <Rect x="50" y="204" width="200" height="16" rx="4" fill="url(#mazeWallGradient)" />
      <Rect x="120" y="130" width="16" height="90" rx="4" fill="url(#mazeWallGradient)" />
      <Rect x="180" y="80" width="16" height="70" rx="4" fill="url(#mazeWallGradient)" />
      <Rect x="250" y="130" width="100" height="16" rx="4" fill="url(#mazeWallGradient)" />
      {/* Écureuil Scout */}
      <Rect x="270" y="165" width="40" height="35" rx="18" fill="url(#squirrelBodyGradient)" />
      <Rect x="278" y="150" width="24" height="24" rx="12" fill="url(#squirrelBodyGradient)" />
      {/* Oreilles */}
      <Path d="M280 155 L275 145 L285 150 Z" fill="#B8956C" />
      <Path d="M296 155 L301 145 L291 150 Z" fill="#B8956C" />
      {/* Yeux */}
      <Rect x="281" y="157" width="6" height="6" rx="3" fill="#333" />
      <Rect x="293" y="157" width="6" height="6" rx="3" fill="#333" />
      {/* Nez */}
      <Rect x="287" y="164" width="6" height="4" rx="2" fill="#8B6B5C" />
      {/* Queue touffue */}
      <Path d="M305 180 Q340 150 320 200 Q300 210 305 180" fill="#C49A6C" />
      {/* Noisette (objectif) */}
      <Rect x="80" y="160" width="20" height="24" rx="10" fill="#8B5A2B" />
      <Rect x="86" y="155" width="8" height="8" rx="4" fill="#6B4423" />
    </Svg>
  </View>
));
LabyrintheIllustration.displayName = 'LabyrintheIllustration';

// Balance - Chouette Libra avec balance
const BalanceIllustration = memo(() => (
  <View style={styles.balanceContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="balanceBeamGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFD54F" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFC107" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="owlBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8D6E63" stopOpacity="1" />
          <Stop offset="1" stopColor="#6D4C41" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>
      {/* Support de la balance */}
      <Rect x="190" y="200" width="20" height="60" fill="#5D4037" />
      <Rect x="170" y="250" width="60" height="12" rx="6" fill="#4E342E" />
      {/* Poutre */}
      <Rect x="80" y="190" width="240" height="12" rx="6" fill="url(#balanceBeamGradient)" />
      {/* Plateaux */}
      <Path d="M80 202 L60 240 L140 240 Z" fill="#FFA726" />
      <Path d="M320 202 L280 240 L360 240 Z" fill="#FFA726" />
      {/* Objets sur les plateaux */}
      <Rect x="85" y="215" width="30" height="20" rx="4" fill="#E57373" />
      <Rect x="305" y="215" width="20" height="20" rx="10" fill="#64B5F6" />
      <Rect x="330" y="215" width="20" height="20" rx="10" fill="#64B5F6" />
      {/* Chouette Libra (petite, au-dessus) */}
      <Rect x="175" y="120" width="50" height="45" rx="22" fill="url(#owlBodyGradient)" />
      <Rect x="180" y="100" width="40" height="35" rx="18" fill="url(#owlBodyGradient)" />
      {/* Oreilles/aigrettes */}
      <Path d="M180 105 L175 85 L190 100 Z" fill="#6D4C41" />
      <Path d="M220 105 L225 85 L210 100 Z" fill="#6D4C41" />
      {/* Yeux */}
      <Rect x="185" y="108" width="14" height="14" rx="7" fill="#FFF8E1" />
      <Rect x="205" y="108" width="14" height="14" rx="7" fill="#FFF8E1" />
      <Rect x="189" y="112" width="6" height="6" rx="3" fill="#333" />
      <Rect x="209" y="112" width="6" height="6" rx="3" fill="#333" />
      {/* Bec */}
      <Path d="M200 120 L195 128 L205 128 Z" fill="#FF8F00" />
    </Svg>
  </View>
));
BalanceIllustration.displayName = 'BalanceIllustration';

// Sudoku - Grille avec chiffres colorés et Prof. Hoo
const SudokuIllustration = memo(() => (
  <View style={styles.sudokuContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="gridCellGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#F0F0F5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="sudokuBoardGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E8EAF6" stopOpacity="1" />
          <Stop offset="1" stopColor="#C5CAE9" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="hooBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#795548" stopOpacity="1" />
          <Stop offset="1" stopColor="#5D4037" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="hooHeadGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8D6E63" stopOpacity="1" />
          <Stop offset="1" stopColor="#6D4C41" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="selectedCellGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#B3E5FC" stopOpacity="1" />
          <Stop offset="1" stopColor="#81D4FA" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Ombre de la grille */}
      <Rect x="65" y="85" width="180" height="180" rx="12" fill="rgba(0,0,0,0.1)" />

      {/* Grille 3x3 principale */}
      <Rect x="60" y="80" width="180" height="180" rx="12" fill="url(#sudokuBoardGradient)" stroke="#3F51B5" strokeWidth="4" />
      <Rect x="63" y="83" width="174" height="20" rx="10" fill="rgba(255,255,255,0.2)" />

      {/* Cases - ligne 1 */}
      <Rect x="68" y="88" width="52" height="52" rx="6" fill="url(#gridCellGradient)" />
      <Rect x="70" y="90" width="48" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
      <Rect x="124" y="88" width="52" height="52" rx="6" fill="url(#gridCellGradient)" />
      <Rect x="126" y="90" width="48" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
      <Rect x="180" y="88" width="52" height="52" rx="6" fill="url(#gridCellGradient)" />
      <Rect x="182" y="90" width="48" height="8" rx="4" fill="rgba(255,255,255,0.5)" />

      {/* Cases - ligne 2 */}
      <Rect x="68" y="144" width="52" height="52" rx="6" fill="url(#gridCellGradient)" />
      <Rect x="124" y="144" width="52" height="52" rx="6" fill="url(#selectedCellGradient)" stroke="#29B6F6" strokeWidth="2" />
      <Rect x="126" y="146" width="48" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
      <Rect x="180" y="144" width="52" height="52" rx="6" fill="url(#gridCellGradient)" />

      {/* Cases - ligne 3 */}
      <Rect x="68" y="200" width="52" height="52" rx="6" fill="url(#gridCellGradient)" />
      <Rect x="124" y="200" width="52" height="52" rx="6" fill="url(#gridCellGradient)" />
      <Rect x="180" y="200" width="52" height="52" rx="6" fill="url(#gridCellGradient)" />

      {/* Chiffres dans les cases */}
      <Path d="M90 120 L98 108 L98 132" stroke="#3F51B5" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M200 108 Q210 108 210 115 Q210 122 200 125 L210 132" stroke="#E53935" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M88 175 L102 175 L102 185 L88 185" stroke="#43A047" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Point d'interrogation dans la case sélectionnée */}
      <Path d="M142 158 Q150 155 155 162 Q155 170 148 172" stroke="#1565C0" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Rect x="146" y="178" width="4" height="4" rx="2" fill="#1565C0" />

      {/* Prof. Hoo (hibou avec lunettes) amélioré */}
      {/* Corps */}
      <Rect x="280" y="125" width="80" height="75" rx="35" fill="url(#hooBodyGradient)" />
      <Rect x="283" y="128" width="74" height="12" rx="6" fill="rgba(255,255,255,0.1)" />

      {/* Tête */}
      <Rect x="290" y="95" width="60" height="55" rx="28" fill="url(#hooHeadGradient)" />
      <Rect x="293" y="98" width="54" height="10" rx="5" fill="rgba(255,255,255,0.15)" />

      {/* Aigrettes améliorées */}
      <Path d="M295 100 L280 70 L305 90 Z" fill="#6D4C41" />
      <Path d="M298 98 L286 75 L302 92" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
      <Path d="M345 100 L360 70 L335 90 Z" fill="#6D4C41" />
      <Path d="M342 98 L354 75 L338 92" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />

      {/* Lunettes avec reflets */}
      <Rect x="295" y="115" width="22" height="18" rx="9" fill="rgba(255,255,255,0.1)" stroke="#333" strokeWidth="3" />
      <Rect x="297" y="117" width="8" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="323" y="115" width="22" height="18" rx="9" fill="rgba(255,255,255,0.1)" stroke="#333" strokeWidth="3" />
      <Rect x="325" y="117" width="8" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="317" y="122" width="6" height="4" fill="#333" />

      {/* Yeux derrière lunettes */}
      <Rect x="301" y="119" width="10" height="10" rx="5" fill="#FFF8E1" />
      <Rect x="329" y="119" width="10" height="10" rx="5" fill="#FFF8E1" />
      <Rect x="304" y="122" width="4" height="4" rx="2" fill="#333" />
      <Rect x="332" y="122" width="4" height="4" rx="2" fill="#333" />
      {/* Reflets des yeux */}
      <Rect x="302" y="120" width="2" height="2" rx="1" fill="#FFFFFF" />
      <Rect x="330" y="120" width="2" height="2" rx="1" fill="#FFFFFF" />

      {/* Bec */}
      <Path d="M320 138 L313 150 L327 150 Z" fill="#FF8F00" />
      <Path d="M320 138 L316 144" stroke="#FFB74D" strokeWidth="2" fill="none" />

      {/* Ailes repliées */}
      <Path d="M275 155 Q260 170 270 195" stroke="#5D4037" strokeWidth="10" fill="none" strokeLinecap="round" />
      <Path d="M365 155 Q380 170 370 195" stroke="#5D4037" strokeWidth="10" fill="none" strokeLinecap="round" />

      {/* Pattes */}
      <Path d="M300 198 L295 210 M300 198 L300 210 M300 198 L305 210" stroke="#8D6E63" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M340 198 L335 210 M340 198 L340 210 M340 198 L345 210" stroke="#8D6E63" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Crayon/stylo que tient Prof. Hoo */}
      <Rect x="355" y="140" width="8" height="50" rx="2" fill="#FFE082" transform="rotate(20 359 165)" />
      <Path d="M375 178 L380 190 L370 190 Z" fill="#8D6E63" transform="rotate(20 375 184)" />
      <Rect x="355" y="140" width="8" height="8" rx="2" fill="#F48FB1" transform="rotate(20 359 144)" />
    </Svg>
  </View>
));
SudokuIllustration.displayName = 'SudokuIllustration';

// Memory - Éléphant Memo avec cartes
const MemoryIllustration = memo(() => (
  <View style={styles.memoryContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="cardBackGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#9575CD" stopOpacity="1" />
          <Stop offset="1" stopColor="#7E57C2" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="cardFrontGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#F5F5F5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="elephantBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#B0BEC5" stopOpacity="1" />
          <Stop offset="1" stopColor="#90A4AE" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="elephantHeadGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#CFD8DC" stopOpacity="1" />
          <Stop offset="1" stopColor="#B0BEC5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="earGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#90A4AE" stopOpacity="1" />
          <Stop offset="1" stopColor="#78909C" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Fond décoratif avec motif mémoire */}
      <Rect x="25" y="80" width="20" height="20" rx="4" fill="rgba(156,39,176,0.1)" />
      <Rect x="55" y="95" width="15" height="15" rx="3" fill="rgba(156,39,176,0.08)" />
      <Rect x="20" y="120" width="12" height="12" rx="2" fill="rgba(156,39,176,0.06)" />

      {/* Ombres des cartes */}
      <Rect x="45" y="158" width="60" height="80" rx="8" fill="rgba(0,0,0,0.15)" />
      <Rect x="115" y="158" width="60" height="80" rx="8" fill="rgba(0,0,0,0.15)" />
      <Rect x="185" y="158" width="60" height="80" rx="8" fill="rgba(0,0,0,0.15)" />

      {/* Carte 1 - dos violet */}
      <Rect x="40" y="150" width="60" height="80" rx="8" fill="url(#cardBackGradient)" />
      <Rect x="43" y="153" width="54" height="12" rx="6" fill="rgba(255,255,255,0.2)" />
      <Rect x="45" y="158" width="50" height="67" rx="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* Motif décoratif sur le dos */}
      <Path d="M60 185 L70 175 L80 185 L70 195 Z" fill="rgba(255,255,255,0.2)" />
      <Rect x="65" y="180" width="10" height="10" rx="5" fill="rgba(255,255,255,0.15)" />

      {/* Carte 2 - retournée avec coeur */}
      <Rect x="110" y="150" width="60" height="80" rx="8" fill="url(#cardFrontGradient)" stroke="#E8E8E8" strokeWidth="2" />
      <Rect x="113" y="153" width="54" height="10" rx="5" fill="rgba(255,255,255,0.6)" />
      {/* Coeur amélioré */}
      <Path d="M140 180 C140 172 128 172 128 182 C128 192 140 202 140 202 C140 202 152 192 152 182 C152 172 140 172 140 180 Z" fill="#E91E63" />
      <Path d="M135 180 Q140 175 145 180" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />

      {/* Carte 3 - dos violet */}
      <Rect x="180" y="150" width="60" height="80" rx="8" fill="url(#cardBackGradient)" />
      <Rect x="183" y="153" width="54" height="12" rx="6" fill="rgba(255,255,255,0.2)" />
      <Rect x="185" y="158" width="50" height="67" rx="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* Motif décoratif sur le dos */}
      <Rect x="200" y="180" width="20" height="20" rx="10" fill="rgba(255,255,255,0.15)" />
      <Rect x="205" y="185" width="10" height="10" rx="5" fill="rgba(255,255,255,0.1)" />

      {/* Éléphant Memo amélioré */}
      {/* Corps */}
      <Rect x="270" y="135" width="95" height="75" rx="38" fill="url(#elephantBodyGradient)" />
      <Rect x="273" y="138" width="89" height="15" rx="7" fill="rgba(255,255,255,0.15)" />

      {/* Tête */}
      <Rect x="290" y="95" width="55" height="55" rx="27" fill="url(#elephantHeadGradient)" />
      <Rect x="293" y="98" width="49" height="10" rx="5" fill="rgba(255,255,255,0.2)" />

      {/* Oreilles avec détails */}
      <Rect x="262" y="100" width="35" height="48" rx="17" fill="url(#earGradient)" />
      <Rect x="268" y="108" width="22" height="32" rx="11" fill="#FFCDD2" opacity="0.4" />
      <Rect x="338" y="100" width="35" height="48" rx="17" fill="url(#earGradient)" />
      <Rect x="343" y="108" width="22" height="32" rx="11" fill="#FFCDD2" opacity="0.4" />

      {/* Trompe améliorée */}
      <Path d="M318 138 Q318 165 302 182 Q290 195 295 215" stroke="url(#elephantBodyGradient)" strokeWidth="16" fill="none" strokeLinecap="round" />
      <Path d="M316 140 Q316 160 305 175" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Bout de la trompe */}
      <Rect x="290" y="210" width="16" height="10" rx="5" fill="#B0BEC5" />

      {/* Yeux avec expression */}
      <Rect x="298" y="112" width="14" height="14" rx="7" fill="#FFFFFF" />
      <Rect x="322" y="112" width="14" height="14" rx="7" fill="#FFFFFF" />
      <Rect x="302" y="116" width="6" height="6" rx="3" fill="#333" />
      <Rect x="326" y="116" width="6" height="6" rx="3" fill="#333" />
      {/* Reflets dans les yeux */}
      <Rect x="303" y="113" width="3" height="3" rx="1.5" fill="#FFFFFF" />
      <Rect x="327" y="113" width="3" height="3" rx="1.5" fill="#FFFFFF" />
      {/* Sourcils expressifs */}
      <Path d="M296 108 Q305 105 312 108" stroke="#607D8B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M322 108 Q329 105 338 108" stroke="#607D8B" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Joues roses */}
      <Rect x="290" y="130" width="12" height="8" rx="4" fill="#FFCDD2" opacity="0.5" />
      <Rect x="332" y="130" width="12" height="8" rx="4" fill="#FFCDD2" opacity="0.5" />

      {/* Pattes */}
      <Rect x="280" y="205" width="18" height="25" rx="6" fill="#90A4AE" />
      <Rect x="302" y="205" width="18" height="25" rx="6" fill="#90A4AE" />
      <Rect x="324" y="205" width="18" height="25" rx="6" fill="#90A4AE" />
      <Rect x="346" y="205" width="18" height="25" rx="6" fill="#90A4AE" />

      {/* Petites étoiles/sparkles pour l'effet mémoire */}
      <Path d="M250 90 L253 98 L250 106 L247 98 Z" fill="#FFD54F" />
      <Path d="M375 145 L377 150 L375 155 L373 150 Z" fill="#FFD54F" />
      <Path d="M260 180 L262 185 L260 190 L258 185 Z" fill="#FFD54F" />
    </Svg>
  </View>
));
MemoryIllustration.displayName = 'MemoryIllustration';

// Tangram - Renard Géo avec pièces géométriques
const TangramIllustration = memo(() => (
  <View style={styles.tangramContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="foxBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FF8A65" stopOpacity="1" />
          <Stop offset="1" stopColor="#FF7043" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="foxDarkGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FF7043" stopOpacity="1" />
          <Stop offset="1" stopColor="#E64A19" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="tangramRedGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#EF5350" stopOpacity="1" />
          <Stop offset="1" stopColor="#E53935" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="tangramPurpleGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#AB47BC" stopOpacity="1" />
          <Stop offset="1" stopColor="#8E24AA" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="tangramBlueGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#42A5F5" stopOpacity="1" />
          <Stop offset="1" stopColor="#1E88E5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="tangramGreenGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#66BB6A" stopOpacity="1" />
          <Stop offset="1" stopColor="#43A047" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="tangramOrangeGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFA726" stopOpacity="1" />
          <Stop offset="1" stopColor="#FB8C00" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Ombres des pièces */}
      <Path d="M55 208 L105 158 L105 258 Z" fill="rgba(0,0,0,0.1)" />
      <Path d="M115 188 L165 188 L165 238 L115 238 Z" fill="rgba(0,0,0,0.1)" transform="rotate(15 140 213)" />

      {/* Pièces de tangram avec gradients et reflets */}
      <Path d="M50 200 L100 150 L100 250 Z" fill="url(#tangramRedGradient)" />
      <Path d="M55 200 L95 160 L95 200" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />

      <Path d="M110 180 L160 180 L160 230 L110 230 Z" fill="url(#tangramPurpleGradient)" transform="rotate(15 135 205)" />
      <Rect x="115" y="185" width="40" height="6" rx="3" fill="rgba(255,255,255,0.2)" transform="rotate(15 135 188)" />

      <Path d="M170 220 L220 170 L220 220 Z" fill="url(#tangramBlueGradient)" />
      <Path d="M180 218 L215 183 L215 210" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />

      <Path d="M60 120 L110 120 L85 170 Z" fill="url(#tangramGreenGradient)" />
      <Path d="M70 125 L100 125 L85 155" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />

      <Path d="M120 100 L170 100 L195 140 L145 140 Z" fill="url(#tangramOrangeGradient)" />
      <Path d="M125 105 L168 105 L185 130" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />

      {/* Renard Géo amélioré */}
      <Path d="M280 100 L330 100 L355 150 L305 180 L255 150 Z" fill="url(#foxBodyGradient)" />
      <Path d="M285 105 L325 105 L345 145" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />

      <Path d="M280 150 L280 200 L250 170 Z" fill="url(#foxDarkGradient)" />
      <Path d="M330 150 L330 200 L360 170 Z" fill="url(#foxDarkGradient)" />

      {/* Oreilles avec intérieur */}
      <Path d="M275 105 L260 70 L295 95 Z" fill="#FF5722" />
      <Path d="M278 102 L268 78 L290 95" fill="#FFAB91" opacity="0.5" />
      <Path d="M335 105 L350 70 L315 95 Z" fill="#FF5722" />
      <Path d="M332 102 L342 78 L320 95" fill="#FFAB91" opacity="0.5" />

      {/* Yeux expressifs */}
      <Rect x="283" y="113" width="14" height="14" rx="7" fill="#FFFFFF" />
      <Rect x="313" y="113" width="14" height="14" rx="7" fill="#FFFFFF" />
      <Rect x="287" y="117" width="6" height="6" rx="3" fill="#333" />
      <Rect x="317" y="117" width="6" height="6" rx="3" fill="#333" />
      <Rect x="288" y="114" width="3" height="3" rx="1.5" fill="#FFFFFF" />
      <Rect x="318" y="114" width="3" height="3" rx="1.5" fill="#FFFFFF" />

      {/* Museau */}
      <Path d="M305 138 L293 155 L317 155 Z" fill="#FFCCBC" />
      <Path d="M305 138 L298 148" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
      <Rect x="300" y="150" width="10" height="7" rx="5" fill="#333" />
      <Rect x="302" y="151" width="3" height="2" rx="1" fill="rgba(255,255,255,0.3)" />

      {/* Queue */}
      <Path d="M255 175 Q230 160 235 200 Q240 225 268 210" fill="url(#foxBodyGradient)" />
      <Path d="M238 198 Q242 218 262 210" fill="#FFFFFF" opacity="0.7" />

      {/* Moustaches */}
      <Path d="M280 148 L262 145 M280 152 L260 156" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Path d="M330 148 L348 145 M330 152 L350 156" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </Svg>
  </View>
));
TangramIllustration.displayName = 'TangramIllustration';

// Logix Grid - Fourmi Ada avec grille logique
const LogixGridIllustration = memo(() => (
  <View style={styles.logixContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="antBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6D4C41" stopOpacity="1" />
          <Stop offset="1" stopColor="#5D4037" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="antHeadGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#795548" stopOpacity="1" />
          <Stop offset="1" stopColor="#5D4037" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="gridBgGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ECEFF1" stopOpacity="1" />
          <Stop offset="1" stopColor="#CFD8DC" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="symbolRedGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#EF5350" stopOpacity="1" />
          <Stop offset="1" stopColor="#E53935" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="symbolBlueGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#42A5F5" stopOpacity="1" />
          <Stop offset="1" stopColor="#1E88E5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="symbolGreenGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#66BB6A" stopOpacity="1" />
          <Stop offset="1" stopColor="#43A047" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Ombre de la grille */}
      <Rect x="55" y="85" width="200" height="160" rx="8" fill="rgba(0,0,0,0.1)" />

      {/* Grille logique améliorée */}
      <Rect x="50" y="80" width="200" height="160" rx="8" fill="url(#gridBgGradient)" stroke="#607D8B" strokeWidth="3" />
      <Rect x="53" y="83" width="194" height="20" rx="6" fill="rgba(255,255,255,0.3)" />

      {/* Lignes de grille */}
      <Path d="M50 133 L250 133" stroke="#607D8B" strokeWidth="2" />
      <Path d="M50 186 L250 186" stroke="#607D8B" strokeWidth="2" />
      <Path d="M117 80 L117 240" stroke="#607D8B" strokeWidth="2" />
      <Path d="M184 80 L184 240" stroke="#607D8B" strokeWidth="2" />

      {/* Symboles avec gradients et reflets */}
      {/* Cercle rouge - ligne 1 */}
      <Rect x="70" y="95" width="25" height="25" rx="12" fill="url(#symbolRedGradient)" />
      <Rect x="72" y="97" width="10" height="5" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Carré bleu - ligne 1 */}
      <Rect x="137" y="95" width="25" height="25" rx="4" fill="url(#symbolBlueGradient)" />
      <Rect x="139" y="97" width="10" height="5" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Triangle vert - ligne 1 */}
      <Path d="M210 95 L222 120 L198 120 Z" fill="url(#symbolGreenGradient)" />
      <Path d="M210 100 L216 112 L204 112 Z" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />

      {/* Triangle vert - ligne 2 */}
      <Path d="M83 145 L95 170 L71 170 Z" fill="url(#symbolGreenGradient)" />
      <Path d="M83 150 L89 162 L77 162 Z" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />

      {/* Cercle rouge - ligne 2 */}
      <Rect x="137" y="152" width="25" height="25" rx="12" fill="url(#symbolRedGradient)" />
      <Rect x="139" y="154" width="10" height="5" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Carré bleu - ligne 2 */}
      <Rect x="204" y="152" width="25" height="25" rx="4" fill="url(#symbolBlueGradient)" />
      <Rect x="206" y="154" width="10" height="5" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Carré bleu - ligne 3 */}
      <Rect x="70" y="200" width="25" height="25" rx="4" fill="url(#symbolBlueGradient)" />
      <Rect x="72" y="202" width="10" height="5" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Case mystère - ligne 3 */}
      <Rect x="137" y="200" width="25" height="25" rx="4" fill="rgba(158,158,158,0.1)" stroke="#9E9E9E" strokeWidth="2" strokeDasharray="4,2" />
      <Path d="M145 208 Q150 205 155 210 Q155 218 149 220" stroke="#607D8B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Rect x="148" y="222" width="3" height="3" rx="1" fill="#607D8B" />

      {/* Cercle rouge - ligne 3 */}
      <Rect x="204" y="200" width="25" height="25" rx="12" fill="url(#symbolRedGradient)" />
      <Rect x="206" y="202" width="10" height="5" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Fourmi Ada améliorée */}
      {/* Corps */}
      <Rect x="288" y="150" width="75" height="50" rx="25" fill="url(#antBodyGradient)" />
      <Rect x="291" y="153" width="69" height="10" rx="5" fill="rgba(255,255,255,0.1)" />

      {/* Tête */}
      <Rect x="302" y="115" width="46" height="45" rx="22" fill="url(#antHeadGradient)" />
      <Rect x="305" y="118" width="40" height="8" rx="4" fill="rgba(255,255,255,0.15)" />

      {/* Antennes avec boules lumineuses */}
      <Path d="M315 118 Q308 95 295 88" stroke="#5D4037" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M335 118 Q342 95 355 88" stroke="#5D4037" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Rect x="289" y="82" width="12" height="12" rx="6" fill="#FFD54F" />
      <Rect x="291" y="84" width="4" height="3" rx="1" fill="rgba(255,255,255,0.4)" />
      <Rect x="349" y="82" width="12" height="12" rx="6" fill="#FFD54F" />
      <Rect x="351" y="84" width="4" height="3" rx="1" fill="rgba(255,255,255,0.4)" />

      {/* Yeux expressifs */}
      <Rect x="310" y="128" width="14" height="14" rx="7" fill="#FFFFFF" />
      <Rect x="328" y="128" width="14" height="14" rx="7" fill="#FFFFFF" />
      <Rect x="314" y="132" width="6" height="6" rx="3" fill="#333" />
      <Rect x="332" y="132" width="6" height="6" rx="3" fill="#333" />
      {/* Reflets */}
      <Rect x="315" y="129" width="3" height="3" rx="1.5" fill="#FFFFFF" />
      <Rect x="333" y="129" width="3" height="3" rx="1.5" fill="#FFFFFF" />

      {/* Mandibules */}
      <Path d="M320 155 Q325 165 320 170" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M330 155 Q325 165 330 170" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Pattes articulées */}
      <Path d="M288 162 L270 172 L260 185" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M288 178 L268 188 L258 205" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M288 192 L272 205 L265 220" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M362 162 L380 172 L390 185" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M362 178 L382 188 L392 205" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M362 192 L378 205 L385 220" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Loupe que tient la fourmi */}
      <Rect x="368" y="130" width="3" height="25" rx="1" fill="#8D6E63" transform="rotate(-30 370 142)" />
      <Rect x="378" y="110" width="22" height="22" rx="11" fill="none" stroke="#607D8B" strokeWidth="4" />
      <Rect x="380" y="112" width="18" height="18" rx="9" fill="rgba(200,230,255,0.3)" />
    </Svg>
  </View>
));
LogixGridIllustration.displayName = 'LogixGridIllustration';

// Mots Croisés - Perroquet Lexie avec grille de lettres
const MotsCroisesIllustration = memo(() => (
  <View style={styles.motsContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="parrotBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#66BB6A" stopOpacity="1" />
          <Stop offset="1" stopColor="#4CAF50" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="parrotHeadGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#81C784" stopOpacity="1" />
          <Stop offset="1" stopColor="#66BB6A" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="parrotWingBlueGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#42A5F5" stopOpacity="1" />
          <Stop offset="1" stopColor="#1E88E5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="parrotWingRedGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#EF5350" stopOpacity="1" />
          <Stop offset="1" stopColor="#E53935" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="gridPaperGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFDE7" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFF8E1" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Ombre de la grille */}
      <Rect x="45" y="108" width="180" height="150" rx="8" fill="rgba(0,0,0,0.1)" />

      {/* Grille de mots croisés */}
      <Rect x="40" y="100" width="180" height="150" rx="8" fill="url(#gridPaperGradient)" stroke="#FFB300" strokeWidth="3" />
      <Rect x="43" y="103" width="174" height="15" rx="6" fill="rgba(255,255,255,0.4)" />

      {/* Cases avec lettres - ligne 1 */}
      <Rect x="50" y="110" width="40" height="40" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
      <Rect x="52" y="112" width="36" height="6" rx="3" fill="rgba(255,255,255,0.6)" />
      <Rect x="90" y="110" width="40" height="40" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
      <Rect x="130" y="110" width="40" height="40" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
      <Rect x="170" y="110" width="40" height="40" fill="#37474F" />

      {/* Cases avec lettres - ligne 2 */}
      <Rect x="50" y="150" width="40" height="40" fill="#37474F" />
      <Rect x="90" y="150" width="40" height="40" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
      <Rect x="130" y="150" width="40" height="40" fill="#B3E5FC" stroke="#29B6F6" strokeWidth="2" />
      <Rect x="132" y="152" width="36" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
      <Rect x="170" y="150" width="40" height="40" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />

      {/* Cases avec lettres - ligne 3 */}
      <Rect x="50" y="190" width="40" height="40" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
      <Rect x="90" y="190" width="40" height="40" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
      <Rect x="130" y="190" width="40" height="40" fill="#37474F" />
      <Rect x="170" y="190" width="40" height="40" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />

      {/* Lettres dans les cases */}
      <Path d="M65 125 L70 140 L75 125 M67 134 L73 134" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M105 125 L105 140 M105 125 L115 125 M105 132 L112 132 M105 140 L115 140" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Perroquet Lexie amélioré */}
      {/* Corps */}
      <Rect x="278" y="105" width="75" height="95" rx="35" fill="url(#parrotBodyGradient)" />
      <Rect x="281" y="108" width="69" height="15" rx="7" fill="rgba(255,255,255,0.15)" />

      {/* Tête */}
      <Rect x="288" y="65" width="55" height="55" rx="27" fill="url(#parrotHeadGradient)" />
      <Rect x="291" y="68" width="49" height="10" rx="5" fill="rgba(255,255,255,0.2)" />

      {/* Crête améliorée */}
      <Path d="M315 65 L302 35 L318 55 L322 28 L328 55 L345 40 L328 65" fill="#FFC107" />
      <Path d="M315 65 L306 42 L318 58" stroke="#FFE082" strokeWidth="2" fill="none" />
      <Path d="M322 28 L325 50" stroke="#FFE082" strokeWidth="2" fill="none" />

      {/* Ailes avec dégradés */}
      <Path d="M272 135 Q245 155 255 200" stroke="url(#parrotWingBlueGradient)" strokeWidth="22" fill="none" strokeLinecap="round" />
      <Path d="M268 138 Q250 155 258 185" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M358 135 Q385 155 375 200" stroke="url(#parrotWingRedGradient)" strokeWidth="22" fill="none" strokeLinecap="round" />
      <Path d="M362 138 Q380 155 372 185" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Yeux expressifs */}
      <Rect x="298" y="80" width="16" height="16" rx="8" fill="#FFFFFF" />
      <Rect x="326" y="80" width="16" height="16" rx="8" fill="#FFFFFF" />
      <Rect x="303" y="85" width="6" height="6" rx="3" fill="#333" />
      <Rect x="331" y="85" width="6" height="6" rx="3" fill="#333" />
      {/* Reflets */}
      <Rect x="304" y="82" width="3" height="3" rx="1.5" fill="#FFFFFF" />
      <Rect x="332" y="82" width="3" height="3" rx="1.5" fill="#FFFFFF" />

      {/* Bec amélioré */}
      <Path d="M315 100 Q315 118 302 125 Q315 118 328 125 Q315 118 315 100" fill="#FF9800" />
      <Path d="M315 100 Q315 110 308 118" stroke="#FFB74D" strokeWidth="2" fill="none" />
      <Path d="M308 112 L322 112" stroke="#E65100" strokeWidth="2" strokeLinecap="round" />

      {/* Pattes */}
      <Path d="M300 198 L295 218 M300 198 L300 218 M300 198 L305 218" stroke="#FF9800" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M330 198 L325 218 M330 198 L330 218 M330 198 L335 218" stroke="#FF9800" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Queue */}
      <Path d="M315 198 Q310 230 295 250" stroke="#4CAF50" strokeWidth="8" fill="none" strokeLinecap="round" />
      <Path d="M315 198 Q320 230 335 250" stroke="#4CAF50" strokeWidth="8" fill="none" strokeLinecap="round" />
      <Path d="M315 198 L315 245" stroke="#66BB6A" strokeWidth="6" fill="none" strokeLinecap="round" />
    </Svg>
  </View>
));
MotsCroisesIllustration.displayName = 'MotsCroisesIllustration';

// MathBlocks - Castor Calc avec blocs mathématiques
const MathBlocksIllustration = memo(() => (
  <View style={styles.mathBlocksContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="beaverBodyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#A1887F" stopOpacity="1" />
          <Stop offset="1" stopColor="#8D6E63" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="beaverHeadGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#BCAAA4" stopOpacity="1" />
          <Stop offset="1" stopColor="#A1887F" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="blockBlueGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#64B5F6" stopOpacity="1" />
          <Stop offset="1" stopColor="#42A5F5" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="blockGreenGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#81C784" stopOpacity="1" />
          <Stop offset="1" stopColor="#66BB6A" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="blockOrangeGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FF8A65" stopOpacity="1" />
          <Stop offset="1" stopColor="#FF7043" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="blockPurpleGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#BA68C8" stopOpacity="1" />
          <Stop offset="1" stopColor="#AB47BC" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="blockAmberGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFB74D" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFA726" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="blockTealGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4DB6AC" stopOpacity="1" />
          <Stop offset="1" stopColor="#26A69A" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Ombres des blocs */}
      <Rect x="55" y="188" width="60" height="60" rx="8" fill="rgba(0,0,0,0.1)" />
      <Rect x="125" y="188" width="60" height="60" rx="8" fill="rgba(0,0,0,0.1)" />
      <Rect x="195" y="188" width="60" height="60" rx="8" fill="rgba(0,0,0,0.1)" />
      <Rect x="90" y="128" width="60" height="60" rx="8" fill="rgba(0,0,0,0.1)" />
      <Rect x="160" y="128" width="60" height="60" rx="8" fill="rgba(0,0,0,0.1)" />
      <Rect x="125" y="68" width="60" height="60" rx="8" fill="rgba(0,0,0,0.1)" />

      {/* Blocs mathématiques empilés - ligne du bas */}
      <Rect x="50" y="180" width="60" height="60" rx="8" fill="url(#blockBlueGradient)" />
      <Rect x="52" y="182" width="56" height="10" rx="5" fill="rgba(255,255,255,0.25)" />

      <Rect x="120" y="180" width="60" height="60" rx="8" fill="url(#blockGreenGradient)" />
      <Rect x="122" y="182" width="56" height="10" rx="5" fill="rgba(255,255,255,0.25)" />

      <Rect x="190" y="180" width="60" height="60" rx="8" fill="url(#blockOrangeGradient)" />
      <Rect x="192" y="182" width="56" height="10" rx="5" fill="rgba(255,255,255,0.25)" />

      {/* Blocs mathématiques - ligne du milieu */}
      <Rect x="85" y="120" width="60" height="60" rx="8" fill="url(#blockPurpleGradient)" />
      <Rect x="87" y="122" width="56" height="10" rx="5" fill="rgba(255,255,255,0.25)" />

      <Rect x="155" y="120" width="60" height="60" rx="8" fill="url(#blockAmberGradient)" />
      <Rect x="157" y="122" width="56" height="10" rx="5" fill="rgba(255,255,255,0.25)" />

      {/* Bloc du sommet */}
      <Rect x="120" y="60" width="60" height="60" rx="8" fill="url(#blockTealGradient)" />
      <Rect x="122" y="62" width="56" height="10" rx="5" fill="rgba(255,255,255,0.25)" />

      {/* Symboles sur les blocs */}
      {/* X sur bloc vert */}
      <Path d="M143 203 L157 217 M157 203 L143 217" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      {/* + sur bloc bleu */}
      <Path d="M80 200 L80 220 M70 210 L90 210" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      {/* - sur bloc orange */}
      <Path d="M205 210 L235 210" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      {/* ÷ sur bloc violet */}
      <Path d="M100 150 L130 150 M115 140 L115 140.1 M115 160 L115 160.1" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      <Rect x="112" y="137" width="6" height="6" rx="3" fill="#FFFFFF" />
      <Rect x="112" y="157" width="6" height="6" rx="3" fill="#FFFFFF" />
      {/* = sur bloc ambre */}
      <Path d="M170 145 L200 145 M170 155 L200 155" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      {/* 1 sur bloc teal */}
      <Path d="M145 80 L150 75 L150 105" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Castor Calc amélioré */}
      {/* Corps */}
      <Rect x="278" y="130" width="85" height="75" rx="35" fill="url(#beaverBodyGradient)" />
      <Rect x="281" y="133" width="79" height="12" rx="6" fill="rgba(255,255,255,0.12)" />

      {/* Tête */}
      <Rect x="293" y="95" width="55" height="55" rx="27" fill="url(#beaverHeadGradient)" />
      <Rect x="296" y="98" width="49" height="10" rx="5" fill="rgba(255,255,255,0.15)" />

      {/* Oreilles */}
      <Rect x="288" y="95" width="18" height="18" rx="9" fill="#795548" />
      <Rect x="291" y="98" width="8" height="8" rx="4" fill="#FFAB91" opacity="0.4" />
      <Rect x="338" y="95" width="18" height="18" rx="9" fill="#795548" />
      <Rect x="341" y="98" width="8" height="8" rx="4" fill="#FFAB91" opacity="0.4" />

      {/* Yeux avec expression */}
      <Rect x="303" y="112" width="14" height="14" rx="7" fill="#FFFFFF" />
      <Rect x="327" y="112" width="14" height="14" rx="7" fill="#FFFFFF" />
      <Rect x="307" y="116" width="6" height="6" rx="3" fill="#333" />
      <Rect x="331" y="116" width="6" height="6" rx="3" fill="#333" />
      {/* Reflets */}
      <Rect x="308" y="113" width="3" height="3" rx="1.5" fill="#FFFFFF" />
      <Rect x="332" y="113" width="3" height="3" rx="1.5" fill="#FFFFFF" />
      {/* Sourcils concentrés */}
      <Path d="M302 108 Q310 105 316 108" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M328 108 Q334 105 342 108" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Museau avec détails */}
      <Rect x="308" y="132" width="28" height="18" rx="9" fill="#D7CCC8" />
      <Rect x="310" y="134" width="10" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* Nez */}
      <Rect x="317" y="135" width="10" height="7" rx="3" fill="#5D4037" />
      <Rect x="319" y="136" width="3" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
      {/* Dents */}
      <Rect x="315" y="148" width="6" height="10" rx="1" fill="#FFFFFF" />
      <Rect x="323" y="148" width="6" height="10" rx="1" fill="#FFFFFF" />
      <Path d="M318 148 L318 157" stroke="#E0E0E0" strokeWidth="1" />
      <Path d="M326 148 L326 157" stroke="#E0E0E0" strokeWidth="1" />

      {/* Queue plate avec texture */}
      <Rect x="285" y="200" width="70" height="24" rx="5" fill="#6D4C41" />
      <Rect x="287" y="202" width="66" height="5" rx="2" fill="rgba(255,255,255,0.1)" />
      <Path d="M290 208 L350 208 M290 213 L350 213 M290 218 L350 218" stroke="#5D4037" strokeWidth="1.5" />

      {/* Pattes */}
      <Rect x="290" y="195" width="15" height="12" rx="4" fill="#8D6E63" />
      <Rect x="340" y="195" width="15" height="12" rx="4" fill="#8D6E63" />
    </Svg>
  </View>
));
MathBlocksIllustration.displayName = 'MathBlocksIllustration';

// Matrices Magiques - Étoile Mystic avec matrice brillante
const MatricesMagiquesIllustration = memo(() => (
  <View style={styles.matricesContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="magicBoardGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#AB47BC" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#9C27B0" stopOpacity="1" />
          <Stop offset="1" stopColor="#7B1FA2" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="mysticStarGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFEB3B" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#FFD54F" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFC107" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="cellHighlightGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="rgba(255,255,255,0.35)" stopOpacity="1" />
          <Stop offset="1" stopColor="rgba(255,255,255,0.2)" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Aura magique autour du tableau */}
      <Rect x="55" y="65" width="190" height="190" rx="20" fill="rgba(206,147,216,0.3)" />

      {/* Ombre du tableau */}
      <Rect x="65" y="78" width="180" height="180" rx="16" fill="rgba(0,0,0,0.15)" />

      {/* Fond magique avec matrice 3x3 */}
      <Rect x="60" y="70" width="180" height="180" rx="16" fill="url(#magicBoardGradient)" />
      <Rect x="63" y="73" width="174" height="25" rx="12" fill="rgba(255,255,255,0.1)" />

      {/* Grille 3x3 avec cellules améliorées */}
      {/* Ligne 1 */}
      <Rect x="75" y="85" width="50" height="50" rx="8" fill="rgba(255,255,255,0.18)" />
      <Rect x="77" y="87" width="46" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
      <Rect x="135" y="85" width="50" height="50" rx="8" fill="rgba(255,255,255,0.18)" />
      <Rect x="137" y="87" width="46" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
      <Rect x="195" y="85" width="30" height="50" rx="8" fill="rgba(255,255,255,0.18)" />

      {/* Ligne 2 */}
      <Rect x="75" y="145" width="50" height="50" rx="8" fill="rgba(255,255,255,0.18)" />
      <Rect x="135" y="145" width="50" height="50" rx="8" fill="url(#cellHighlightGradient)" stroke="#FFD54F" strokeWidth="3" />
      <Rect x="137" y="147" width="46" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
      <Rect x="195" y="145" width="30" height="50" rx="8" fill="rgba(255,255,255,0.18)" />

      {/* Ligne 3 */}
      <Rect x="75" y="205" width="50" height="30" rx="8" fill="rgba(255,255,255,0.18)" />
      <Rect x="135" y="205" width="50" height="30" rx="8" fill="rgba(255,255,255,0.18)" />
      <Rect x="195" y="205" width="30" height="30" rx="8" fill="rgba(255,255,255,0.18)" />

      {/* Chiffres dans les cellules */}
      <Path d="M95 105 L100 100 L100 125" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M155 100 Q165 100 165 108 Q165 116 155 118 L165 125" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M205 100 Q215 100 215 108 Q215 115 205 115 Q215 115 215 122 Q215 130 205 130" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Point d'interrogation dans la cellule sélectionnée */}
      <Path d="M152 160 Q160 155 168 162 Q168 172 158 175" stroke="#FFD54F" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Rect x="156" y="182" width="6" height="6" rx="3" fill="#FFD54F" />

      {/* Étoile Mystic améliorée */}
      {/* Lueur autour */}
      <Path d="M320 75 L338 130 L395 130 L348 170 L365 230 L320 192 L275 230 L292 170 L245 130 L302 130 Z" fill="rgba(255,235,59,0.3)" />

      {/* Étoile principale */}
      <Path d="M320 80 L335 130 L390 130 L345 165 L360 220 L320 185 L280 220 L295 165 L250 130 L305 130 Z" fill="url(#mysticStarGradient)" />

      {/* Reflet sur l'étoile */}
      <Path d="M320 85 L332 125 L375 125" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Visage sur l'étoile */}
      <Rect x="302" y="132" width="12" height="12" rx="6" fill="#5D4037" />
      <Rect x="326" y="132" width="12" height="12" rx="6" fill="#5D4037" />
      {/* Reflets des yeux */}
      <Rect x="304" y="134" width="4" height="4" rx="2" fill="#FFFFFF" />
      <Rect x="328" y="134" width="4" height="4" rx="2" fill="#FFFFFF" />
      {/* Sourire */}
      <Path d="M308 160 Q320 172 332 160" stroke="#5D4037" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Joues rosées */}
      <Rect x="295" y="150" width="10" height="6" rx="3" fill="#FFAB91" opacity="0.6" />
      <Rect x="335" y="150" width="10" height="6" rx="3" fill="#FFAB91" opacity="0.6" />

      {/* Petites étoiles scintillantes autour */}
      <Path d="M280 55 L286 68 L280 81 L274 68 Z" fill="#FFD54F" />
      <Rect x="278" y="64" width="4" height="4" rx="2" fill="#FFFFFF" opacity="0.6" />

      <Path d="M375 95 L379 106 L375 117 L371 106 Z" fill="#FFD54F" />
      <Rect x="373" y="102" width="3" height="3" rx="1.5" fill="#FFFFFF" opacity="0.6" />

      <Path d="M255 175 L260 188 L255 201 L250 188 Z" fill="#FFD54F" />
      <Rect x="253" y="184" width="3" height="3" rx="1.5" fill="#FFFFFF" opacity="0.6" />

      <Path d="M385 195 L389 205 L385 215 L381 205 Z" fill="#FFD54F" />
      <Rect x="383" y="202" width="3" height="3" rx="1.5" fill="#FFFFFF" opacity="0.6" />

      <Path d="M268 230 L271 238 L268 246 L265 238 Z" fill="#FFD54F" />
      <Path d="M365 50 L368 58 L365 66 L362 58 Z" fill="#FFD54F" />

      {/* Particules magiques */}
      <Rect x="290 " y="100" width="4" height="4" rx="2" fill="#E1BEE7" opacity="0.7" />
      <Rect x="350" y="145" width="3" height="3" rx="1.5" fill="#E1BEE7" opacity="0.7" />
      <Rect x="270" y="190" width="5" height="5" rx="2.5" fill="#E1BEE7" opacity="0.7" />
    </Svg>
  </View>
));
MatricesMagiquesIllustration.displayName = 'MatricesMagiquesIllustration';

// Conteur Curieux - Plume avec livre ouvert
const ConteurCurieuxIllustration = memo(() => (
  <View style={styles.conteurContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="bookCoverGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8D6E63" stopOpacity="1" />
          <Stop offset="1" stopColor="#6D4C41" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="bookSpineGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#6D4C41" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#8D6E63" stopOpacity="1" />
          <Stop offset="1" stopColor="#6D4C41" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="pageLeftGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFF8E1" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFFDE7" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="pageRightGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFFDE7" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFF8E1" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="quillMainGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#9575CD" stopOpacity="1" />
          <Stop offset="1" stopColor="#7E57C2" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="quillSecGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7E57C2" stopOpacity="1" />
          <Stop offset="1" stopColor="#5E35B1" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Ombre du livre */}
      <Path d="M55 208 Q155 188 205 208 L205 108 Q155 88 55 108 Z" fill="rgba(0,0,0,0.1)" />
      <Path d="M355 208 Q255 188 205 208 L205 108 Q255 88 355 108 Z" fill="rgba(0,0,0,0.1)" />

      {/* Pages du livre ouvert */}
      <Path d="M50 200 Q150 178 200 200 L200 95 Q150 73 50 95 Z" fill="url(#pageLeftGrad)" />
      <Path d="M52 98 Q130 80 195 98" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none" />
      <Path d="M350 200 Q250 178 200 200 L200 95 Q250 73 350 95 Z" fill="url(#pageRightGrad)" />
      <Path d="M205 98 Q270 80 348 98" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none" />

      {/* Reliure du livre */}
      <Rect x="193" y="90" width="14" height="115" fill="url(#bookSpineGrad)" />
      <Rect x="196" y="92" width="8" height="8" rx="2" fill="#FFD54F" opacity="0.8" />

      {/* Lignes de texte - page gauche */}
      <Path d="M68 125 L182 125" stroke="#D7CCC8" strokeWidth="2" />
      <Path d="M68 145 L182 145" stroke="#D7CCC8" strokeWidth="2" />
      <Path d="M68 165 L145 165" stroke="#D7CCC8" strokeWidth="2" />
      <Path d="M68 185 L175 185" stroke="#D7CCC8" strokeWidth="2" />

      {/* Lettrine décorative */}
      <Rect x="65" y="108" width="22" height="22" rx="3" fill="#7E57C2" opacity="0.2" />
      <Path d="M70 115 L75 125 L80 115 M72 122 L78 122" stroke="#7E57C2" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Lignes de texte - page droite */}
      <Path d="M218 125 L335 125" stroke="#D7CCC8" strokeWidth="2" />
      <Path d="M218 145 L335 145" stroke="#D7CCC8" strokeWidth="2" />
      <Path d="M218 165 L298 165" stroke="#D7CCC8" strokeWidth="2" />
      <Path d="M218 185 L320 185" stroke="#D7CCC8" strokeWidth="2" />

      {/* Couverture du livre (épaisseur) */}
      <Path d="M45 202 Q145 182 200 202 L200 212 Q145 192 45 212 Z" fill="url(#bookCoverGrad)" />
      <Path d="M47 204 Q130 188 195 205" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
      <Path d="M355 202 Q255 182 200 202 L200 212 Q255 192 355 212 Z" fill="url(#bookCoverGrad)" />

      {/* Plume magique améliorée */}
      <Path d="M295 35 Q355 55 345 125 L332 118 Q340 65 290 48 Z" fill="url(#quillMainGrad)" />
      <Path d="M298 42 Q348 58 340 115" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />

      {/* Barbes de la plume */}
      <Path d="M290 48 L345 125 L322 138 Q330 90 275 65 Z" fill="url(#quillSecGrad)" />
      <Path d="M310 65 L340 115" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
      <Path d="M300 75 L335 120" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />

      {/* Rachis de la plume */}
      <Path d="M295 35 L322 138" stroke="#5E35B1" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Pointe de la plume */}
      <Path d="M322 138 L308 175 L335 155 Z" fill="#4527A0" />
      <Path d="M322 138 L312 158" stroke="#5E35B1" strokeWidth="2" fill="none" />

      {/* Goutte d'encre */}
      <Path d="M310 180 Q315 190 310 195 Q305 190 310 180" fill="#4527A0" />

      {/* Étoiles scintillantes */}
      <Path d="M265 45 L270 58 L265 71 L260 58 Z" fill="#FFD54F" />
      <Rect x="263" y="54" width="4" height="4" rx="2" fill="#FFFFFF" opacity="0.6" />

      <Path d="M365 75 L369 86 L365 97 L361 86 Z" fill="#FFD54F" />
      <Rect x="363" y="82" width="3" height="3" rx="1.5" fill="#FFFFFF" opacity="0.6" />

      <Path d="M355 25 L358 34 L355 43 L352 34 Z" fill="#FFD54F" />
      <Path d="M280 95 L283 103 L280 111 L277 103 Z" fill="#FFD54F" opacity="0.8" />

      {/* Particules magiques */}
      <Rect x="340" y="50" width="4" height="4" rx="2" fill="#B39DDB" opacity="0.7" />
      <Rect x="375" y="110" width="3" height="3" rx="1.5" fill="#B39DDB" opacity="0.6" />
      <Rect x="255" y="70" width="5" height="5" rx="2.5" fill="#B39DDB" opacity="0.5" />
    </Svg>
  </View>
));
ConteurCurieuxIllustration.displayName = 'ConteurCurieuxIllustration';

// === JEUX COMING SOON ===

// Embouteillage (Rush Hour) - Voitures colorées sur grille
const EmbouteillageIllustration = memo(() => (
  <View style={styles.illustrationContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="redCarGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#EF5350" stopOpacity="1" />
          <Stop offset="1" stopColor="#C62828" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="blueCarGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#42A5F5" stopOpacity="1" />
          <Stop offset="1" stopColor="#1565C0" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="yellowCarGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFEE58" stopOpacity="1" />
          <Stop offset="1" stopColor="#FBC02D" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="greenCarGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#66BB6A" stopOpacity="1" />
          <Stop offset="1" stopColor="#2E7D32" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Grille de parking */}
      <Rect x="100" y="40" width="200" height="200" fill="rgba(0,0,0,0.1)" rx="8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <React.Fragment key={`grid-${i}`}>
          <Path d={`M100 ${40 + i * 33.33} L300 ${40 + i * 33.33}`} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <Path d={`M${100 + i * 33.33} 40 L${100 + i * 33.33} 240`} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </React.Fragment>
      ))}

      {/* Sortie (flèche) */}
      <Rect x="300" y="106" width="30" height="28" fill="#4CAF50" rx="4" />
      <Path d="M308 120 L322 120 M316 112 L324 120 L316 128" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Voiture rouge (cible) - horizontale */}
      <Rect x="133" y="110" width="70" height="28" rx="6" fill="url(#redCarGrad)" />
      <Rect x="140" y="115" width="18" height="12" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="175" y="115" width="18" height="12" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="135" y="132" width="10" height="6" rx="3" fill="#424242" />
      <Rect x="188" y="132" width="10" height="6" rx="3" fill="#424242" />

      {/* Voiture bleue - verticale */}
      <Rect x="210" y="75" width="28" height="65" rx="6" fill="url(#blueCarGrad)" />
      <Rect x="215" y="82" width="12" height="16" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="215" y="115" width="12" height="16" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Voiture jaune - horizontale */}
      <Rect x="100" y="175" width="65" height="28" rx="6" fill="url(#yellowCarGrad)" />
      <Rect x="107" y="180" width="16" height="12" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="138" y="180" width="16" height="12" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Camion vert - verticale (3 cases) */}
      <Rect x="245" y="145" width="28" height="90" rx="6" fill="url(#greenCarGrad)" />
      <Rect x="250" y="152" width="12" height="16" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="250" y="185" width="12" height="16" rx="2" fill="rgba(255,255,255,0.3)" />
      <Rect x="250" y="210" width="12" height="16" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Badge Coming Soon */}
      <Rect x="260" y="10" width="120" height="30" rx="15" fill="rgba(0,0,0,0.6)" />
      <Path d="M275 25 L280 20 L285 25 L280 30 Z" fill="#FFD54F" />
    </Svg>
  </View>
));
EmbouteillageIllustration.displayName = 'EmbouteillageIllustration';

// Fabrique de Réactions - Machines et engrenages
const FabriqueReactionsIllustration = memo(() => (
  <View style={styles.illustrationContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="gearGrad1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#78909C" stopOpacity="1" />
          <Stop offset="1" stopColor="#455A64" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="gearGrad2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#90CAF9" stopOpacity="1" />
          <Stop offset="1" stopColor="#1565C0" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="conveyorGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#5D4037" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#6D4C41" stopOpacity="1" />
          <Stop offset="1" stopColor="#5D4037" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Tapis roulant */}
      <Rect x="60" y="180" width="280" height="20" rx="10" fill="url(#conveyorGrad)" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Rect key={`belt-${i}`} x={70 + i * 40} y="183" width="20" height="14" rx="2" fill="rgba(0,0,0,0.2)" />
      ))}

      {/* Grand engrenage */}
      <Path d="M150 100 L155 75 L165 75 L170 100 L190 95 L195 72 L205 75 L200 100 L218 110 L230 92 L238 100 L222 120 L225 140 L248 142 L248 152 L225 155 L220 175 L240 188 L232 198 L210 182 L190 192 L192 215 L182 218 L175 195 L155 195 L150 218 L140 215 L142 192 L122 182 L100 198 L92 188 L112 175 L108 155 L85 152 L85 142 L108 140 L112 120 L95 100 L103 92 L120 110 L138 100 L135 75 L145 72 L150 95 Z" fill="url(#gearGrad1)" />
      <Rect x="140" y="130" width="52" height="35" rx="17" fill="#607D8B" />

      {/* Petit engrenage */}
      <Path d="M280 130 L283 115 L293 115 L296 130 L308 127 L312 113 L320 117 L314 132 L325 142 L338 132 L344 140 L332 152 L335 165 L350 168 L350 178 L335 180 L330 193 L345 205 L338 213 L322 200 L308 208 L310 223 L300 225 L295 210 L282 210 L278 225 L268 223 L270 208 L256 200 L240 213 L233 205 L248 193 L244 180 L228 178 L228 168 L244 165 L248 152 L235 140 L243 132 L258 142 L270 132 L266 117 L276 113 L280 127 Z" fill="url(#gearGrad2)" />
      <Rect x="268" y="153" width="42" height="28" rx="14" fill="#42A5F5" />

      {/* Balle qui roule */}
      <Rect x="120" y="155" width="30" height="30" rx="15" fill="#FF7043" />
      <Path d="M125 170 Q135 160 145 170" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />

      {/* Rampe */}
      <Path d="M180 150 L260 120" stroke="#8D6E63" strokeWidth="8" strokeLinecap="round" />

      {/* Cloche (goal) */}
      <Path d="M310 85 Q335 85 335 110 L335 130 L285 130 L285 110 Q285 85 310 85" fill="#FFD54F" />
      <Rect x="305" y="75" width="10" height="12" rx="2" fill="#FFA000" />
      <Rect x="295" y="130" width="30" height="5" rx="2" fill="#FFA000" />

      {/* Badge Coming Soon */}
      <Rect x="20" y="10" width="120" height="30" rx="15" fill="rgba(0,0,0,0.6)" />
      <Path d="M35 25 L40 20 L45 25 L40 30 Z" fill="#FFD54F" />
    </Svg>
  </View>
));
FabriqueReactionsIllustration.displayName = 'FabriqueReactionsIllustration';

// Chasseur de Papillons - Papillons colorés et filet
const ChasseurPapillonsIllustration = memo(() => (
  <View style={styles.illustrationContainer}>
    <Svg width={400} height={280} viewBox="0 0 400 280">
      <Defs>
        <SvgLinearGradient id="butterfly1Grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E91E63" stopOpacity="1" />
          <Stop offset="1" stopColor="#AD1457" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="butterfly2Grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#29B6F6" stopOpacity="1" />
          <Stop offset="1" stopColor="#0277BD" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="butterfly3Grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFEE58" stopOpacity="1" />
          <Stop offset="1" stopColor="#F9A825" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8D6E63" stopOpacity="1" />
          <Stop offset="1" stopColor="#5D4037" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Filet à papillons */}
      <Path d="M280 250 L320 180" stroke="url(#netGrad)" strokeWidth="8" strokeLinecap="round" />
      <Path d="M320 180 Q380 150 350 90 Q320 40 270 70 Q220 40 190 90 Q160 150 220 180 Z" fill="none" stroke="#BCAAA4" strokeWidth="2" />
      <Path d="M245 120 L295 120 M235 90 L305 90 M250 150 L290 150" stroke="rgba(188,170,164,0.5)" strokeWidth="1" />
      <Path d="M270 75 L270 165 M240 100 L240 140 M300 100 L300 140" stroke="rgba(188,170,164,0.5)" strokeWidth="1" />
      <Rect x="315" y="175" width="15" height="15" rx="7" fill="#6D4C41" />

      {/* Papillon rose */}
      <Path d="M100 80 Q80 50 60 70 Q40 90 70 100 L100 80 L130 100 Q160 90 140 70 Q120 50 100 80" fill="url(#butterfly1Grad)" />
      <Path d="M100 85 Q85 105 75 130 Q65 155 90 140 L100 115 L110 140 Q135 155 125 130 Q115 105 100 85" fill="url(#butterfly1Grad)" opacity="0.8" />
      <Path d="M100 80 L100 140" stroke="#880E4F" strokeWidth="3" strokeLinecap="round" />
      <Path d="M95 75 Q85 60 90 55 M105 75 Q115 60 110 55" stroke="#880E4F" strokeWidth="2" fill="none" />
      <Rect x="85" y="70" width="8" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
      <Rect x="125" y="85" width="6" height="6" rx="3" fill="rgba(255,255,255,0.3)" />

      {/* Papillon bleu */}
      <Path d="M180 160 Q160 130 140 150 Q120 170 150 180 L180 160 L210 180 Q240 170 220 150 Q200 130 180 160" fill="url(#butterfly2Grad)" />
      <Path d="M180 165 Q165 185 155 210 Q145 235 170 220 L180 195 L190 220 Q215 235 205 210 Q195 185 180 165" fill="url(#butterfly2Grad)" opacity="0.8" />
      <Path d="M180 160 L180 220" stroke="#01579B" strokeWidth="3" strokeLinecap="round" />
      <Path d="M175 155 Q165 140 170 135 M185 155 Q195 140 190 135" stroke="#01579B" strokeWidth="2" fill="none" />
      <Rect x="155" y="145" width="10" height="10" rx="5" fill="rgba(255,255,255,0.4)" />

      {/* Papillon jaune (petit) */}
      <Path d="M340 50 Q325 30 310 45 Q295 60 318 68 L340 50 L362 68 Q385 60 370 45 Q355 30 340 50" fill="url(#butterfly3Grad)" />
      <Path d="M340 55 Q328 70 322 88 Q316 106 335 95 L340 75 L345 95 Q364 106 358 88 Q352 70 340 55" fill="url(#butterfly3Grad)" opacity="0.8" />
      <Path d="M340 50 L340 95" stroke="#E65100" strokeWidth="2" strokeLinecap="round" />

      {/* Petites fleurs/herbes */}
      <Path d="M50 250 Q60 230 50 210" stroke="#66BB6A" strokeWidth="3" fill="none" />
      <Rect x="45" y="205" width="10" height="10" rx="5" fill="#E91E63" />
      <Path d="M380 260 Q390 240 380 220" stroke="#66BB6A" strokeWidth="3" fill="none" />
      <Rect x="375" y="215" width="10" height="10" rx="5" fill="#FFD54F" />

      {/* Badge Coming Soon */}
      <Rect x="20" y="10" width="120" height="30" rx="15" fill="rgba(0,0,0,0.6)" />
      <Path d="M35 25 L40 20 L45 25 L40 30 Z" fill="#FFD54F" />
    </Svg>
  </View>
));
ChasseurPapillonsIllustration.displayName = 'ChasseurPapillonsIllustration';

// Map des illustrations exporté
export const illustrations: Record<EdokiTheme, React.ComponentType> = {
  barres: BarresIllustration,
  fuseaux: FuseauxIllustration,
  chiffres: ChiffresIllustration,
  plage: PlageIllustration,
  numberland: NumberlandIllustration,
  nouveaux: NouveauxIllustration,
  hanoi: HanoiIllustration,
  video: VideoIllustration,
  'suites-logiques': SuitesLogiquesIllustration,
  labyrinthe: LabyrintheIllustration,
  balance: BalanceIllustration,
  sudoku: SudokuIllustration,
  memory: MemoryIllustration,
  tangram: TangramIllustration,
  'logix-grid': LogixGridIllustration,
  'mots-croises': MotsCroisesIllustration,
  'math-blocks': MathBlocksIllustration,
  'matrices-magiques': MatricesMagiquesIllustration,
  'conteur-curieux': ConteurCurieuxIllustration,
  embouteillage: EmbouteillageIllustration,
  'fabrique-reactions': FabriqueReactionsIllustration,
  'chasseur-papillons': ChasseurPapillonsIllustration,
};
