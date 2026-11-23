import { buildQuestions, Theme } from "../../types";

const id = "t09";

export const theme09: Theme = {
  id,
  number: 9,
  title: "Le fonctionnement et l'organisation des marchés",
  shortTitle: "Marchés financiers",
  description:
    "Lieux de négociation (marché réglementé, SMN, OTF), Euronext, types d'ordres, séances de cotation, indices et franchissements de seuils.",
  duration: 35,
  sections: [
    {
      id: "lieux",
      title: "Les lieux d'exécution",
      content: `
### Marché primaire et marché secondaire

- **Marché primaire** : émission de titres nouveaux (introduction en bourse, augmentation de capital, émission obligataire) — l'émetteur se finance.
- **Marché secondaire** : échange de titres déjà émis entre investisseurs — il assure la **liquidité**.

### Les lieux de négociation sous MIF 2

| Lieu | Caractéristiques | Exemples |
|---|---|---|
| **Marché réglementé (MR)** | Système multilatéral, règles non discrétionnaires, géré par une **entreprise de marché** ; agrément par le ministre sur proposition de l'AMF | Euronext Paris |
| **SMN / MTF** (système multilatéral de négociation) | Système multilatéral non discrétionnaire, géré par un PSI ou une entreprise de marché ; règles moins contraignantes pour les émetteurs | **Euronext Growth**, **Euronext Access** |
| **OTF** (système organisé de négociation) | Système multilatéral **discrétionnaire**, réservé aux instruments **autres que les actions** (obligations, dérivés…) | — |

Hors lieux de négociation :

- **Internalisateur systématique (IS)** : PSI qui exécute, de façon organisée, fréquente et substantielle, les ordres de ses clients **contre son compte propre** ;
- **Gré à gré (OTC)** : négociation bilatérale.

MIF 2 impose une **transparence pré-négociation** (publication des prix acheteurs/vendeurs) et **post-négociation** (publication des transactions) ainsi que des **déclarations de transactions** au régulateur.

### Euronext

**Euronext** exploite des marchés réglementés à Paris, Amsterdam, Bruxelles, Lisbonne, Dublin, Oslo et Milan. À Paris :

- **Euronext Paris** (MR) : compartiments A (capitalisation > 1 Md€), B (150 M€ à 1 Md€) et C (< 150 M€) ;
- **Euronext Growth** (SMN) : PME en croissance ;
- **Euronext Access** (SMN) : jeunes entreprises, conditions d'accès allégées.
`,
      keyPoints: [
        "Primaire = émission ; secondaire = échange et liquidité.",
        "OTF : discrétionnaire et interdit aux actions. SMN : Euronext Growth et Access.",
        "Internalisateur systématique : exécute contre son compte propre de manière organisée et fréquente.",
        "Euronext Paris : compartiments A (> 1 Md€), B, C (< 150 M€).",
      ],
    },
    {
      id: "cotation",
      title: "La cotation et les ordres de bourse",
      content: `
### Les modes de cotation

- **Continu** pour les valeurs liquides ;
- **Fixing** (deux fixings par jour, à 10h30 et 16h30) pour les valeurs peu liquides.

### Journée type d'une valeur en continu (Euronext Paris)

| Horaire | Phase |
|---|---|
| 7h15 – 9h00 | **Pré-ouverture** : accumulation des ordres sans transaction |
| 9h00 | **Fixing d'ouverture** |
| 9h00 – 17h30 | **Séance continue** |
| 17h30 – 17h35 | **Pré-clôture** |
| 17h35 | **Fixing de clôture** |
| 17h35 – 17h40 | **Négociation au dernier cours** (*trading at last*) |

Le cours de fixing est celui qui permet d'échanger le **plus grand nombre de titres**.

### Les seuils de réservation

Pour éviter des variations excessives, Euronext suspend temporairement la cotation (**réservation**) lorsque le cours sort de seuils **statiques** (par rapport au cours de référence) ou **dynamiques** (par rapport au dernier cours).

### Les types d'ordres

| Ordre | Fonctionnement | Risque |
|---|---|---|
| **Au marché** | Exécuté au prix du marché, prioritaire | Pas de maîtrise du prix |
| **À cours limité** | Prix maximum à l'achat / minimum à la vente | Exécution partielle ou nulle |
| **À la meilleure limite** | Exécuté à la meilleure limite opposée ; le solde devient un ordre limité à ce prix | Exécution partielle |
| **À seuil de déclenchement** (*stop*) | Devient un ordre au marché dès que le seuil est atteint | Prix d'exécution non maîtrisé |
| **À plage de déclenchement** (*stop limit*) | Devient un ordre à cours limité dès que le seuil est atteint | Non-exécution possible |

Les ordres « stop » servent souvent à **limiter les pertes** (*stop loss*) ou à suivre une tendance.

### La validité des ordres

- **Jour** : valable pour la séance ;
- **À date déterminée** ;
- **À révocation** : valable jusqu'à son annulation, dans la limite de **1 an** ;
- **Exécuter et éliminer** (*Fill and Kill / IOC*) : exécution immédiate de ce qui est possible, le solde est annulé ;
- **Tout ou rien** (*Fill or Kill*) : exécution totale immédiate ou annulation.

### Le SRD

Le **service de règlement différé** permet, pour les valeurs les plus liquides, de reporter le règlement et la livraison au dernier jour du mois boursier, moyennant une **commission**. Il offre un **effet de levier** (couverture exigée) et permet la vente à découvert. La **liquidation** intervient **5 jours de bourse avant la fin du mois**.
`,
      keyPoints: [
        "Euronext Paris : pré-ouverture 7h15, ouverture 9h, continu jusqu'à 17h30, fixing de clôture 17h35.",
        "Ordre au marché : prioritaire mais prix non maîtrisé. Ordre limité : prix maîtrisé mais exécution incertaine.",
        "Stop (seuil) → ordre au marché ; stop limit (plage) → ordre à cours limité.",
        "Validité « à révocation » : 1 an maximum.",
      ],
    },
    {
      id: "indices",
      title: "Les indices boursiers",
      content: `
- **CAC 40** : les 40 plus grandes valeurs cotées sur Euronext Paris, pondérées par la **capitalisation flottante** (base 1 000 au 31 décembre 1987) ;
- **CAC Next 20**, **SBF 120**, **CAC Mid 60**, **CAC Small**, **CAC All-Tradable** ;
- **Euro Stoxx 50** (zone euro), **Stoxx Europe 600** ;
- **S&P 500**, **Dow Jones**, **Nasdaq** (États-Unis), **Nikkei 225** (Japon).

On distingue l'**indice de prix** (hors dividendes, comme le CAC 40 « classique ») et l'**indice de rendement** (dividendes réinvestis, comme le CAC 40 GR). Les indices de référence (*benchmarks*) sont encadrés par le **règlement BMR**.
`,
      keyPoints: [
        "CAC 40 : 40 valeurs, pondérées par la capitalisation flottante, base 1 000 au 31/12/1987.",
        "Indice de prix (hors dividendes) ≠ indice de rendement (dividendes réinvestis).",
      ],
    },
    {
      id: "seuils",
      title: "Franchissements de seuils et offres obligatoires",
      content: `
### Les déclarations de franchissement de seuils

Toute personne, agissant seule ou de concert, qui vient à détenir (à la hausse comme à la baisse) une fraction du capital ou des droits de vote d'une société cotée sur un marché réglementé franchissant l'un des seuils suivants :

> **5 %, 10 %, 15 %, 20 %, 25 %, 30 %, 1/3, 50 %, 2/3, 90 % et 95 %**

doit en informer la **société** et l'**AMF** au plus tard avant la clôture du **4e jour de négociation** suivant le franchissement. Les statuts peuvent prévoir des seuils supplémentaires (à partir de 0,5 %).

Une **déclaration d'intention** (objectifs pour les 6 mois à venir) est requise en cas de franchissement des seuils de 10 %, 15 %, 20 % et 25 %.

Sanction en cas de défaut : **privation des droits de vote** pour les actions excédentaires pendant 2 ans.

### L'offre publique obligatoire

Le franchissement du seuil de **30 % du capital ou des droits de vote** oblige à déposer un projet d'**offre publique** (OPA) visant la totalité du capital. C'est également le cas pour un actionnaire détenant entre 30 % et 50 % qui augmente sa participation de **plus de 1 % en moins de 12 mois**.

### Le retrait obligatoire

À l'issue d'une offre, un actionnaire détenant au moins **90 %** du capital et des droits de vote peut mettre en œuvre un **retrait obligatoire** : les minoritaires sont indemnisés et la société est radiée de la cote.
`,
      keyPoints: [
        "Seuils : 5, 10, 15, 20, 25, 30, 1/3, 50, 2/3, 90 et 95 % ; déclaration sous 4 jours de négociation.",
        "Déclaration d'intention aux seuils de 10, 15, 20 et 25 %.",
        "Offre publique obligatoire au-delà de 30 % (ou +1 % en 12 mois entre 30 et 50 %).",
        "Retrait obligatoire possible à partir de 90 %.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Le marché primaire est le marché :", ["Des titres déjà émis", "Des émissions de titres nouveaux", "Des produits dérivés uniquement", "Des devises"], 1, "Le marché primaire est celui de l'émission ; le secondaire celui de l'échange de titres existants."],
    ["A", "Un OTF (système organisé de négociation) :", ["Peut négocier des actions", "Est un système discrétionnaire réservé aux instruments autres que les actions", "Est un marché réglementé", "Est un internalisateur systématique"], 1, "L'OTF est discrétionnaire et ne peut pas accueillir d'actions."],
    ["C", "Euronext Growth est :", ["Un marché réglementé", "Un système multilatéral de négociation (SMN)", "Un OTF", "Une chambre de compensation"], 1, "Euronext Growth et Euronext Access sont des SMN."],
    ["A", "Un ordre au marché :", ["Garantit le prix d'exécution", "Est prioritaire mais ne permet pas de maîtriser le prix d'exécution", "N'est jamais exécuté", "N'est valable qu'au fixing"], 1, "Il est prioritaire sur les autres ordres mais le prix n'est pas maîtrisé."],
    ["A", "Un ordre à cours limité à l'achat à 50 € :", ["Sera exécuté à n'importe quel prix", "Sera exécuté à un prix inférieur ou égal à 50 €", "Sera exécuté à un prix supérieur ou égal à 50 €", "Devient un ordre au marché à 50 €"], 1, "À l'achat, la limite est un prix maximum."],
    ["C", "Un ordre à seuil de déclenchement (stop) :", ["Devient un ordre au marché dès que le seuil est atteint", "Devient un ordre à cours limité", "Est annulé si le seuil est atteint", "Ne peut être passé qu'à la vente"], 0, "Le stop se transforme en ordre au marché ; le stop limit (plage de déclenchement) en ordre limité."],
    ["C", "La durée maximale de validité d'un ordre « à révocation » est de :", ["1 jour", "1 mois", "1 an", "Illimitée"], 2, "L'ordre à révocation reste valable jusqu'à son annulation, dans la limite de 1 an."],
    ["C", "Sur Euronext Paris, la séance de cotation en continu se termine à :", ["16h30", "17h30", "17h35", "18h00"], 1, "Continu de 9h à 17h30, puis pré-clôture et fixing de clôture à 17h35."],
    ["C", "Le cours d'un fixing est déterminé de façon à :", ["Maximiser le prix", "Échanger le plus grand nombre de titres", "Égaliser le nombre d'ordres d'achat et de vente", "Reproduire le cours de la veille"], 1, "Le cours d'équilibre maximise le volume échangé."],
    ["C", "Le CAC 40 est pondéré :", ["De façon équipondérée", "Par la capitalisation flottante", "Par le chiffre d'affaires", "Par le cours des actions"], 1, "La pondération se fait selon la capitalisation boursière flottante."],
    ["A", "Le franchissement à la hausse du seuil de 5 % du capital d'une société cotée doit être déclaré :", ["Uniquement à la société, sous 15 jours", "À la société et à l'AMF, avant la clôture du 4e jour de négociation", "À l'ACPR sous 1 mois", "Il n'y a aucune obligation à 5 %"], 1, "Déclaration à la société et à l'AMF au plus tard avant la clôture du 4e jour de négociation."],
    ["A", "Le dépôt d'une offre publique devient obligatoire lorsqu'un actionnaire franchit le seuil de :", ["20 %", "30 %", "50 %", "66,66 %"], 1, "Le seuil de déclenchement de l'offre obligatoire est de 30 % du capital ou des droits de vote."],
    ["C", "Le retrait obligatoire peut être mis en œuvre par un actionnaire détenant au moins :", ["66,66 %", "75 %", "90 %", "95 %"], 2, "Depuis la loi PACTE (2019), le seuil est de 90 % du capital et des droits de vote."],
    ["C", "Le SRD (service de règlement différé) permet :", ["De différer le paiement d'un an", "De reporter le règlement-livraison à la fin du mois boursier, avec un effet de levier", "D'acheter des OPCVM à cours connu", "D'éviter toute commission"], 1, "Le SRD reporte le dénouement à la liquidation mensuelle, contre une commission."],
    ["C", "Un internalisateur systématique :", ["Est une entreprise de marché", "Exécute les ordres de ses clients contre son compte propre de manière organisée, fréquente et substantielle", "Est une chambre de compensation", "Est un SMN"], 1, "C'est un PSI qui se porte contrepartie des ordres clients hors lieu de négociation."],
  ]),
};
