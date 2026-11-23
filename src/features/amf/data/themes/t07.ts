import { buildQuestions, Theme } from "../../types";

const id = "t07";

export const theme07: Theme = {
  id,
  number: 7,
  title: "Les instruments financiers, les crypto-actifs et leurs risques",
  shortTitle: "Instruments financiers",
  description:
    "Actions, obligations, titres de créance, dérivés (futures, options, swaps), produits structurés, ETF et crypto-actifs, ainsi que les risques associés.",
  duration: 45,
  sections: [
    {
      id: "categories",
      title: "Les catégories d'instruments financiers",
      content: `
Le CMF (art. L.211-1) distingue :

- les **titres financiers** :
  - **titres de capital** émis par les sociétés par actions (actions…) ;
  - **titres de créance** (obligations, titres de créance négociables…) ;
  - **parts ou actions d'organismes de placement collectif** (OPC) ;
- les **contrats financiers** (ou instruments financiers à terme) : options, futures, swaps, CFD…

> Les **effets de commerce** et les **bons de caisse** ne sont pas des instruments financiers.

### Les actions

Une action représente une fraction du **capital** d'une société. Elle confère des droits :

- **politiques** : droit de vote en assemblée générale, droit à l'information ;
- **pécuniaires** : droit au **dividende** (non garanti), droit au boni de liquidation, **droit préférentiel de souscription** lors des augmentations de capital.

Variantes : **actions de préférence** (droits particuliers, avec ou sans droit de vote), actions à **droit de vote double** (détention au nominatif depuis au moins 2 ans, automatique dans les sociétés cotées depuis la loi Florange de 2014, sauf clause contraire).

Risques : l'actionnaire est le dernier remboursé en cas de faillite ; il peut perdre **la totalité de sa mise** (mais pas plus).
`,
      keyPoints: [
        "Titres financiers = titres de capital, titres de créance, parts/actions d'OPC. Contrats financiers = dérivés.",
        "Effets de commerce et bons de caisse ne sont pas des instruments financiers.",
        "Le dividende n'est jamais garanti ; l'actionnaire est remboursé en dernier.",
      ],
    },
    {
      id: "obligations",
      title: "Les obligations et titres de créance",
      content: `
Une **obligation** est un titre de créance représentatif d'un **emprunt** émis par une entreprise, un État ou une collectivité. Elle donne droit au versement d'**intérêts** (coupons) et au **remboursement** du capital à l'échéance.

### Caractéristiques

- **valeur nominale**, **prix d'émission**, **taux de coupon** (taux nominal), **échéance** ;
- **prix exprimé en pourcentage du nominal**, hors coupon couru (« pied de coupon ») ;
- **taux actuariel** (rendement à l'échéance) : taux qui égalise le prix et la valeur actuelle des flux futurs.

### Principaux types

| Type | Particularité |
|---|---|
| Taux fixe | Coupon constant |
| Taux variable / révisable | Coupon indexé sur un taux de référence (€STR, Euribor) |
| Indexée sur l'inflation (OATi, OAT€i) | Nominal et coupon indexés |
| **Zéro coupon** | Pas de coupon ; émise en dessous du pair, remboursée au pair |
| **Convertible** | Peut être convertie en actions de l'émetteur au gré du porteur |
| Subordonnée / perpétuelle (TSDI) | Remboursée après les créanciers ordinaires ; rendement plus élevé |
| Obligation verte (*green bond*) | Fonds affectés à des projets environnementaux |

### Taux et prix

> **Quand les taux d'intérêt montent, le prix des obligations existantes baisse** (et inversement).

- La **sensibilité** mesure la variation en pourcentage du prix pour une variation de **1 point** de taux. Une obligation de sensibilité 5 perd environ 5 % si les taux montent de 1 %.
- La **duration** représente la durée de vie moyenne des flux, pondérée par leur valeur actuelle. Elle augmente avec la maturité et diminue avec le niveau du coupon. Une obligation zéro coupon a une duration égale à sa maturité.

### Le risque de crédit et la notation

Les agences de notation (S&P, Moody's, Fitch), enregistrées et supervisées par l'ESMA, évaluent la solvabilité :

- **Investment grade** : de AAA à **BBB-** (S&P/Fitch) ou Baa3 (Moody's) ;
- **High yield** (spéculatif) : BB+ et en dessous.

Plus le risque de crédit est élevé, plus le **spread** (écart de rendement avec un emprunt d'État de référence) est important.

### Les titres de créance négociables

- **NEU CP** (*Negotiable European Commercial Paper*) : durée **≤ 1 an** ;
- **NEU MTN** (*Medium Term Note*) : durée **> 1 an**.
`,
      keyPoints: [
        "Relation inverse entre taux d'intérêt et prix des obligations.",
        "Sensibilité : variation du prix (en %) pour une variation de 1 point de taux.",
        "Duration d'un zéro coupon = sa maturité.",
        "Investment grade jusqu'à BBB- ; en dessous : high yield.",
        "NEU CP ≤ 1 an ; NEU MTN > 1 an.",
      ],
    },
    {
      id: "derives",
      title: "Les instruments dérivés",
      content: `
Un instrument dérivé est un contrat dont la valeur **dépend d'un sous-jacent** (action, indice, taux, devise, matière première…). Usages : **couverture**, **spéculation** (effet de levier) ou **arbitrage**.

### Contrats fermes

- **Futures** : contrats standardisés négociés sur un **marché organisé**, avec une **chambre de compensation**, un **dépôt de garantie** initial et des **appels de marge** quotidiens.
- **Forwards** : contrats à terme **de gré à gré**, sur mesure (ex. : change à terme).
- **Swaps** : échanges de flux (ex. : swap de taux fixe contre variable).

### Les options

Une option donne à son acheteur le **droit, et non l'obligation**, d'acheter (**call**) ou de vendre (**put**) un sous-jacent à un **prix d'exercice** (*strike*) déterminé, pendant une période (option **américaine**) ou à une date donnée (option **européenne**), moyennant le paiement d'une **prime**.

| Position | Perte maximale | Gain maximal |
|---|---|---|
| Achat de call | La prime | Illimité |
| Vente de call | **Illimitée** | La prime |
| Achat de put | La prime | Prix d'exercice − prime |
| Vente de put | Prix d'exercice − prime | La prime |

**Prime = valeur intrinsèque + valeur temps.**

- Valeur intrinsèque d'un call = max(cours − strike ; 0) ; d'un put = max(strike − cours ; 0).
- Une option est **dans la monnaie** si elle a une valeur intrinsèque positive, **à la monnaie** si cours ≈ strike, **hors de la monnaie** sinon.
- La prime augmente avec la **volatilité** et la **durée de vie** restante.

### Autres produits à effet de levier

**Warrants**, **turbos** (avec barrière désactivante), **CFD** (*contracts for difference*) : produits complexes et très risqués pour les particuliers.
`,
      keyPoints: [
        "Futures : marché organisé, chambre de compensation, dépôt de garantie, appels de marge.",
        "Option : droit, pas obligation, contre une prime. Call = achat, put = vente.",
        "Le vendeur de call a un risque de perte illimité.",
        "Prime = valeur intrinsèque + valeur temps ; elle augmente avec la volatilité.",
      ],
    },
    {
      id: "structures-crypto",
      title: "Produits structurés, ETF et crypto-actifs",
      content: `
### Les produits structurés

Ils combinent généralement une composante **obligataire** (protection du capital) et une composante **optionnelle** (performance). Les termes ont un sens précis :

- **capital garanti** : garantie formelle d'un tiers ;
- **capital protégé** : protection du capital à l'échéance par la structure du produit, sans garantie formelle ;
- **autocall** : remboursement anticipé automatique si le sous-jacent atteint un seuil à une date d'observation.

Le porteur supporte le **risque de crédit de l'émetteur** et le risque de sortie avant l'échéance (prix de marché).

### Les ETF (trackers)

Fonds indiciels **cotés** en continu qui répliquent la performance d'un indice :

- réplication **physique** (détention des titres de l'indice, totale ou par échantillonnage) ;
- réplication **synthétique** (via un swap avec une contrepartie, d'où un risque de contrepartie).

Avantages : frais réduits, diversification, liquidité.

### Les crypto-actifs et le règlement MiCA

Le règlement **MiCA** (*Markets in Crypto-Assets*) distingue :

- les **jetons se référant à un ou des actifs** (*ART*) : valeur stabilisée par référence à plusieurs actifs ;
- les **jetons de monnaie électronique** (*EMT*) : valeur stabilisée par référence à **une seule monnaie officielle** (stablecoins en euro, en dollar) ;
- les **autres crypto-actifs** (bitcoin, ether, jetons utilitaires…).

Les prestataires (**PSCA / CASP**) doivent être agréés ; les émetteurs publient un **livre blanc**. Les crypto-actifs qualifiables d'instruments financiers relèvent de MIF 2.

Risques spécifiques : volatilité extrême, risque de perte totale, risques cyber (piratage, perte des clés privées), absence de garantie publique.
`,
      keyPoints: [
        "Capital garanti (garantie d'un tiers) ≠ capital protégé (protection par la structure).",
        "ETF à réplication synthétique : exposition au risque de contrepartie du swap.",
        "MiCA : ART (panier d'actifs), EMT (une seule monnaie), autres crypto-actifs.",
      ],
    },
    {
      id: "risques",
      title: "Les risques des instruments financiers",
      content: `
| Risque | Définition |
|---|---|
| **Marché** | Variation défavorable des prix (actions, taux, change, matières premières) |
| **Crédit / défaut** | Défaillance de l'émetteur ou dégradation de sa notation |
| **Contrepartie** | Défaillance de la contrepartie d'une transaction (notamment de gré à gré) |
| **Liquidité** | Impossibilité de vendre rapidement sans décote importante |
| **Change** | Variation défavorable d'une devise |
| **Taux** | Variation des taux d'intérêt (baisse du prix des obligations quand les taux montent) |
| **Opérationnel** | Défaillance des processus, des systèmes ou des personnes |
| **Durabilité** | Événement environnemental, social ou de gouvernance ayant une incidence négative sur la valeur |

> **Plus le rendement espéré est élevé, plus le risque est élevé.** La **diversification** réduit le risque spécifique, mais pas le risque de marché (systématique).
`,
      keyPoints: [
        "Risque de contrepartie surtout marqué sur le gré à gré.",
        "La diversification réduit le risque spécifique, pas le risque systématique.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Lequel de ces éléments n'est PAS un instrument financier ?", ["Une action", "Une obligation", "Un effet de commerce", "Une part de FCP"], 2, "Les effets de commerce et les bons de caisse sont exclus de la définition des instruments financiers."],
    ["A", "Que se passe-t-il pour le prix d'une obligation à taux fixe déjà émise lorsque les taux d'intérêt du marché montent ?", ["Il monte", "Il baisse", "Il reste stable", "Il est automatiquement révisé au pair"], 1, "Le prix des obligations varie en sens inverse des taux d'intérêt."],
    ["A", "L'acheteur d'une option d'achat (call) :", ["A l'obligation d'acheter le sous-jacent", "A le droit d'acheter le sous-jacent au prix d'exercice", "A le droit de vendre le sous-jacent", "Encaisse la prime"], 1, "L'acheteur paie une prime et dispose du droit, sans obligation, d'acheter au strike."],
    ["A", "Quelle position sur options présente un risque de perte illimité ?", ["Achat de call", "Achat de put", "Vente de call", "Vente de put"], 2, "Le vendeur de call doit livrer le sous-jacent quelle que soit la hausse : sa perte est théoriquement illimitée."],
    ["C", "Une obligation a une sensibilité de 4. Si les taux augmentent de 0,5 %, son prix varie d'environ :", ["+2 %", "-2 %", "-4 %", "-0,5 %"], 1, "Variation ≈ -sensibilité × variation des taux = -4 × 0,5 % = -2 %."],
    ["C", "La duration d'une obligation zéro coupon est :", ["Nulle", "Égale à sa maturité résiduelle", "Toujours égale à 1", "Supérieure à sa maturité"], 1, "Le seul flux étant le remboursement final, la duration est égale à la maturité."],
    ["C", "Une notation BB+ correspond à la catégorie :", ["Investment grade", "High yield (spéculative)", "Défaut", "Monétaire"], 1, "L'investment grade s'arrête à BBB- ; BB+ et en dessous constituent le high yield."],
    ["C", "La prime d'une option est composée :", ["De la valeur intrinsèque et de la valeur temps", "Du coupon et du nominal", "Du dépôt de garantie et des appels de marge", "Du strike et de la volatilité"], 0, "Prime = valeur intrinsèque + valeur temps."],
    ["C", "Un call de prix d'exercice 50 € sur une action cotant 58 € a une valeur intrinsèque de :", ["0 €", "8 €", "50 €", "58 €"], 1, "Valeur intrinsèque du call = cours − strike = 58 − 50 = 8 €."],
    ["C", "Les contrats futures se caractérisent notamment par :", ["Une négociation de gré à gré sur mesure", "Une standardisation, une chambre de compensation et des appels de marge quotidiens", "L'absence de dépôt de garantie", "Un droit et non une obligation"], 1, "Les futures sont standardisés, compensés et font l'objet d'appels de marge."],
    ["C", "Un ETF à réplication synthétique expose l'investisseur :", ["À aucun risque", "Au risque de contrepartie du swap", "Uniquement au risque de change", "À un risque de perte supérieur à la mise"], 1, "La performance est obtenue par un swap : la défaillance de la contrepartie est un risque spécifique."],
    ["C", "Sous MiCA, un stablecoin adossé uniquement à l'euro est un :", ["Jeton se référant à un ou des actifs (ART)", "Jeton de monnaie électronique (EMT)", "Jeton utilitaire", "Instrument financier MIF 2"], 1, "L'EMT stabilise sa valeur par référence à une seule monnaie officielle."],
    ["C", "Un NEU CP est un titre de créance négociable d'une durée :", ["Inférieure ou égale à 1 an", "Comprise entre 1 et 5 ans", "Supérieure à 7 ans", "Perpétuelle"], 0, "Le NEU CP est un titre court terme (≤ 1 an) ; le NEU MTN dépasse 1 an."],
    ["C", "La diversification d'un portefeuille permet de réduire :", ["Le risque systématique", "Le risque spécifique", "Tous les risques", "Uniquement le risque de change"], 1, "Le risque de marché (systématique) n'est pas diversifiable."],
    ["C", "Le droit préférentiel de souscription permet à l'actionnaire :", ["De recevoir un dividende majoré", "De souscrire en priorité aux augmentations de capital en numéraire", "De voter deux fois", "D'être remboursé avant les créanciers"], 1, "Le DPS protège l'actionnaire de la dilution lors d'une augmentation de capital en numéraire."],
    ["C", "Une obligation convertible :", ["Peut être échangée en actions de l'émetteur au gré du porteur", "Est toujours remboursée en devises", "Ne verse jamais de coupon", "Est un dérivé de gré à gré"], 0, "Le porteur dispose d'une option de conversion en actions."],
  ]),
};
