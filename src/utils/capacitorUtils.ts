
import { Capacitor } from '@capacitor/core';

/**
 * Vérifie si l'application est exécutée dans un environnement natif Capacitor
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Vérifie si l'environnement est iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Fonction pour quitter l'application sur plateforme native
 * Cette fonction sera connectée à un plugin natif dans le code Swift/Java
 */
export const exitApp = (): void => {
  if (isNativePlatform()) {
    document.dispatchEvent(new CustomEvent('exitApp'));
  }
};

/**
 * Initialise les écouteurs d'événements Capacitor
 * Cette fonction devrait être appelée au démarrage de l'application
 */
export const initCapacitorEvents = (): void => {
  if (isNativePlatform()) {
    document.addEventListener('exitApp', () => {
      console.log('Tentative de sortie de l\'application');
      // Cette action sera traitée par le code natif
    });
  }
};
