import { buildQuestions, Theme } from "../../types";

const id = "t05";

export const theme05: Theme = {
  id,
  number: 5,
  title: "Commercialisation d'instruments financiers, démarchage, vente à distance et protection de l'investisseur",
  shortTitle: "Commercialisation",
  description:
    "Démarchage bancaire et financier, vente à distance, communications publicitaires, DIC PRIIPs, gouvernance produits et produits à haut risque.",
  duration: 30,
  sections: [
    {
      id: "demarchage",
      title: "Le démarchage bancaire et financier",
      content: `
### Définition (art. L.341-1 CMF)

Constitue un acte de démarchage :

- toute **prise de contact non sollicitée**, par quelque moyen que ce soit (téléphone, courrier, e-mail, rencontre…), avec une personne physique ou morale déterminée, en vue d'obtenir son accord sur la réalisation d'une opération ou la fourniture d'un service ;
- ou le fait de **se rendre physiquement** au domicile, sur le lieu de travail ou dans un lieu **non destiné à la commercialisation** de produits financiers, quelle que soit la personne à l'initiative de la démarche.

> Ne constitue pas du démarchage le contact avec un **investisseur qualifié** ou une personne morale dépassant certains seuils, ni la démarche auprès d'un client existant pour des opérations habituelles.

### Qui peut démarcher ?

- établissements de crédit, entreprises d'investissement, SGP, entreprises d'assurance, CIF (pour les services qu'ils fournissent)… ;
- les personnes physiques ou morales **mandatées** par ces établissements.

Les démarcheurs sont enregistrés dans le **fichier des démarcheurs** et l'établissement mandant en est **civilement responsable**.

### Les délais de protection

| Situation | Protection |
|---|---|
| Démarchage portant sur la RTO ou des instruments financiers | **Délai de réflexion de 48 heures** avant de recueillir l'accord du client |
| Contrats de services financiers démarchés ou conclus à distance | **Délai de rétractation de 14 jours calendaires** (sans pénalité ni motif) |

Le délai de rétractation **ne s'applique pas** aux instruments financiers dont le prix dépend des fluctuations du marché.

### Les produits interdits au démarchage

- produits dont les **caractéristiques ne sont pas clairement identifiées** ;
- produits dont le **risque de perte peut excéder le montant de l'apport** initial (sauf exceptions, pour les professionnels notamment) ;
- instruments **non admis** sur un marché réglementé ou un SMN, sauf exceptions (OPC autorisés à la commercialisation en France, offres au public faisant l'objet d'un prospectus, etc.).

### Le démarchage téléphonique

Il est interdit d'appeler un consommateur inscrit sur **Bloctel** avec lequel le professionnel n'a pas de relation contractuelle en cours. Les appels sont encadrés en jours et horaires.
`,
      keyPoints: [
        "Démarchage : contact non sollicité, ou déplacement au domicile / lieu de travail / lieu non commercial.",
        "48 heures de réflexion pour la RTO et les instruments financiers démarchés.",
        "14 jours de rétractation pour les services financiers démarchés ou vendus à distance (hors instruments au prix fluctuant).",
        "Interdits : produits mal identifiés, risque de perte supérieur à l'apport, titres non admis (sauf exceptions).",
      ],
    },
    {
      id: "publicite",
      title: "Communications publicitaires et documentation",
      content: `
### Principe

Toute information, y compris à caractère promotionnel, adressée à des clients doit être **correcte, claire et non trompeuse**. Les communications à caractère promotionnel sont **clairement identifiables** comme telles.

Règles clés :

- présenter les **risques** de façon aussi visible que les avantages éventuels ;
- les **performances passées** ne préjugent pas des performances futures ; elles portent sur des périodes complètes (idéalement 10 ans ou depuis la création) ;
- les **simulations** de performances futures reposent sur des hypothèses raisonnables ;
- ne pas utiliser de marque, de nom ou de label de manière trompeuse.

### Le DIC PRIIPs

Depuis le **1er janvier 2023**, tous les produits d'investissement packagés de détail et fondés sur l'assurance (PRIIPs), **y compris les OPCVM**, sont accompagnés d'un **document d'informations clés (DIC / KID)** remis aux clients non professionnels **avant la souscription** :

- **3 pages** maximum, format standardisé ;
- un **indicateur synthétique de risque (SRI)** de **1 (risque le plus faible) à 7 (le plus élevé)** ;
- des **scénarios de performance** (tensions, défavorable, intermédiaire, favorable) ;
- les **coûts** (totaux et réduction du rendement) et la période de détention recommandée.

Le **prospectus** (pour les OPC ou les offres au public de titres) complète cette information.

### La gouvernance des produits (MIF 2)

- Le **producteur** (concepteur) définit un **marché cible** de clients (type de clients, connaissances et expérience, situation financière, tolérance au risque, objectifs, préférences de durabilité) et un marché cible négatif.
- Le **distributeur** affine ce marché cible, choisit la stratégie de distribution et fait remonter l'information au producteur.

### Les produits à haut risque

- La loi **Sapin 2** interdit la **publicité électronique** pour les contrats financiers très risqués (CFD, forex, options binaires) à destination des particuliers.
- Mesures d'intervention de l'**ESMA**, reprises par l'AMF : **interdiction** de commercialiser des **options binaires** aux clients de détail ; encadrement des **CFD** : effet de levier plafonné (de **30:1** pour les principales paires de devises à **2:1** pour les crypto-actifs), clôture des positions lorsque la marge tombe à **50 %**, **protection contre le solde négatif**, avertissement standardisé sur le pourcentage de comptes perdants.
`,
      keyPoints: [
        "Communication correcte, claire et non trompeuse ; caractère promotionnel identifiable.",
        "DIC PRIIPs : 3 pages, SRI de 1 à 7, scénarios de performance, coûts ; obligatoire pour les OPCVM depuis 2023.",
        "Gouvernance produit : le producteur définit le marché cible, le distributeur l'affine.",
        "CFD : levier de 30:1 maximum, clôture à 50 % de marge, protection contre le solde négatif ; options binaires interdites aux particuliers.",
      ],
    },
    {
      id: "distance",
      title: "La vente à distance et la commercialisation en ligne",
      content: `
La **commercialisation à distance** de services financiers (internet, téléphone…) obéit au Code de la consommation et au CMF :

- information précontractuelle complète **sur support durable** en temps utile, avant tout engagement ;
- **délai de rétractation de 14 jours** (sauf exceptions, notamment instruments financiers au prix fluctuant et RTO) ;
- identification claire du prestataire et de son statut (agrément, passeport…).

### Les « influenceurs » financiers

La loi du **9 juin 2023** encadre l'influence commerciale : la promotion de services financiers et de crypto-actifs par des influenceurs est limitée aux acteurs autorisés et doit être clairement identifiée comme publicité. L'AMF publie des listes noires de sites et acteurs non autorisés.

### Les arnaques financières

Signes d'alerte : promesses de rendement élevé sans risque, pression pour investir vite, acteur non autorisé, demande de virement vers l'étranger. Réflexe : vérifier le **registre REGAFI**, le registre **ORIAS** et les **listes noires** de l'AMF.
`,
      keyPoints: [
        "Vente à distance : information préalable sur support durable et rétractation de 14 jours.",
        "Vérifier les autorisations sur REGAFI / ORIAS et les listes noires de l'AMF.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Constitue un acte de démarchage bancaire et financier :", ["Un client qui se rend spontanément en agence", "Une prise de contact non sollicitée avec une personne déterminée en vue d'obtenir son accord sur un service", "La publication d'un communiqué de presse", "Une publicité dans un journal"], 1, "Le démarchage suppose une prise de contact non sollicitée avec une personne déterminée (ou un déplacement au domicile, au lieu de travail…)."],
    ["C", "Un conseiller qui se rend au domicile d'un client, à la demande de celui-ci, pour lui proposer des placements :", ["Ne fait pas de démarchage puisque le client l'a sollicité", "Fait du démarchage, quelle que soit la personne à l'initiative", "Fait de la vente à distance", "Exerce une activité interdite"], 1, "Le déplacement au domicile constitue du démarchage quelle que soit la personne à l'initiative de la démarche."],
    ["A", "En cas de démarchage portant sur des instruments financiers ou la RTO, le client bénéficie :", ["D'un délai de réflexion de 48 heures", "D'un délai de rétractation de 30 jours", "D'aucun délai", "D'un délai de réflexion de 7 jours"], 0, "Un délai de réflexion de 48 heures s'applique avant de recueillir l'accord de la personne démarchée."],
    ["A", "Le délai de rétractation applicable aux services financiers commercialisés à distance est de :", ["48 heures", "7 jours", "14 jours calendaires", "30 jours"], 2, "Le délai de rétractation est de 14 jours calendaires, sans motif ni pénalité."],
    ["C", "Le délai de rétractation ne s'applique pas :", ["Aux contrats de crédit", "Aux instruments financiers dont le prix dépend des fluctuations du marché", "Aux conventions de compte", "Aux contrats d'assurance-vie"], 1, "Les instruments financiers dont le prix fluctue sur les marchés sont exclus du droit de rétractation."],
    ["C", "Parmi ces produits, lequel ne peut pas être proposé par voie de démarchage à un particulier ?", ["Une part de SICAV autorisée à la commercialisation en France", "Une action cotée sur Euronext Paris", "Un produit dont le risque de perte peut excéder l'apport initial", "Un livret d'épargne"], 2, "Les produits dont le risque de perte excède l'apport initial sont exclus du démarchage auprès des particuliers."],
    ["A", "Une communication à caractère promotionnel doit être :", ["Validée par l'AMF avant diffusion dans tous les cas", "Correcte, claire, non trompeuse et identifiable comme telle", "Rédigée en anglais", "Réservée aux clients professionnels"], 1, "C'est le principe général posé par MIF 2."],
    ["A", "L'indicateur synthétique de risque du DIC PRIIPs est gradué :", ["De 1 à 5", "De 1 à 7", "De A à E", "De 0 à 10"], 1, "Le SRI va de 1 (risque le plus faible) à 7 (risque le plus élevé)."],
    ["C", "Le document d'informations clés (DIC) PRIIPs comporte au maximum :", ["1 page", "2 pages", "3 pages", "10 pages"], 2, "Le DIC PRIIPs est limité à 3 pages au format A4."],
    ["C", "Depuis le 1er janvier 2023, les OPCVM commercialisés auprès de clients de détail sont accompagnés :", ["D'un DICI", "D'un DIC PRIIPs", "D'un simple prospectus", "D'aucun document"], 1, "Les OPCVM ont abandonné le DICI au profit du DIC PRIIPs au 1er janvier 2023."],
    ["C", "Dans la gouvernance produits MIF 2, le marché cible est défini en premier lieu par :", ["Le client", "Le producteur (concepteur) du produit", "L'AMF", "Le dépositaire"], 1, "Le producteur définit le marché cible ; le distributeur l'affine."],
    ["C", "Pour un client de détail, l'effet de levier maximal sur un CFD portant sur une paire de devises majeure est de :", ["2:1", "10:1", "30:1", "100:1"], 2, "Les mesures ESMA plafonnent le levier à 30:1 pour les principales paires de devises."],
    ["C", "La commercialisation d'options binaires auprès des clients de détail est :", ["Libre", "Interdite", "Autorisée avec un levier de 2:1", "Réservée aux PEA"], 1, "L'ESMA puis l'AMF ont interdit la commercialisation d'options binaires aux clients de détail."],
    ["C", "Pour vérifier qu'un établissement est autorisé à fournir des services d'investissement en France, on peut consulter :", ["Le registre REGAFI", "Le cadastre", "Le registre des brevets", "Le fichier FICP"], 0, "REGAFI recense les établissements agréés (banques, entreprises d'investissement, passeports…)."],
  ]),
};
