# 03 — UI Spec (iPad / Expo React Native)

## 3.1 Principes UI enfant (iPad)
- Cibles tactiles larges (>= 44–56 px)
- Texte minimal, pictos d’abord
- Contraste élevé, fond sobre
- Layout stable (boutons toujours mêmes positions)
- Aucune saisie clavier

## 3.2 Layout recommandé (paysage iPad)
### Zone principale (70%)
- Plateau 3 tours + disques
- Tours alignées A / B / C
- Indication destination (halo sur C)

### Panneau latéral (30%)
- Objectif du niveau (1 phrase)
- Règles en pictos
- Boutons : Indice / Annuler / Rejouer (contextuel)

## 3.3 Composants (proposés)
- `HanoiBoard`
  - `Peg` x3 (A,B,C)
  - `DiskStack`
  - `Disk` (taille, couleur, état)
- `TopBar`
  - Back / Règles / Niveau
- `SidePanel`
  - Objectif + micro-objectifs
  - CTA Indice
- `HintToast` (message court)
- `CelebrationModal` (fin)

## 3.4 Spéc UI “disques”
- 3–7 disques max
- Largeur disque proportionnelle (ex. 35% → 75% largeur peg)
- “Top disk only” visuellement évident
- États visuels :
  - normal
  - sélectionné (halo)
  - invalide (shake léger)
  - conseillé (surlignage doux)

## 3.5 Accessibilité
- Mode “Dys-friendly” :
  - police sans serif, taille augmentée
  - espacement accru
- Option “Audio renforcé” :
  - lecture vocale systématique des consignes
- Motion :
  - éviter animations agressives
  - option “réduire animations”
