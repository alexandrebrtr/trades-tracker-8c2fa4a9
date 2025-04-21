
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.923f6c34b3b2464f938b8ce8b6a6a760',
  appName: 'Trades Tracker',
  webDir: 'dist',
  bundledWebRuntime: false,
  backgroundColor: "#1A1F2C", // Couleur de fond pendant le chargement
  ios: {
    contentInset: 'always',
    scheme: 'TradesTracker',
    backgroundColor: "#1A1F2C",
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
  },
  server: {
    url: "https://923f6c34-b3b2-464f-938b-8ce8b6a6a760.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
};

export default config;
