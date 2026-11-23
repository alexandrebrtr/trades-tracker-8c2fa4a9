import { buildQuestions, Theme } from "../../types";

const id = "t08";

export const theme08: Theme = {
  id,
  number: 8,
  title: "La gestion pour compte de tiers et la finance durable",
  shortTitle: "Gestion collective & ESG",
  description:
    "OPCVM et FIA, SICAV et FCP, acteurs de la gestion, ratios, valeur liquidative, frais, gestion sous mandat, SFDR, taxonomie et labels.",
  duration: 40,
  sections: [
    {
      id: "opc",
      title: "Les organismes de placement collectif",
      content: `
Un **OPC** collecte l'épargne de plusieurs investisseurs pour l'investir selon une politique d'investissement définie, dans l'intérêt des porteurs.

### OPCVM et FIA

| | **OPCVM** (UCITS) | **FIA** (AIF) |
|---|---|---|
| Directive | OPCVM (2009/65/CE) | AIFM (2011/61/UE) |
| Passeport européen | Oui, pour la commercialisation auprès de tous les investisseurs | Passeport pour les clients professionnels |
| Règles d'investissement | Strictes et harmonisées (ratios de diversification, liquidité) | Plus souples selon les catégories |
| Exemples | SICAV et FCP « coordonnés » | FIVG, FCPR, FCPI, FIP, OPCI, SCPI, FPS, fonds de fonds alternatifs, ELTIF… |

### SICAV et FCP

| **SICAV** | **FCP** |
|---|---|
| Société anonyme (ou SAS) à capital variable | Copropriété de valeurs mobilières |
| Dotée de la **personnalité morale** | **Sans personnalité morale** |
| Investisseurs = **actionnaires**, avec droit de vote | Investisseurs = **porteurs de parts**, sans droit de vote |
| Conseil d'administration | Représenté par la société de gestion |

### Les principaux FIA

- **FCPR** (capital-investissement : au moins 50 % de titres non cotés) ;
- **FCPI** (innovation : au moins 70 % d'entreprises innovantes) et **FIP** (proximité : PME régionales) — avantages fiscaux, durée de blocage longue ;
- **SCPI** (immobilier, non cotées) et **OPCI** ;
- **FPS** (fonds professionnels spécialisés) réservés aux investisseurs avertis ;
- **ELTIF** (fonds européens d'investissement à long terme).

### Les fonds monétaires

Encadrés par le **règlement MMF**, ils investissent dans des instruments du marché monétaire à court terme. Catégories : VNAV (valeur liquidative variable), LVNAV, VNAV de dette publique (CNAV).
`,
      keyPoints: [
        "OPCVM : directive UCITS, passeport pour tous les investisseurs, règles strictes. FIA : directive AIFM.",
        "SICAV : personnalité morale, actionnaires avec droit de vote. FCP : copropriété, pas de personnalité morale.",
        "FCPR ≥ 50 % de non coté ; FCPI ≥ 70 % d'entreprises innovantes.",
      ],
    },
    {
      id: "acteurs-fonctionnement",
      title: "Acteurs, ratios et fonctionnement",
      content: `
### Les acteurs

- **Société de gestion de portefeuille (SGP)** : agréée par l'AMF, prend les décisions d'investissement, agit dans l'intérêt exclusif des porteurs.
- **Dépositaire** (établissement de crédit ou entreprise d'investissement) : assure la **garde des actifs**, le **contrôle de la régularité** des décisions de la SGP et le **suivi des flux** de liquidités. Il est indépendant de la SGP.
- **Commissaire aux comptes** : certifie les comptes de l'OPC.
- **Valorisateur** et **centralisateur** des ordres de souscription/rachat.
- **Distributeurs** : commercialisent les parts.

### La valeur liquidative (VL)

**VL = actif net / nombre de parts.** Les souscriptions et rachats s'effectuent à **cours inconnu** : l'ordre est centralisé avant une heure limite et exécuté sur la prochaine VL (pratique dite de « *forward pricing* »). Le *late trading* (passer un ordre après l'heure limite sur une VL déjà connue) est interdit.

Des outils de gestion de la liquidité peuvent être activés : **gates** (plafonnement des rachats), **swing pricing**, droits ajustables…

### Les ratios OPCVM (règle « 5/10/40 »)

- au maximum **5 %** de l'actif dans les titres d'un même émetteur ;
- cette limite peut être portée à **10 %**, à condition que la somme des lignes dépassant 5 % ne représente pas plus de **40 %** de l'actif ;
- jusqu'à **35 %** dans des titres émis ou garantis par un État de l'EEE, et même **100 %** si au moins **6 émissions** différentes, aucune ne dépassant **30 %**.

### Les frais

| Frais | Remarque |
|---|---|
| Frais d'entrée (souscription) | Souvent en partie acquis au distributeur |
| Frais de sortie (rachat) | Peuvent être acquis au fonds |
| Frais de gestion | Prélevés sur l'actif, ils réduisent la VL |
| Commission de surperformance | Calculée selon un indicateur de référence, avec une période de référence et un mécanisme de rattrapage des sous-performances |
| Frais de transaction | Liés aux opérations du portefeuille |

### Gestion collective et gestion individuelle

La **gestion sous mandat** (individuelle) repose sur un **mandat de gestion** écrit précisant les objectifs, les catégories d'instruments, les modalités d'information et de rémunération. L'établissement est soumis aux obligations d'adéquation.
`,
      keyPoints: [
        "Dépositaire : garde des actifs, contrôle de régularité, suivi des flux de liquidités.",
        "VL = actif net / nombre de parts ; souscriptions et rachats à cours inconnu.",
        "Ratios OPCVM : 5/10/40 ; jusqu'à 35 % (voire 100 % avec 6 émissions) en titres d'État.",
      ],
    },
    {
      id: "durable",
      title: "La finance durable",
      content: `
### Le règlement SFDR (*Sustainable Finance Disclosure Regulation*)

Applicable depuis **mars 2021**, il impose aux acteurs financiers de publier des informations sur la prise en compte des **risques de durabilité** et des **principales incidences négatives** (PAI). Il classe les produits :

| Article | Produit |
|---|---|
| **Article 6** | Pas de caractéristiques ESG particulières (mais information sur les risques de durabilité) |
| **Article 8** | Produit qui **promeut** des caractéristiques environnementales ou sociales |
| **Article 9** | Produit qui a un **objectif d'investissement durable** |

### La taxonomie européenne

Système de classification des activités économiques **durables sur le plan environnemental**, autour de **6 objectifs** :

1. atténuation du changement climatique ;
2. adaptation au changement climatique ;
3. utilisation durable et protection des ressources aquatiques et marines ;
4. transition vers une économie circulaire ;
5. prévention et réduction de la pollution ;
6. protection et restauration de la biodiversité et des écosystèmes.

Une activité est alignée si elle **contribue substantiellement** à au moins un objectif, **ne cause pas de préjudice important** aux autres (*DNSH*) et respecte des **garanties sociales minimales**.

### Les approches ESG

- **Exclusions** (sectorielles ou normatives : armes controversées, charbon…) ;
- **Best in class** : sélection des meilleurs émetteurs d'un secteur ;
- **Best in universe** et **best effort** ;
- **Thématique** (eau, énergies renouvelables…) ;
- **Engagement actionnarial** (dialogue, vote en assemblée générale) ;
- **Investissement à impact**.

### Labels et règles de communication

- **Label ISR** (État, réformé en 2024 : exclusions renforcées, notamment des énergies fossiles) ;
- **Label Greenfin** (financement de la transition écologique) ;
- **Label Finansol** (finance solidaire).

La **doctrine AMF** encadre la communication : un fonds ne peut mettre en avant l'ESG de façon centrale que si son approche est **significativement engageante**. Les **orientations ESMA** sur les noms de fonds (2024) fixent des seuils (au moins 80 % d'investissements alignés) pour utiliser des termes ESG dans le nom. Le risque de **greenwashing** (écoblanchiment) est un axe de contrôle prioritaire.
`,
      keyPoints: [
        "SFDR : article 6 (pas d'objectif ESG), article 8 (promotion E/S), article 9 (objectif d'investissement durable).",
        "Taxonomie : 6 objectifs environnementaux, contribution substantielle + DNSH + garanties sociales minimales.",
        "Labels : ISR, Greenfin, Finansol. Lutte contre le greenwashing.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Quelle est la principale différence juridique entre une SICAV et un FCP ?", ["La SICAV n'a pas de dépositaire", "La SICAV a la personnalité morale, le FCP non", "Le FCP est toujours un FIA", "La SICAV est réservée aux professionnels"], 1, "La SICAV est une société ; le FCP est une copropriété sans personnalité morale."],
    ["A", "Le dépositaire d'un OPCVM a notamment pour mission :", ["De prendre les décisions d'investissement", "D'assurer la garde des actifs et le contrôle de la régularité des décisions de la société de gestion", "De distribuer exclusivement les parts", "De fixer les frais de gestion"], 1, "Le dépositaire conserve les actifs, contrôle la régularité des décisions et suit les flux de liquidités."],
    ["A", "La valeur liquidative d'un OPC est égale :", ["Au cours de bourse moyen des titres détenus", "À l'actif net divisé par le nombre de parts", "Au capital initial divisé par le nombre de porteurs", "Au chiffre d'affaires de la société de gestion"], 1, "VL = actif net / nombre de parts (ou d'actions)."],
    ["C", "Les souscriptions et rachats de parts d'OPC s'effectuent généralement :", ["À cours connu", "À cours inconnu", "Au cours d'ouverture de la bourse", "Au prix fixé par le client"], 1, "L'ordre est exécuté sur la prochaine VL calculée après l'heure de centralisation."],
    ["C", "Selon la règle des ratios des OPCVM, un OPCVM peut investir au maximum dans les titres d'un même émetteur privé :", ["5 %, porté à 10 % si les lignes de plus de 5 % ne dépassent pas 40 % au total", "20 % sans condition", "50 %", "100 %"], 0, "C'est la règle des 5/10/40."],
    ["C", "Quelle directive encadre les gestionnaires de fonds d'investissement alternatifs ?", ["MIF 2", "AIFM", "PRIIPs", "CRD"], 1, "La directive AIFM de 2011 encadre les gestionnaires de FIA."],
    ["C", "Un FCPI doit investir au moins :", ["10 % dans des sociétés cotées", "50 % dans des titres non cotés", "70 % dans des entreprises innovantes", "100 % dans des obligations"], 2, "Le quota d'investissement d'un FCPI est de 70 % en entreprises innovantes."],
    ["C", "Le late trading consiste à :", ["Investir à long terme", "Passer un ordre de souscription/rachat après l'heure limite sur une valeur liquidative déjà connue", "Retarder la publication de la VL", "Facturer des frais de sortie"], 1, "Le late trading est une pratique frauduleuse interdite."],
    ["A", "Au sens du règlement SFDR, un fonds qui a un objectif d'investissement durable est classé :", ["Article 6", "Article 8", "Article 9", "Article 12"], 2, "L'article 9 concerne les produits ayant un objectif d'investissement durable."],
    ["C", "Un fonds « article 8 » SFDR est un fonds qui :", ["N'intègre aucun critère ESG", "Promeut des caractéristiques environnementales ou sociales", "Est obligatoirement labellisé ISR", "Investit 100 % dans des activités alignées sur la taxonomie"], 1, "L'article 8 vise les produits qui promeuvent des caractéristiques E ou S."],
    ["C", "Combien d'objectifs environnementaux la taxonomie européenne comporte-t-elle ?", ["3", "4", "6", "17"], 2, "La taxonomie compte 6 objectifs environnementaux (17 correspond aux ODD de l'ONU)."],
    ["C", "Le principe DNSH de la taxonomie signifie :", ["« Do No Significant Harm » : ne pas causer de préjudice important aux autres objectifs", "Détenir des titres notés AAA", "Réaliser une contribution sociale minimale", "Publier un rapport trimestriel"], 0, "Une activité alignée ne doit pas nuire significativement aux autres objectifs environnementaux."],
    ["C", "L'approche « best in class » consiste à :", ["Exclure un secteur entier", "Sélectionner les émetteurs les mieux notés sur le plan ESG au sein de chaque secteur", "Investir uniquement dans des obligations vertes", "Voter systématiquement contre les résolutions"], 1, "Le best in class sélectionne les meilleurs acteurs de chaque secteur d'activité."],
    ["C", "Les frais de gestion d'un OPC :", ["Sont payés par chèque séparé par le porteur", "Sont prélevés sur l'actif et diminuent la valeur liquidative", "Sont toujours nuls", "Sont versés au dépositaire uniquement"], 1, "Les frais de gestion sont prélevés directement sur l'actif du fonds."],
  ]),
};
