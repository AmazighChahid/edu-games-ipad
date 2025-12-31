const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ajouter l'extension .lottie pour les animations DotLottie
config.resolver.assetExts.push('lottie');

// Configurer la résolution des alias @/
const srcPath = path.resolve(__dirname, 'src');

// Sauvegarder le resolver original
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Forcer zustand/middleware à utiliser la version CommonJS sur web (évite import.meta dans ESM)
  if (platform === 'web' && moduleName === 'zustand/middleware') {
    return context.resolveRequest(context, 'zustand/middleware.js', platform);
  }

  // Transformer @/ en chemin absolu vers src/
  if (moduleName.startsWith('@/')) {
    const newModuleName = path.join(srcPath, moduleName.slice(2));
    return originalResolveRequest
      ? originalResolveRequest(context, newModuleName, platform)
      : context.resolveRequest(context, newModuleName, platform);
  }

  // Utiliser le resolver par défaut
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
