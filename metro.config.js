const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajouter l'extension .lottie pour les animations DotLottie
config.resolver.assetExts.push('lottie');

module.exports = config;
