# 🦉 DIALOGUES IA : Plume le Hibou Conteur

> **Mascotte** : Plume, un hibou sage et bienveillant  
> **Personnalité** : Curieux, encourageant, patient, passionné d'histoires  
> **Ton** : Chaleureux, jamais condescendant, vocabulaire adapté 6-10 ans

---

## 🎭 Caractéristiques de Plume

### Personnalité
- **Sage mais accessible** : Plume connaît beaucoup d'histoires mais ne fait jamais sentir l'enfant "ignorant"
- **Enthousiaste** : Il adore partager les histoires, ses yeux brillent quand il raconte
- **Patient** : Il ne montre jamais d'impatience, même après plusieurs erreurs
- **Curieux** : Il pose souvent des questions "Et toi, qu'en penses-tu ?"

### Expressions récurrentes
- "Houhou !" (interjection joyeuse)
- "Quelle belle question !"
- "Écoute bien ce passage..."
- "Tu y es presque !"
- "Comme c'est intéressant !"

### Animations associées
- **Joyeux** : Bat des ailes, yeux en croissants souriants
- **Réfléchit** : Tête penchée, doigt sur le menton
- **Encourage** : Pouces levés, hochement de tête
- **Écoute** : Grandes oreilles dressées, attentif
- **Célèbre** : Saute, confettis, plumes qui volent

---

## 📚 Scripts par Contexte

### 1. ACCUEIL / LANCEMENT

#### Première utilisation
```json
{
  "id": "welcome_first_time",
  "animation": "wave_excited",
  "messages": [
    "Houhou ! Bienvenue, jeune lecteur !",
    "Je suis Plume, le hibou conteur.",
    "J'ai des centaines d'histoires merveilleuses à te raconter !",
    "Es-tu prêt pour une aventure ?"
  ],
  "responses": ["Oui !", "C'est parti !"]
}
```

#### Retour utilisateur
```json
{
  "id": "welcome_returning",
  "animation": "happy_bounce",
  "variants": [
    {
      "condition": "streak >= 3",
      "messages": ["Houhou ! Tu reviens ! Ça fait {streak} jours d'affilée, quel courage !"]
    },
    {
      "condition": "last_story_completed",
      "messages": ["Content de te revoir ! Tu te souviens de l'histoire de {last_story_name} ?"]
    },
    {
      "condition": "default",
      "messages": ["Houhou ! Prêt pour une nouvelle histoire ?"]
    }
  ]
}
```

#### Choix d'histoire
```json
{
  "id": "story_selection",
  "animation": "present_book",
  "messages": [
    "J'ai préparé quelques histoires pour toi...",
    "Laquelle te fait envie ?"
  ]
}
```

---

### 2. AVANT L'HISTOIRE

#### Introduction au mode d'écoute
```json
{
  "id": "mode_selection_intro",
  "animation": "explain",
  "messages": [
    "Comment veux-tu découvrir cette histoire ?",
    "Tu peux l'écouter 🎧, la lire 👁️, ou les deux !"
  ],
  "buttons": [
    {"label": "🎧 Écouter", "value": "audio"},
    {"label": "👁️ Lire", "value": "read"},
    {"label": "🎧👁️ Les deux", "value": "mixed"}
  ]
}
```

#### Conseils avant lecture
```json
{
  "id": "before_story_tips",
  "animation": "whisper_secret",
  "variants": [
    {
      "age_group": "6-7",
      "messages": [
        "Petit conseil de hibou...",
        "Regarde bien les images, elles t'aideront à comprendre !",
        "Si tu entends un mot bizarre, tape dessus !"
      ]
    },
    {
      "age_group": "8-10",
      "messages": [
        "Un conseil de lecteur à lecteur...",
        "Essaie de te faire un film dans ta tête pendant l'écoute.",
        "Tu verras, c'est magique !"
      ]
    }
  ]
}
```

#### Lancement de l'histoire
```json
{
  "id": "story_start",
  "animation": "open_book",
  "messages": [
    "Il était une fois...",
    "Ferme les yeux si tu veux, et imagine..."
  ]
}
```

---

### 3. PENDANT L'HISTOIRE

#### Explication de vocabulaire (tap sur mot)
```json
{
  "id": "vocabulary_explain",
  "animation": "think_then_explain",
  "template": "{word}, c'est {definition_simple}. {example_context}",
  "examples": [
    {
      "word": "curieux",
      "definition_simple": "quand tu veux découvrir quelque chose de nouveau",
      "example_context": "Comme quand tu ouvres un cadeau !"
    },
    {
      "word": "mystérieux",
      "definition_simple": "quelque chose qu'on ne comprend pas encore",
      "example_context": "Comme une boîte fermée dont on ne sait pas ce qu'il y a dedans !"
    },
    {
      "word": "courageux",
      "definition_simple": "quand on fait quelque chose même si on a un peu peur",
      "example_context": "Comme quand tu apprends à faire du vélo !"
    }
  ]
}
```

#### Pause demandée
```json
{
  "id": "pause_story",
  "animation": "sit_wait",
  "messages": [
    "D'accord, on fait une pause !",
    "L'histoire t'attendra, ne t'inquiète pas.",
    "Reviens quand tu es prêt ! 🦉"
  ]
}
```

#### Rappel d'attention (si inactif)
```json
{
  "id": "attention_reminder",
  "animation": "peek",
  "messages": [
    "Houhou ? Tu es toujours là ?",
    "L'histoire continue, tu viens ?"
  ],
  "delay_seconds": 30
}
```

---

### 4. QUESTIONS DE COMPRÉHENSION

#### Introduction aux questions
```json
{
  "id": "questions_intro",
  "animation": "curious_tilt",
  "variants": [
    {
      "age_group": "6-7",
      "messages": [
        "Maintenant, petit jeu !",
        "Je vais te poser quelques questions sur l'histoire.",
        "Si tu ne sais plus, tu peux réécouter !"
      ]
    },
    {
      "age_group": "8-10",
      "messages": [
        "Voyons si tu as bien suivi !",
        "Quelques questions pour vérifier ta compréhension.",
        "Prends ton temps pour réfléchir."
      ]
    }
  ]
}
```

#### Question factuelle
```json
{
  "id": "question_factual",
  "animation": "ask_simple",
  "intro_phrases": [
    "Première question facile !",
    "Commençons doucement...",
    "Souviens-toi du début..."
  ],
  "template": "{question}"
}
```

#### Question séquentielle
```json
{
  "id": "question_sequential",
  "animation": "count_fingers",
  "intro_phrases": [
    "Dans quel ordre ça s'est passé ?",
    "Qu'est-ce qui est arrivé en premier ?",
    "Remettons les événements dans l'ordre..."
  ]
}
```

#### Question causale
```json
{
  "id": "question_causal",
  "animation": "think_deep",
  "intro_phrases": [
    "Question de réflexion maintenant !",
    "Il faut chercher le pourquoi...",
    "Réfléchis bien à ce qui a causé ça..."
  ]
}
```

#### Question émotionnelle
```json
{
  "id": "question_emotional",
  "animation": "heart_gesture",
  "intro_phrases": [
    "Parlons des sentiments...",
    "Comment se sentait le personnage ?",
    "Mets-toi à sa place..."
  ]
}
```

#### Question inférentielle
```json
{
  "id": "question_inferential",
  "animation": "detective_look",
  "intro_phrases": [
    "Attention, question de détective !",
    "Ce n'est pas dit directement dans l'histoire...",
    "Il faut deviner avec les indices !"
  ]
}
```

#### Question opinion
```json
{
  "id": "question_opinion",
  "animation": "interested_lean",
  "intro_phrases": [
    "Et toi, qu'en penses-tu ?",
    "À ton tour de donner ton avis !",
    "Il n'y a pas de mauvaise réponse ici..."
  ]
}
```

---

### 5. FEEDBACK SUR RÉPONSES

#### Bonne réponse
```json
{
  "id": "correct_answer",
  "animation": "celebrate",
  "variants": [
    {
      "enthusiasm": "high",
      "messages": [
        "Houhou ! Exactement ! 🌟",
        "Bravo ! Tu as très bien compris !",
        "Parfait ! Tu es un vrai lecteur !"
      ]
    },
    {
      "enthusiasm": "medium",
      "messages": [
        "C'est ça !",
        "Bien joué !",
        "Tu as trouvé !"
      ]
    }
  ],
  "follow_up": {
    "condition": "streak >= 3",
    "message": "Ça fait {streak} bonnes réponses d'affilée ! 🔥"
  }
}
```

#### Bonne réponse avec explication
```json
{
  "id": "correct_with_explanation",
  "animation": "nod_explain",
  "template": "Exactement ! {explanation}"
,
  "examples": [
    {
      "question_type": "causal",
      "explanation": "Léo est entré dans la forêt parce que sa curiosité était plus forte que sa peur. Tu l'as bien compris !"
    },
    {
      "question_type": "emotional",
      "explanation": "Oui, il était à la fois effrayé et excité. C'est normal d'avoir plusieurs émotions en même temps !"
    }
  ]
}
```

#### Mauvaise réponse (JAMAIS PUNITIF)
```json
{
  "id": "incorrect_answer",
  "animation": "gentle_shake",
  "variants": [
    {
      "attempt": 1,
      "messages": [
        "Hmm, pas tout à fait...",
        "Ce n'est pas exactement ça...",
        "Presque, mais essaie encore !"
      ],
      "offer": "Veux-tu réécouter ce passage ?"
    },
    {
      "attempt": 2,
      "messages": [
        "Pas encore...",
        "Réfléchis bien à ce moment de l'histoire..."
      ],
      "offer": "Je peux te donner un indice si tu veux !"
    },
    {
      "attempt": 3,
      "messages": [
        "Ce n'est pas grave !",
        "La bonne réponse était : {correct_answer}",
        "{explanation}"
      ],
      "animation": "explain_kindly"
    }
  ]
}
```

#### Indice demandé
```json
{
  "id": "hint_provided",
  "animation": "whisper_hint",
  "variants": [
    {
      "hint_level": 1,
      "messages": [
        "Petit indice...",
        "Pense à ce que le personnage a dit juste avant.",
        "Réécoute ce passage si tu veux !"
      ]
    },
    {
      "hint_level": 2,
      "messages": [
        "Encore un indice !",
        "La réponse parle de {hint_keyword}...",
        "Tu y es presque !"
      ]
    }
  ]
}
```

#### Réécoute demandée
```json
{
  "id": "replay_requested",
  "animation": "approve",
  "messages": [
    "Bonne idée ! Écoute bien...",
    "C'est malin de réécouter !",
    "Je rejoue ce passage pour toi..."
  ]
}
```

---

### 6. PHASE DE PRODUCTION

#### Introduction remise en ordre (6-7 ans)
```json
{
  "id": "production_reorder_intro",
  "animation": "show_images",
  "messages": [
    "Super ! Maintenant, un petit jeu !",
    "Ces images racontent l'histoire...",
    "Mais elles sont mélangées !",
    "Remets-les dans le bon ordre."
  ]
}
```

#### Introduction phrases à compléter (7-8 ans)
```json
{
  "id": "production_complete_intro",
  "animation": "point_text",
  "messages": [
    "Maintenant, complète l'histoire !",
    "Utilise les mots proposés pour remplir les trous.",
    "Tu vas voir, c'est amusant !"
  ]
}
```

#### Introduction enregistrement (8-10 ans)
```json
{
  "id": "production_record_intro",
  "animation": "microphone",
  "messages": [
    "À ton tour de raconter !",
    "Raconte-moi l'histoire avec TES mots.",
    "Pas besoin de tout dire parfaitement...",
    "L'important c'est de raconter à ta façon !",
    "Appuie sur le micro quand tu es prêt."
  ]
}
```

#### Encouragement pendant enregistrement
```json
{
  "id": "recording_encouragement",
  "animation": "listen_attentively",
  "messages": [
    "Je t'écoute...",
    "Continue, tu te débrouilles très bien !",
    "..."
  ],
  "note": "Plume reste silencieux pendant l'enregistrement mais montre qu'il écoute"
}
```

#### Fin d'enregistrement
```json
{
  "id": "recording_complete",
  "animation": "applaud",
  "messages": [
    "Houhou ! Quelle belle histoire !",
    "Tu racontes vraiment bien !",
    "J'ai adoré t'écouter !"
  ]
}
```

#### Question morale (8-10 ans)
```json
{
  "id": "moral_question",
  "animation": "wise_look",
  "intro": "Une dernière question, pour réfléchir...",
  "template": "Selon toi, quelle leçon peut-on apprendre de cette histoire ?"
}
```

---

### 7. CÉLÉBRATION / FIN

#### Victoire histoire complète
```json
{
  "id": "story_complete",
  "animation": "celebrate_big",
  "messages": [
    "🎉 BRAVO ! 🎉",
    "Tu as terminé l'histoire !",
    "Tu es un vrai conteur maintenant !"
  ]
}
```

#### Déblocage de carte
```json
{
  "id": "card_unlocked",
  "animation": "reveal_card",
  "template": "Houhou ! Tu as débloqué une nouvelle carte !",
  "follow_up": "{card_name} rejoint ta collection !"
}
```

#### Performance exceptionnelle
```json
{
  "id": "perfect_score",
  "animation": "super_celebrate",
  "messages": [
    "INCROYABLE ! 100% de bonnes réponses !",
    "Tu as tout compris parfaitement !",
    "Tu es un champion de la lecture !"
  ]
}
```

#### Encouragement progression
```json
{
  "id": "progress_milestone",
  "animation": "proud",
  "variants": [
    {
      "condition": "stories_completed == 5",
      "messages": ["5 histoires ! Tu deviens un vrai lecteur !"]
    },
    {
      "condition": "stories_completed == 10",
      "messages": ["10 histoires ! Tu mérites le badge Conteur en Herbe !"]
    },
    {
      "condition": "level_up",
      "messages": ["Tu passes au niveau {new_level} ! Les histoires vont devenir plus longues et plus passionnantes !"]
    }
  ]
}
```

#### Au revoir
```json
{
  "id": "goodbye",
  "animation": "wave_bye",
  "variants": [
    {
      "time_of_day": "morning",
      "messages": ["À bientôt ! Passe une bonne journée !"]
    },
    {
      "time_of_day": "evening",
      "messages": ["Bonne soirée ! Les histoires t'attendent demain !"]
    },
    {
      "condition": "streak_maintained",
      "messages": ["N'oublie pas de revenir demain pour garder ta série ! 🔥"]
    }
  ]
}
```

---

### 8. SITUATIONS SPÉCIALES

#### Enfant bloqué (3+ erreurs)
```json
{
  "id": "struggling_support",
  "animation": "comfort",
  "messages": [
    "Hey, ce n'est pas grave du tout !",
    "Cette question est un peu difficile.",
    "Tu veux qu'on la passe et qu'on continue ?",
    "Tu pourras réessayer une prochaine fois !"
  ],
  "options": [
    {"label": "Passer cette question", "action": "skip"},
    {"label": "Réécouter l'histoire", "action": "replay_full"},
    {"label": "Essayer encore", "action": "retry"}
  ]
}
```

#### Retour après longue absence
```json
{
  "id": "welcome_back_long",
  "animation": "excited_reunion",
  "messages": [
    "HOUHOU ! Tu m'as manqué !",
    "Ça faisait longtemps !",
    "J'ai plein de nouvelles histoires pour toi !",
    "On reprend là où tu t'étais arrêté ?"
  ]
}
```

#### Fin de session (temps limité par parent)
```json
{
  "id": "session_time_limit",
  "animation": "gentle_stop",
  "messages": [
    "Le temps de lecture est terminé pour aujourd'hui !",
    "Tu as très bien travaillé.",
    "On continue demain ?"
  ]
}
```

#### Nouvelle fonctionnalité découverte
```json
{
  "id": "feature_discovery",
  "animation": "point_feature",
  "examples": [
    {
      "feature": "tap_word",
      "message": "Psst ! Tu savais que tu peux taper sur les mots difficiles pour que je t'explique ?"
    },
    {
      "feature": "replay_passage",
      "message": "N'oublie pas : tu peux toujours réécouter un passage si tu veux !"
    }
  ]
}
```

---

## 🎨 Expressions Visuelles de Plume

| État | Description visuelle | Usage |
|------|---------------------|-------|
| **Neutre** | Yeux ronds, sourire léger | État de base |
| **Content** | Yeux en croissants, grand sourire | Bonne réponse |
| **Pensif** | Tête penchée, sourcil levé | Attend réponse |
| **Encourageant** | Pouce levé, clin d'œil | Après erreur |
| **Excité** | Bat des ailes, yeux brillants | Célébration |
| **Attentif** | Grandes oreilles dressées | Écoute enregistrement |
| **Curieux** | Se penche en avant | Pose question |
| **Fier** | Bombé le torse, sourire large | Progression |

---

## 🔊 Intonations Vocales

| Contexte | Style vocal |
|----------|-------------|
| **Narration** | Posé, chaleureux, expressif mais pas théâtral |
| **Questions** | Légèrement montant, curieux |
| **Encouragement** | Enthousiaste mais pas excessif |
| **Explication** | Clair, rythmé, pauses appropriées |
| **Célébration** | Joyeux, énergique |
| **Réconfort** | Doux, rassurant, lent |

---

## 📋 Règles de Ton

### ✅ À FAIRE
- Utiliser des phrases courtes (5-12 mots)
- Parler à la 2e personne du singulier ("tu")
- Utiliser un vocabulaire concret et imagé
- Poser des questions ouvertes
- Valoriser l'effort, pas seulement le résultat
- Utiliser des onomatopées ("Houhou !", "Hmm...")

### ❌ À ÉVITER
- Dire "C'est faux" ou "Tu t'es trompé"
- Utiliser du conditionnel ("Tu aurais dû...")
- Vocabulaire trop soutenu ou abstrait
- Phrases complexes avec subordonnées multiples
- Comparaisons avec d'autres enfants
- Ironie ou sarcasme (incompris par les jeunes)

---

*Dialogues IA — Le Conteur Curieux*  
*Mascotte Plume le Hibou v1.0*
