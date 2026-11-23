import { buildQuestions, Theme } from "../../types";

const id = "t03";

export const theme03: Theme = {
  id,
  number: 3,
  title: "Sécurité financière : lutte contre le blanchiment et le financement du terrorisme",
  shortTitle: "LCB-FT",
  description:
    "Le blanchiment et ses étapes, les obligations de vigilance, la déclaration de soupçon à Tracfin, le gel des avoirs et la lutte anti-corruption.",
  duration: 30,
  sections: [
    {
      id: "blanchiment",
      title: "Le blanchiment de capitaux et le financement du terrorisme",
      content: `
Le **blanchiment** consiste à faciliter la justification mensongère de l'origine des biens ou revenus de l'auteur d'un crime ou délit, ou à apporter un concours à une opération de placement, de dissimulation ou de conversion du produit d'un crime ou délit (art. 324-1 du Code pénal).

> Tout crime ou délit puni de plus d'un an d'emprisonnement peut être l'infraction d'origine, **y compris la fraude fiscale**.

### Les trois étapes du blanchiment

1. **Placement** (prélavage) : introduction des fonds illicites dans le système financier (dépôts d'espèces fractionnés, achats de biens…) ;
2. **Empilement** (dissimulation / *layering*) : multiplication des opérations pour brouiller la trace (virements internationaux, sociétés écrans…) ;
3. **Intégration** : réinjection des fonds « blanchis » dans l'économie légale (immobilier, investissements…).

### Le financement du terrorisme

Il peut porter sur des fonds **d'origine licite** : c'est leur **destination** qui est criminelle. Les montants sont souvent faibles.

### Sanctions pénales

| Infraction | Peine |
|---|---|
| Blanchiment simple | 5 ans d'emprisonnement et 375 000 € d'amende |
| Blanchiment aggravé (habituel, en bande organisée, ou en utilisant les facilités d'une profession) | 10 ans et 750 000 € |

L'amende peut être portée à la moitié de la valeur des biens blanchis.

### Les acteurs

- **GAFI / FATF** : créé en 1989 par le G7 à Paris, il publie **40 recommandations** et des listes de pays à haut risque.
- **Tracfin** : cellule de renseignement financier française, rattachée aux ministères économiques et financiers, qui reçoit les déclarations de soupçon.
- **AMLA** : autorité européenne de lutte contre le blanchiment (Francfort), créée en 2024.
- **ACPR et AMF** : contrôlent le respect des obligations par les établissements assujettis et sanctionnent les manquements.
`,
      keyPoints: [
        "Trois étapes : placement, empilement (dissimulation), intégration.",
        "La fraude fiscale peut être l'infraction d'origine du blanchiment.",
        "Le financement du terrorisme peut utiliser des fonds d'origine licite.",
        "Blanchiment simple : 5 ans et 375 000 € ; aggravé : 10 ans et 750 000 €.",
      ],
    },
    {
      id: "vigilance",
      title: "Les obligations de vigilance",
      content: `
L'approche est **fondée sur les risques** : l'établissement établit une **classification des risques** (clients, produits, canaux de distribution, pays) et adapte l'intensité de sa vigilance.

### Connaissance du client (KYC)

Avant d'entrer en relation, l'établissement doit :

- **identifier** le client et **vérifier** son identité sur présentation d'un document probant ;
- identifier le **bénéficiaire effectif** : la personne physique qui détient, directement ou indirectement, **plus de 25 % du capital ou des droits de vote**, ou exerce un contrôle ;
- recueillir des informations sur l'**objet et la nature** de la relation d'affaires.

Pendant toute la relation : **vigilance constante**, mise à jour des informations, examen attentif des opérations.

### Niveaux de vigilance

| Niveau | Exemples |
|---|---|
| **Simplifiée** | Risque faible (ex. : clients établissements financiers de l'UE, sociétés cotées) |
| **Standard** | Cas général |
| **Renforcée** | **PPE** (personnes politiquement exposées), pays tiers à haut risque identifiés par le GAFI / la Commission, relations de correspondance bancaire, opérations complexes ou d'un montant inhabituellement élevé |

Une **PPE** exerce ou a cessé d'exercer depuis **moins d'un an** une fonction politique, juridictionnelle ou administrative importante ; ses proches et membres de la famille sont également visés. L'entrée en relation avec une PPE requiert l'**autorisation d'un membre de la direction**.

### Examen renforcé

Toute opération **particulièrement complexe**, d'un **montant inhabituellement élevé** ou **sans justification économique apparente** fait l'objet d'un examen renforcé : l'établissement se renseigne sur l'origine et la destination des fonds.

### Conservation

Les documents relatifs à l'identité des clients et aux opérations sont conservés **5 ans** à compter de la clôture du compte ou de la cessation de la relation (ou de l'opération pour un client occasionnel).
`,
      keyPoints: [
        "Bénéficiaire effectif : plus de 25 % du capital ou des droits de vote, ou contrôle.",
        "Vigilance renforcée : PPE (jusqu'à 1 an après la fin des fonctions), pays à haut risque, opérations inhabituelles.",
        "Conservation des documents : 5 ans après la fin de la relation.",
      ],
    },
    {
      id: "declaration",
      title: "La déclaration de soupçon et le gel des avoirs",
      content: `
### La déclaration de soupçon (DS) à Tracfin

L'établissement doit déclarer à Tracfin les sommes ou opérations dont il **sait, soupçonne ou a de bonnes raisons de soupçonner** qu'elles proviennent d'une infraction passible de plus d'un an d'emprisonnement ou participent au financement du terrorisme.

- **Aucun seuil** de montant ;
- déclaration effectuée par le **déclarant Tracfin** désigné (souvent au sein de la conformité) ;
- en principe **avant l'exécution** de l'opération ; Tracfin peut s'opposer à son exécution ;
- **confidentialité absolue** : il est interdit d'informer le client ou un tiers de l'existence de la déclaration (délit pénal) ;
- **immunité** : aucune poursuite pour dénonciation calomnieuse ou violation du secret professionnel contre le déclarant de bonne foi.

### La communication systématique d'informations (COSI)

Indépendamment de tout soupçon, certaines opérations sont transmises automatiquement à Tracfin, par exemple les **versements ou retraits d'espèces** dont le montant cumulé sur un mois dépasse **10 000 €**, ou les transmissions de fonds réalisées en espèces au-delà de certains seuils.

### Le paiement en espèces

Il est limité à **1 000 €** entre un professionnel et un particulier résidant fiscalement en France (seuil plus élevé pour les non-résidents).

### Le gel des avoirs

Les établissements doivent appliquer **immédiatement** les mesures de gel des avoirs décidées par l'ONU, l'UE ou le ministre de l'Économie (Direction générale du Trésor) à l'encontre de personnes ou entités désignées : aucun fonds ne peut leur être mis à disposition.

### La lutte contre la corruption

La loi **Sapin 2** impose aux grandes entreprises un programme anticorruption (cartographie des risques, code de conduite, dispositif d'alerte, évaluation des tiers…), contrôlé par l'**Agence française anticorruption (AFA)**.
`,
      keyPoints: [
        "Déclaration de soupçon à Tracfin : aucun seuil, confidentialité absolue vis-à-vis du client.",
        "Le déclarant de bonne foi bénéficie d'une immunité.",
        "Gel des avoirs : application immédiate (ONU, UE, DG Trésor).",
        "Paiement en espèces limité à 1 000 € pour un résident fiscal français.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Quelles sont, dans l'ordre, les trois étapes classiques du blanchiment ?", ["Empilement, placement, intégration", "Placement, empilement, intégration", "Intégration, placement, empilement", "Placement, intégration, empilement"], 1, "Placement (introduction des fonds), empilement (dissimulation), intégration (réinjection dans l'économie légale)."],
    ["A", "À quel organisme les déclarations de soupçon sont-elles adressées ?", ["L'AMF", "L'ACPR", "Tracfin", "Le procureur de la République"], 2, "Tracfin est la cellule de renseignement financier française destinataire des déclarations de soupçon."],
    ["A", "Une déclaration de soupçon doit être effectuée :", ["Uniquement au-delà de 10 000 €", "Uniquement au-delà de 150 000 €", "Sans condition de seuil", "Uniquement pour les clients non-résidents"], 2, "Il n'existe aucun seuil : c'est le soupçon qui déclenche la déclaration."],
    ["A", "Un conseiller peut-il informer son client qu'une déclaration de soupçon a été effectuée le concernant ?", ["Oui, systématiquement", "Oui, si le client le demande", "Non, c'est strictement interdit", "Oui, après 30 jours"], 2, "La divulgation de l'existence d'une DS est interdite et pénalement sanctionnée."],
    ["C", "Le financement du terrorisme se distingue du blanchiment notamment parce que :", ["Les fonds sont toujours d'origine illicite", "Les fonds peuvent être d'origine licite", "Il ne concerne que les espèces", "Il ne fait pas l'objet de déclarations"], 1, "C'est la destination des fonds qui est illicite, leur origine pouvant être licite."],
    ["A", "Le bénéficiaire effectif d'une société est la personne physique qui détient :", ["Plus de 10 % du capital ou des droits de vote", "Plus de 25 % du capital ou des droits de vote, ou exerce un contrôle", "Plus de 50 % du capital uniquement", "Au moins une action"], 1, "Seuil de plus de 25 % du capital ou des droits de vote, ou contrôle par tout autre moyen."],
    ["C", "Une personne politiquement exposée (PPE) fait l'objet :", ["D'une vigilance simplifiée", "D'une vigilance standard", "D'une vigilance renforcée", "D'un refus systématique d'entrée en relation"], 2, "Les PPE requièrent des mesures de vigilance renforcée et l'autorisation d'un membre de la direction."],
    ["C", "Combien de temps une personne reste-t-elle considérée comme PPE après la cessation de ses fonctions ?", ["Elle ne l'est plus dès la fin des fonctions", "1 an", "5 ans", "10 ans"], 1, "La qualité de PPE perdure pendant un an après la cessation des fonctions."],
    ["A", "Pendant combien de temps les documents d'identification des clients doivent-ils être conservés ?", ["1 an", "3 ans", "5 ans à compter de la fin de la relation", "10 ans à compter de l'ouverture du compte"], 2, "Conservation de 5 ans à compter de la clôture du compte ou de la cessation de la relation."],
    ["C", "La fraude fiscale peut-elle constituer l'infraction d'origine d'un blanchiment ?", ["Non, jamais", "Oui", "Uniquement au-delà de 1 million d'euros", "Uniquement pour les sociétés"], 1, "Tout crime ou délit puni de plus d'un an d'emprisonnement, dont la fraude fiscale, peut être l'infraction d'origine."],
    ["C", "Le GAFI a été créé en 1989 à l'initiative :", ["De l'ONU", "Du G7", "De la BCE", "Du FMI"], 1, "Le GAFI a été créé par le G7 lors du sommet de Paris en 1989."],
    ["C", "Quelle est la peine encourue pour un blanchiment simple ?", ["1 an et 15 000 €", "5 ans et 375 000 €", "10 ans et 750 000 €", "20 ans et 1 M€"], 1, "5 ans d'emprisonnement et 375 000 € d'amende ; doublés pour le blanchiment aggravé."],
    ["C", "Les mesures de gel des avoirs doivent être appliquées :", ["Dans un délai de 30 jours", "Immédiatement", "Après accord du client", "Uniquement sur les comptes en devises"], 1, "Le gel s'applique sans délai dès la publication de la mesure."],
    ["C", "Une opération d'un montant inhabituellement élevé sans justification économique apparente doit donner lieu :", ["À son exécution sans formalité", "À un examen renforcé sur l'origine et la destination des fonds", "À la clôture immédiate du compte", "À une information de l'AMF"], 1, "L'examen renforcé est obligatoire ; si le doute persiste, une déclaration de soupçon s'impose."],
    ["C", "Quel organisme contrôle les programmes anticorruption imposés par la loi Sapin 2 ?", ["Tracfin", "L'AFA", "L'AMF", "La CNIL"], 1, "L'Agence française anticorruption (AFA) contrôle les dispositifs anticorruption."],
  ]),
};
