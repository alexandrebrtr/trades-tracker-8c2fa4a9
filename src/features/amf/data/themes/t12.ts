import { buildQuestions, Theme } from "../../types";

const id = "t12";

export const theme12: Theme = {
  id,
  number: 12,
  title: "Les bases comptables et financières",
  shortTitle: "Bases financières",
  description:
    "Bilan et compte de résultat, ratios boursiers (PER, rendement, capitalisation), mathématiques financières, rendement, risque et diversification.",
  duration: 40,
  sections: [
    {
      id: "comptabilite",
      title: "Les états financiers",
      content: `
### Le bilan

Photographie du **patrimoine** de l'entreprise à une date donnée.

| Actif (emplois) | Passif (ressources) |
|---|---|
| **Actif immobilisé** : immobilisations incorporelles (brevets, goodwill), corporelles (bâtiments, machines), financières (participations) | **Capitaux propres** : capital, réserves, résultat de l'exercice |
| **Actif circulant** : stocks, créances clients, trésorerie | **Provisions** |
| | **Dettes** : financières (emprunts), fournisseurs, fiscales et sociales |

> **Total actif = total passif.**

### Le compte de résultat

Film de l'activité sur l'exercice : **produits − charges = résultat**.

- **Chiffre d'affaires**
- **Excédent brut d'exploitation (EBE / EBITDA)** : résultat avant dotations aux amortissements, intérêts et impôts ;
- **Résultat d'exploitation (EBIT)** ;
- **Résultat financier** (intérêts, dividendes reçus) ;
- **Résultat exceptionnel** (en normes françaises) ;
- **Impôt sur les sociétés**
- **Résultat net**

### Autres notions

- **Amortissement** : constatation de la dépréciation irréversible d'une immobilisation ; c'est une charge **non décaissée**.
- **Provision** : constatation d'une charge probable.
- **Capacité d'autofinancement (CAF)** ≈ résultat net + dotations aux amortissements et provisions (nettes).
- **Free cash flow** : flux de trésorerie disponible après investissements.
- **Dette nette** = dettes financières − trésorerie.
- **Fonds de roulement** = ressources stables − emplois stables ; **BFR** = actif circulant d'exploitation − dettes d'exploitation.
`,
      keyPoints: [
        "Bilan = patrimoine à une date ; compte de résultat = activité sur l'exercice.",
        "EBE/EBITDA : avant amortissements, intérêts et impôts.",
        "L'amortissement est une charge non décaissée.",
        "Dette nette = dettes financières − trésorerie.",
      ],
    },
    {
      id: "ratios",
      title: "Les ratios boursiers et financiers",
      content: `
| Ratio | Formule | Interprétation |
|---|---|---|
| **Capitalisation boursière** | Cours × nombre d'actions | Valeur de marché des fonds propres |
| **BPA** (bénéfice par action) | Résultat net / nombre d'actions | Bénéfice revenant à une action |
| **PER** (*price earning ratio*) | Cours / BPA (ou capitalisation / résultat net) | Nombre d'années de bénéfices « payées » par le marché ; un PER élevé traduit des anticipations de croissance |
| **Rendement de l'action** | Dividende / cours | Rémunération immédiate de l'actionnaire |
| **Taux de distribution** (*payout*) | Dividendes / résultat net | Part du bénéfice distribuée |
| **ROE** (rentabilité des capitaux propres) | Résultat net / capitaux propres | Rentabilité pour l'actionnaire |
| **Gearing** | Dette nette / capitaux propres | Niveau d'endettement |
| **Valeur d'entreprise (VE)** | Capitalisation + dette nette | Valeur de l'actif économique |
| **VE / EBITDA** | | Multiple de valorisation |
| **Price to book** | Capitalisation / capitaux propres | Prime ou décote sur la valeur comptable |

### Exemple

Une société a 10 millions d'actions cotant 50 €, un résultat net de 25 M€ et distribue 1,50 € de dividende par action.

- Capitalisation = 10 M × 50 € = **500 M€**
- BPA = 25 M€ / 10 M = **2,50 €**
- PER = 50 / 2,50 = **20**
- Rendement = 1,50 / 50 = **3 %**
- Taux de distribution = 1,50 / 2,50 = **60 %**

### L'effet de levier financier

Lorsque la rentabilité économique est supérieure au coût de la dette, l'endettement **augmente la rentabilité des capitaux propres** (ROE) — mais il accroît aussi le risque.
`,
      keyPoints: [
        "PER = cours / BPA ; rendement = dividende / cours.",
        "Capitalisation = cours × nombre d'actions ; VE = capitalisation + dette nette.",
        "ROE = résultat net / capitaux propres ; gearing = dette nette / capitaux propres.",
      ],
    },
    {
      id: "maths",
      title: "Les mathématiques financières",
      content: `
### Intérêts simples et composés

- **Intérêts simples** : les intérêts ne produisent pas d'intérêts. Valeur acquise = C × (1 + t × n).
- **Intérêts composés** : les intérêts sont capitalisés. Valeur acquise = **C × (1 + t)ⁿ**.

Exemple : 1 000 € placés à 5 % pendant 2 ans → intérêts simples : 1 100 € ; intérêts composés : 1 000 × 1,05² = **1 102,50 €**.

### Actualisation

La **valeur actuelle** d'un flux futur F perçu dans n années au taux t : **VA = F / (1 + t)ⁿ**.

> Plus le taux d'actualisation est élevé, plus la valeur actuelle est faible.

### VAN et TRI

- **VAN** (valeur actuelle nette) = somme des flux futurs actualisés − investissement initial. Un projet est rentable si **VAN > 0**.
- **TRI** (taux de rendement interne) : taux d'actualisation qui annule la VAN. Pour une obligation, c'est le **taux actuariel**.

### Taux nominal et taux réel

**Taux réel ≈ taux nominal − inflation.** Un placement à 3 % avec 2 % d'inflation rapporte environ 1 % en termes réels.

### Règle de 72

Le nombre d'années nécessaire pour **doubler** un capital ≈ **72 / taux (%)**. À 6 % par an : environ 12 ans.
`,
      keyPoints: [
        "Intérêts composés : C × (1 + t)ⁿ ; actualisation : F / (1 + t)ⁿ.",
        "VAN > 0 : projet rentable ; le TRI annule la VAN.",
        "Taux réel ≈ taux nominal − inflation.",
      ],
    },
    {
      id: "risque",
      title: "Rendement, risque et diversification",
      content: `
### Mesures du risque

- **Volatilité** : **écart-type** des rentabilités ; mesure la dispersion autour de la moyenne. Plus elle est élevée, plus l'actif est risqué.
- **Bêta (β)** : sensibilité d'un titre aux variations du marché.
  - β = 1 : le titre varie comme le marché ;
  - β > 1 : il amplifie les mouvements du marché (titre « offensif ») ;
  - β < 1 : il les amortit (titre « défensif »).
- **Perte maximale (*max drawdown*)** et **VaR** (*Value at Risk* : perte maximale potentielle sur une période donnée avec un niveau de confiance donné).

### Mesures de performance ajustée du risque

- **Ratio de Sharpe** = (rentabilité du portefeuille − taux sans risque) / volatilité du portefeuille. Plus il est élevé, mieux le risque est rémunéré.
- **Tracking error** : volatilité de l'écart de performance entre un fonds et son indice de référence (faible pour une gestion indicielle).
- **Ratio d'information** = surperformance / tracking error.

### La diversification

La combinaison d'actifs **imparfaitement corrélés** réduit le risque global du portefeuille.

- Le **coefficient de corrélation** varie de **−1 à +1**. Plus il est faible, plus la diversification est efficace.
- Le risque total = **risque spécifique** (diversifiable) + **risque systématique** (de marché, non diversifiable).

Le **MEDAF** (CAPM) relie la rentabilité attendue au bêta : E(R) = Rf + β × (E(Rm) − Rf).

### Le couple rendement / risque des grandes classes d'actifs

Du moins risqué au plus risqué en général : **monétaire → obligations d'État → obligations d'entreprises → actions → produits à effet de levier**. Sur longue période, le rendement espéré croît avec le risque.
`,
      keyPoints: [
        "Volatilité = écart-type des rentabilités.",
        "Bêta > 1 : titre offensif ; bêta < 1 : titre défensif.",
        "Sharpe = (Rp − Rf) / σp.",
        "Corrélation de −1 à +1 ; seul le risque spécifique est diversifiable.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Le PER (price earning ratio) se calcule comme :", ["Dividende / cours", "Cours / bénéfice par action", "Résultat net / capitaux propres", "Dette nette / capitaux propres"], 1, "PER = cours / BPA, ou capitalisation / résultat net."],
    ["A", "La capitalisation boursière d'une société est égale :", ["Au total du bilan", "Au cours de l'action multiplié par le nombre d'actions", "Aux capitaux propres comptables", "Au chiffre d'affaires"], 1, "Capitalisation = cours × nombre d'actions composant le capital."],
    ["C", "Une action cote 80 € et verse un dividende de 4 €. Son rendement est de :", ["2 %", "4 %", "5 %", "20 %"], 2, "Rendement = 4 / 80 = 5 %."],
    ["C", "Une société réalise un résultat net de 30 M€ pour 15 millions d'actions cotant 40 €. Son PER est de :", ["2", "13,3", "20", "40"], 2, "BPA = 30 / 15 = 2 € ; PER = 40 / 2 = 20."],
    ["C", "La valeur d'entreprise est égale :", ["Aux capitaux propres comptables", "À la capitalisation boursière + la dette nette", "À la capitalisation boursière − la dette nette", "Au résultat net × 10"], 1, "VE = capitalisation + dette nette (valeur de l'actif économique)."],
    ["C", "Le ROE mesure :", ["La rentabilité des capitaux propres (résultat net / capitaux propres)", "Le niveau d'endettement", "Le rendement du dividende", "La volatilité de l'action"], 0, "Return on equity = résultat net / capitaux propres."],
    ["A", "1 000 € placés à 10 % par an à intérêts composés pendant 2 ans donnent :", ["1 200 €", "1 210 €", "1 100 €", "1 020 €"], 1, "1 000 × 1,10² = 1 210 €."],
    ["C", "Si le taux d'actualisation augmente, la valeur actuelle d'un flux futur :", ["Augmente", "Diminue", "Reste identique", "Devient négative"], 1, "VA = F / (1 + t)ⁿ : plus t est élevé, plus la VA est faible."],
    ["C", "Un projet d'investissement est financièrement intéressant si :", ["Sa VAN est négative", "Sa VAN est positive", "Son TRI est inférieur au coût du capital", "Son délai de récupération est infini"], 1, "Une VAN positive signifie que le projet crée de la valeur."],
    ["C", "Avec un taux nominal de 4 % et une inflation de 3 %, le taux réel est d'environ :", ["7 %", "1 %", "-1 %", "12 %"], 1, "Taux réel ≈ 4 % − 3 % = 1 %."],
    ["A", "La volatilité d'un actif financier mesure :", ["Son rendement moyen", "La dispersion de ses rentabilités autour de la moyenne (écart-type)", "Son niveau de liquidité", "Le montant de ses dividendes"], 1, "La volatilité est l'écart-type des rentabilités."],
    ["C", "Une action ayant un bêta de 1,5 :", ["Varie en moyenne 1,5 fois plus que le marché", "Est moins risquée que le marché", "Est sans risque", "Ne dépend pas du marché"], 0, "Un bêta supérieur à 1 caractérise un titre qui amplifie les mouvements du marché."],
    ["C", "Le ratio de Sharpe se calcule comme :", ["(Rentabilité du portefeuille − taux sans risque) / volatilité du portefeuille", "Rentabilité / bêta", "Volatilité / rentabilité", "Surperformance / tracking error"], 0, "Sharpe = (Rp − Rf) / σp. (Le dernier choix est le ratio d'information.)"],
    ["C", "La diversification est la plus efficace lorsque les actifs ont une corrélation :", ["Proche de +1", "Faible, voire négative", "Exactement égale à 1", "Indifférente"], 1, "Plus la corrélation est faible, plus la réduction du risque global est importante."],
    ["C", "L'amortissement d'une immobilisation est :", ["Une charge décaissée", "Une charge non décaissée", "Un produit exceptionnel", "Un élément des capitaux propres"], 1, "L'amortissement constate une dépréciation sans sortie de trésorerie."],
    ["C", "Selon la règle de 72, un capital placé à 8 % par an double en environ :", ["6 ans", "9 ans", "12 ans", "18 ans"], 1, "72 / 8 = 9 ans."],
  ]),
};
