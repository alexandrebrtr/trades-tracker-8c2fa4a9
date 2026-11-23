import { buildQuestions, Theme } from "../../types";

const id = "t02";

export const theme02: Theme = {
  id,
  number: 2,
  title: "Déontologie, conformité et organisation déontologique des établissements",
  shortTitle: "Déontologie & conformité",
  description:
    "La fonction conformité, la gestion des conflits d'intérêts, les transactions personnelles, la rémunération et la certification professionnelle.",
  duration: 30,
  sections: [
    {
      id: "conformite",
      title: "La fonction conformité et le contrôle interne",
      content: `
Tout PSI et toute SGP doit disposer d'une **fonction de conformité permanente, efficace et indépendante**.

- Dans un PSI : le **RCSI** (responsable de la conformité pour les services d'investissement).
- Dans une SGP : le **RCCI** (responsable de la conformité et du contrôle interne).

Ces responsables doivent être titulaires d'une **carte professionnelle** délivrée par l'AMF (examen spécifique). Ils rendent compte régulièrement aux dirigeants et à l'organe de surveillance.

### Les trois niveaux de contrôle

| Niveau | Nature | Acteurs |
|---|---|---|
| 1er niveau | **Contrôle permanent** opérationnel | Opérationnels et leur hiérarchie |
| 2e niveau | **Contrôle permanent** indépendant | Conformité, contrôle des risques |
| 3e niveau | **Contrôle périodique** | Audit / inspection générale |

### Missions de la conformité

- conseiller et assister les opérationnels ;
- **détecter le risque de non-conformité** ;
- contrôler et évaluer régulièrement l'efficacité des procédures ;
- former et sensibiliser les collaborateurs ;
- tenir le registre des conflits d'intérêts, les listes de surveillance et d'interdiction ;
- valider les nouveaux produits (gouvernance produit) et traiter les dysfonctionnements.

### Le dispositif d'alerte (lanceurs d'alerte)

Depuis la loi **Sapin 2** (2016), renforcée par la loi **Waserman** (2022), les établissements mettent en place une procédure de recueil des signalements. Le lanceur d'alerte est protégé contre les représailles ; il peut aussi signaler directement à l'AMF.
`,
      keyPoints: [
        "RCSI (PSI) / RCCI (SGP) : titulaires d'une carte professionnelle délivrée par l'AMF.",
        "Contrôle permanent (1er et 2e niveau) et contrôle périodique (3e niveau, audit).",
        "La fonction conformité doit être permanente, efficace et indépendante.",
      ],
    },
    {
      id: "conflits",
      title: "Les conflits d'intérêts",
      content: `
Un conflit d'intérêts peut naître entre l'établissement (ou ses collaborateurs) et ses clients, ou entre deux clients.

### La démarche en 4 étapes

1. **Identifier** les situations de conflits potentiels (cartographie) ;
2. **Prévenir** : mesures organisationnelles ;
3. **Gérer** les conflits avérés ;
4. **Informer** le client — en **dernier recours**, lorsque les mesures prises ne suffisent pas à garantir, avec une certitude raisonnable, que le risque d'atteinte aux intérêts du client sera évité.

> L'information du client n'est **jamais** une solution en soi : c'est un ultime recours, sur support durable, suffisamment détaillé pour lui permettre de décider en connaissance de cause.

### Les outils

- **Barrières à l'information** (« murailles de Chine ») : séparation physique et informatique entre les métiers sensibles (ex. : conseil en fusions-acquisitions et vente).
- **Liste de surveillance** (*watch list*) : liste **confidentielle**, connue de la seule conformité, des valeurs sur lesquelles l'établissement détient une information sensible.
- **Liste d'interdiction** (*restricted list*) : liste **diffusée** aux collaborateurs, qui restreint certaines activités (recherche, transactions personnelles…) sur des valeurs.
- **Registre des conflits d'intérêts**.
- Politique de rémunération ne créant pas d'incitations contraires à l'intérêt des clients.

### Les « franchissements » de murailles

Lorsqu'un collaborateur doit passer « au-dessus de la muraille » (*wall crossing*), la conformité est préalablement informée et enregistre l'opération ; le collaborateur devient initié.
`,
      keyPoints: [
        "Identifier → prévenir → gérer → informer le client en dernier recours.",
        "Watch list : confidentielle (conformité). Restricted list : diffusée aux collaborateurs.",
        "Barrières à l'information = murailles de Chine.",
      ],
    },
    {
      id: "transactions-perso",
      title: "Transactions personnelles, avantages et rémunérations",
      content: `
### Les transactions personnelles

Les **personnes concernées** (dirigeants, salariés, agents liés…) dont l'activité peut donner lieu à un conflit d'intérêts ou qui ont accès à des informations privilégiées sont soumises à un encadrement :

- interdiction d'utiliser une information privilégiée ou confidentielle ;
- interdiction du *front running* (passer un ordre pour soi avant celui d'un client) ;
- **déclaration** de leurs transactions à la conformité (selon les procédures internes) ;
- respect des listes d'interdiction et, le cas échéant, d'une durée minimale de détention ou d'une pré-autorisation.

### Les avantages (*inducements*) sous MIF 2

| Service | Rétrocessions reçues de tiers |
|---|---|
| **Conseil indépendant** | **Interdites** (sauf avantages non monétaires mineurs) ; si reçues, reversées intégralement au client |
| **Gestion sous mandat** | **Interdites** (même règle) |
| **Conseil non indépendant, RTO, exécution** | Autorisées si elles **améliorent la qualité du service** au client, ne nuisent pas au devoir d'agir au mieux de ses intérêts, et sont **portées à sa connaissance** |

Les **avantages non monétaires mineurs** (ex. : documentation générale, participation à une conférence, hospitalité d'une valeur raisonnable) restent admis.

### Cadeaux

Chaque établissement fixe des **seuils** au-delà desquels les cadeaux reçus ou offerts doivent être déclarés ou refusés.

### Politique de rémunération

Les rémunérations variables ne doivent pas inciter à privilégier ses intérêts ou ceux de l'établissement au détriment des clients (ex. : objectifs commerciaux sur un seul produit). Des règles spécifiques encadrent les « preneurs de risques » (CRD, AIFM, OPCVM : report d'une partie du variable, malus…).
`,
      keyPoints: [
        "Front running interdit ; transactions personnelles déclarées à la conformité.",
        "Rétrocessions interdites en conseil indépendant et gestion sous mandat (sauf avantages non monétaires mineurs).",
        "Ailleurs, les rétrocessions doivent améliorer la qualité du service et être portées à la connaissance du client.",
      ],
    },
    {
      id: "certification",
      title: "La vérification des connaissances professionnelles",
      content: `
Depuis le **1er juillet 2010**, les PSI et SGP doivent vérifier que certains collaborateurs disposent d'un **niveau de connaissances minimales** :

- vendeurs ;
- gérants ;
- RCSI / RCCI ;
- responsables de la compensation et du post-marché ;
- compensateurs ;
- négociateurs d'instruments financiers ;
- analystes financiers ;
- conseillers en investissement (depuis MIF 2, le critère de compétence s'ajoute aux connaissances).

Modalités :

- **Examen certifié par l'AMF** (QCM, organismes certifiés) ou vérification interne par l'établissement ;
- délai de **6 mois** à compter de la prise de fonction pour effectuer la vérification ; pendant ce délai, le collaborateur agit sous la responsabilité d'un collaborateur qualifié ;
- **clause de « grand-père »** : les personnes en poste au 1er juillet 2010 sont réputées disposer des connaissances ;
- la réussite à l'examen certifié est **sans limitation de durée**.

### Format actuel de l'examen

- **120 questions** à choix multiples, en **2 heures** maximum ;
- deux catégories : **A** (connaissances essentielles, environ 33 questions) et **C** (culture financière, environ 87 questions) ;
- seuil de réussite : **80 % de bonnes réponses dans chaque catégorie**, sans compensation entre catégories.
`,
      keyPoints: [
        "Vérification des connaissances obligatoire depuis le 1er juillet 2010, dans les 6 mois suivant la prise de fonction.",
        "Examen certifié : 120 QCM en 2 h, 80 % de réussite dans chaque catégorie (A et C), sans compensation.",
        "Clause de grand-père pour les personnes en poste au 1er juillet 2010.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Dans une société de gestion de portefeuille, le responsable de la conformité est appelé :", ["RCSI", "RCCI", "DPO", "CRO"], 1, "RCCI : responsable de la conformité et du contrôle interne (SGP). RCSI : pour les PSI."],
    ["A", "Le RCSI et le RCCI doivent :", ["Être titulaires d'une carte professionnelle délivrée par l'AMF", "Être nommés par l'ACPR", "Être obligatoirement des administrateurs de l'établissement", "Avoir réussi l'examen d'expert-comptable"], 0, "Ces fonctions nécessitent une carte professionnelle délivrée par l'AMF après un examen spécifique."],
    ["A", "Face à un conflit d'intérêts, l'information du client intervient :", ["En premier lieu, avant toute autre mesure", "En dernier recours, lorsque les mesures de gestion ne suffisent pas", "Jamais, le conflit doit rester confidentiel", "Uniquement si le client est professionnel"], 1, "L'information du client est un ultime recours, quand les mesures organisationnelles ne suffisent pas."],
    ["C", "La liste de surveillance (watch list) est :", ["Diffusée à l'ensemble des collaborateurs", "Publiée sur le site de l'AMF", "Confidentielle et tenue par la conformité", "Communiquée aux clients"], 2, "La watch list est strictement confidentielle ; seule la restricted list est diffusée."],
    ["C", "La liste d'interdiction (restricted list) :", ["Est connue uniquement du RCSI", "Est diffusée aux collaborateurs concernés pour restreindre certaines opérations", "Recense les clients interdits bancaires", "Est tenue par l'AMF"], 1, "Elle est diffusée afin que les collaborateurs respectent les restrictions sur les valeurs listées."],
    ["C", "Le contrôle périodique (3e niveau) est assuré par :", ["Les opérationnels", "La conformité", "L'audit interne / l'inspection", "L'AMF"], 2, "Le contrôle périodique relève de l'audit interne, indépendant des fonctions de contrôle permanent."],
    ["A", "Le « front running » consiste à :", ["Exécuter un ordre client au meilleur prix", "Passer un ordre pour son propre compte en profitant de la connaissance d'un ordre client à venir", "Regrouper des ordres de clients", "Refuser un ordre client"], 1, "Le front running est une pratique interdite qui utilise la connaissance d'ordres clients."],
    ["A", "Dans le cadre de la gestion sous mandat, les rétrocessions versées par des tiers :", ["Sont librement conservées par le gérant", "Sont interdites, sauf avantages non monétaires mineurs", "Sont autorisées si le client est professionnel", "Doivent être reversées à l'AMF"], 1, "MIF 2 interdit les rétrocessions en gestion sous mandat et conseil indépendant ; si elles sont perçues, elles sont reversées au client."],
    ["C", "En conseil non indépendant, une rétrocession perçue est admise si :", ["Elle dépasse 1 % de l'encours", "Elle améliore la qualité du service et est portée à la connaissance du client", "Elle est versée en espèces", "Le client ne s'y oppose pas dans un délai de 3 mois"], 1, "Conditions MIF 2 : amélioration de la qualité du service, absence d'atteinte à l'intérêt du client, information du client."],
    ["C", "Depuis quelle date les PSI doivent-ils vérifier les connaissances minimales de certains collaborateurs ?", ["1er janvier 2008", "1er juillet 2010", "3 janvier 2018", "1er janvier 2023"], 1, "L'obligation s'applique depuis le 1er juillet 2010."],
    ["C", "Un nouveau vendeur dispose de combien de temps pour faire vérifier ses connaissances ?", ["1 mois", "3 mois", "6 mois", "1 an"], 2, "La vérification doit intervenir dans un délai de 6 mois à compter de la prise de fonction."],
    ["A", "Pour réussir l'examen certifié AMF dans son format actuel, il faut :", ["Obtenir 60 % de bonnes réponses au total", "Obtenir au moins 80 % de bonnes réponses dans chaque catégorie (A et C)", "Obtenir 100 % en catégorie A uniquement", "Obtenir 75 % au total"], 1, "Le seuil est de 80 % dans chaque catégorie, sans compensation possible entre A et C."],
    ["C", "Les murailles de Chine désignent :", ["Les limites de positions sur dérivés", "Des barrières à l'information entre activités", "Les seuils de franchissement de capital", "Les plafonds de rémunération variable"], 1, "Ce sont des barrières organisationnelles, physiques et informatiques destinées à cloisonner l'information."],
    ["C", "Quelle loi a instauré le statut général du lanceur d'alerte en France ?", ["La loi PACTE", "La loi Sapin 2", "La loi Macron", "La loi Hamon"], 1, "La loi Sapin 2 du 9 décembre 2016, renforcée par la loi Waserman de 2022."],
  ]),
};
