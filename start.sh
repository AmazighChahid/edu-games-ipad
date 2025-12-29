#!/bin/bash
# Script de démarrage Expo avec nettoyage

echo "🧹 Nettoyage du port 8081..."
lsof -ti:8081 | xargs kill -9 2>/dev/null

echo "🗑️  Suppression du cache..."
rm -rf node_modules/.cache .expo /tmp/metro-* /tmp/haste-map-* 2>/dev/null
watchman watch-del-all 2>/dev/null

echo "🎨 Génération du registry Playground..."
node scripts/generate-playground-registry.js

echo "🚀 Démarrage d'Expo..."
npx expo start --clear
