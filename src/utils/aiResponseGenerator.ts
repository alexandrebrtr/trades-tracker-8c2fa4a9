
export const aiResponseGenerator = (messageContent: string): string => {
  if (messageContent.toLowerCase().includes('analyse') || messageContent.toLowerCase().includes('performance')) {
    return generateTradingAnalysis();
  } else if (messageContent.toLowerCase().includes('tendance') || messageContent.toLowerCase().includes('marché')) {
    return generateMarketTrends();
  } else if (messageContent.toLowerCase().includes('stratégie') || messageContent.toLowerCase().includes('conseil')) {
    return generateTradingAdvice();
  } else if (messageContent.toLowerCase().includes('risque') || messageContent.toLowerCase().includes('position')) {
    return generateRiskManagement();
  } else {
    // Default responses for other queries
    const tradingResponses = [
      "D'après mon analyse des données récentes, le marché montre une tendance de consolidation. Je recommande d'attendre une cassure claire avant de prendre position.",
      "Les indicateurs techniques suggèrent une légère sur-extension du marché. Envisagez de prendre des bénéfices partiels si vous êtes en position longue depuis un certain temps.",
      "J'observe une divergence entre le prix et le RSI sur le timeframe journalier. Cela pourrait indiquer un renversement potentiel dans les prochains jours.",
      "Votre ratio risque/récompense moyen de 1.5 est bon, mais pourrait être amélioré. Essayez d'identifier des points d'entrée plus précis pour augmenter ce ratio à 2 ou plus.",
      "L'analyse des volumes récents montre une accumulation significative. Cela pourrait présager un mouvement haussier à court terme.",
      "Je remarque que vos performances sont meilleures sur les trades de breakout. Considérez vous spécialiser davantage dans cette stratégie tout en maintenant une gestion de risque stricte."
    ];
    return tradingResponses[Math.floor(Math.random() * tradingResponses.length)];
  }
};

// Functions to generate detailed trading responses
const generateTradingAnalysis = () => {
  return `Basé sur l'analyse de vos 20 derniers trades:

1. Win Rate: 65% (13 trades gagnants, 7 perdants)
2. Ratio Risque/Récompense moyen: 1.8
3. Profit Factor: 2.3
4. Drawdown maximum: 4.8%

Points forts:
- Excellentes performances sur les trades Bitcoin et Ethereum
- Bonne discipline de sortie sur les trades gagnants

Axes d'amélioration:
- Les trades sur le Forex ont un win rate inférieur (45%)
- Tendance à couper les gains trop tôt sur certains trades à fort potentiel

Recommandation: Concentrez-vous davantage sur les crypto-monnaies où vous montrez un avantage statistique, et travaillez sur votre patience pour laisser courir les profits plus longtemps.`;
};

const generateMarketTrends = () => {
  return `Analyse des tendances actuelles du marché:

Crypto-monnaies:
- BTC: Tendance haussière à moyen terme, consolidation à court terme
- ETH: Support important à 3,200$, résistance à 3,500$
- Altcoins: Momentum mixte, suivent généralement BTC

Forex:
- EUR/USD: Range-bound entre 1.08 et 1.10, biais légèrement baissier
- GBP/USD: Tendance haussière, test récent de résistance clé

Actions:
- Indices américains: Tendance haussière, quelques signes de ralentissement
- Technologie: Surperformance continue, valorisations élevées

Matières premières:
- Or: Support solide, potentiel haussier en cas de volatilité accrue
- Pétrole: Tendance latérale, sensible aux développements géopolitiques

Le contexte macro-économique suggère une prudence accrue avec les politiques monétaires en évolution.`;
};

const generateTradingAdvice = () => {
  return `Conseils stratégiques pour améliorer vos performances:

1. Gestion du risque:
   - Limitez chaque trade à 1-2% de votre capital
   - Définissez toujours vos stops avant d'entrer en position
   - Utilisez des trailing stops pour protéger vos gains

2. Psychologie du trading:
   - Tenez un journal détaillé pour identifier vos modèles comportementaux
   - Prenez des pauses après des pertes significatives
   - Célébrez les victoires, mais analysez aussi vos réussites

3. Stratégies efficaces:
   - Breakouts avec confirmation de volume
   - Trades de tendance sur timeframes multiples
   - Stratégies de mean reversion sur marchés latéraux

4. Organisation:
   - Planifiez vos trades à l'avance
   - Créez une routine quotidienne d'analyse
   - Réservez du temps pour l'éducation continue

L'amélioration constante vient de la discipline et de l'apprentissage itératif.`;
};

const generateRiskManagement = () => {
  return `Principes de gestion des risques pour traders:

1. Position Sizing:
   - Formule recommandée: Risque par trade (%) × Capital ÷ Distance au stop-loss
   - Example: 1% × 10,000€ ÷ 100 pips = 1€ par pip

2. Corrélation:
   - Évitez d'ouvrir plusieurs positions fortement corrélées
   - Diversifiez entre classes d'actifs et instruments

3. Ratios essentiels:
   - Visez un minimum de 1:2 risque/récompense
   - Maintenez un drawdown maximum de 15-20%
   - Objectif de profit factor > 1.5

4. Protection du capital:
   - Règle des 2% par trade
   - Règle des 6% de risque quotidien maximum
   - Réduisez la taille des positions après une série de pertes

5. Plan de récupération:
   - Prenez une pause après avoir atteint votre seuil de drawdown
   - Revenez avec des positions réduites (50%)
   - Augmentez progressivement à mesure que vous regagnez en confiance

Une gestion des risques solide est plus importante que la stratégie d'entrée elle-même.`;
};
