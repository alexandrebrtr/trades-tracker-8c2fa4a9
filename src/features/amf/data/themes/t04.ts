import { buildQuestions, Theme } from "../../types";

const id = "t04";

export const theme04: Theme = {
  id,
  number: 4,
  title: "La réglementation « Abus de marché »",
  shortTitle: "Abus de marché",
  description:
    "Le règlement MAR : information privilégiée, opérations d'initiés, manipulation de marché, listes d'initiés, déclarations des dirigeants et sanctions.",
  duration: 30,
  sections: [
    {
      id: "info-privilegiee",
      title: "L'information privilégiée",
      content: `
Le **règlement européen MAR** (n° 596/2014), applicable depuis le **3 juillet 2016**, harmonise la répression des abus de marché. Il couvre les instruments admis sur un **marché réglementé**, un **SMN** ou un **OTF**, ainsi que les instruments dont le cours dépend de ces derniers (dérivés, y compris de gré à gré).

### Définition

Une information privilégiée est une information :

1. à caractère **précis** ;
2. **non rendue publique** ;
3. qui concerne, **directement ou indirectement**, un ou plusieurs émetteurs ou instruments financiers ;
4. qui, si elle était rendue publique, serait **susceptible d'influencer de façon sensible** le cours des instruments concernés (un investisseur raisonnable l'utiliserait pour fonder sa décision).

> Une étape intermédiaire d'un processus étalé dans le temps (ex. : négociations d'une fusion) peut constituer en elle-même une information privilégiée.

### Publication

L'émetteur doit rendre publique **dès que possible** toute information privilégiée le concernant (information permanente). Il peut **différer** la publication sous sa responsabilité si :

- la publication immédiate est susceptible de porter atteinte à ses intérêts légitimes ;
- le retard n'est pas susceptible d'induire le public en erreur ;
- il est en mesure d'assurer la confidentialité.

Il en informe l'AMF au moment de la publication.
`,
      keyPoints: [
        "MAR applicable depuis le 3 juillet 2016 (marché réglementé, SMN, OTF et dérivés liés).",
        "Information privilégiée : précise, non publique, liée à un émetteur ou instrument, susceptible d'influencer sensiblement le cours.",
        "Publication dès que possible ; différé possible sous conditions.",
      ],
    },
    {
      id: "manquements",
      title: "Les trois manquements",
      content: `
### 1. L'opération d'initié

Le fait, pour une personne détenant une information privilégiée, de l'**utiliser** en acquérant ou cédant, pour son compte ou pour autrui, directement ou indirectement, des instruments financiers concernés. Est aussi visée l'**annulation ou la modification d'un ordre** passé avant de détenir l'information. **Recommander** à autrui d'effectuer une telle opération est également interdit.

Tout le monde peut être initié : initiés « primaires » (dirigeants, actionnaires, personnes y ayant accès par leur profession) et toute personne qui sait ou aurait dû savoir qu'il s'agit d'une information privilégiée.

### 2. La divulgation illicite d'information privilégiée

Communiquer une information privilégiée à un tiers **en dehors du cadre normal** de l'exercice de son travail, de sa profession ou de ses fonctions.

Exception encadrée : les **sondages de marché** (*market soundings*), réalisés selon une procédure précise (enregistrement, accord de la personne sondée pour recevoir l'information…).

### 3. La manipulation de marché

- Effectuer des opérations ou passer des ordres qui donnent des **indications fausses ou trompeuses** sur l'offre, la demande ou le cours, ou qui fixent le cours à un niveau anormal ou artificiel ;
- utiliser des **procédés fictifs** ou toute forme de tromperie ;
- **diffuser des informations fausses ou trompeuses** (y compris via internet et les réseaux sociaux) ;
- manipuler un **indice de référence** (benchmark, ex. Euribor).

Exemples : *layering / spoofing* (ordres fictifs annulés avant exécution), *wash trades* (opérations sans changement de bénéficiaire), *pump and dump*, *marking the close* (influencer le cours de clôture).

### Les dérogations (« safe harbours »)

- **Programmes de rachat** d'actions propres et **mesures de stabilisation** réalisés selon les conditions de MAR ;
- **Pratiques de marché admises** par l'AMF, comme le **contrat de liquidité**.
`,
      keyPoints: [
        "Trois manquements : opération d'initié, divulgation illicite, manipulation de marché.",
        "Annuler ou modifier un ordre grâce à une information privilégiée est une opération d'initié.",
        "Les sondages de marché sont une exception encadrée à la divulgation.",
        "Safe harbours : rachats d'actions, stabilisation ; pratique admise : contrat de liquidité.",
      ],
    },
    {
      id: "prevention",
      title: "Les mesures de prévention",
      content: `
### Les listes d'initiés

Les émetteurs (et les personnes agissant pour leur compte : banques conseils, avocats…) établissent et tiennent à jour des **listes d'initiés** recensant les personnes ayant accès à une information privilégiée. Elles sont transmises à l'AMF sur demande et **conservées au moins 5 ans**.

### Les transactions des dirigeants

Les **personnes exerçant des responsabilités dirigeantes** (PRD) et les personnes qui leur sont étroitement liées déclarent leurs transactions sur les titres de l'émetteur à l'**AMF** et à l'émetteur dans un délai de **3 jours ouvrés**, dès que le montant cumulé atteint **20 000 € sur l'année civile** (seuil retenu en France).

### La fenêtre négative

Les PRD ne peuvent pas effectuer de transactions pendant une **période de 30 jours calendaires** avant l'annonce d'un rapport financier intermédiaire ou de fin d'année (*closed period*).

### La détection et la déclaration des opérations suspectes

Les PSI et opérateurs de marché doivent disposer de dispositifs de détection et déclarer **sans délai** à l'AMF les ordres et transactions suspects (**STOR** — *suspicious transaction and order report*), y compris les ordres non exécutés.

### Les recommandations d'investissement

Les analystes et producteurs de recommandations doivent présenter l'information de façon objective et **mentionner leurs conflits d'intérêts**.
`,
      keyPoints: [
        "Listes d'initiés conservées au moins 5 ans.",
        "Transactions des dirigeants : déclaration sous 3 jours ouvrés au-delà de 20 000 € par an.",
        "Fenêtre négative : 30 jours calendaires avant les résultats annuels ou semestriels.",
        "Déclaration sans délai des opérations suspectes à l'AMF (STOR), même non exécutées.",
      ],
    },
    {
      id: "sanctions",
      title: "Les sanctions",
      content: `
Les abus de marché peuvent être poursuivis :

- **administrativement** par l'AMF (Commission des sanctions) : jusqu'à **100 M€ ou 10 fois le profit** ;
- **pénalement** (délit d'initié, de divulgation, de manipulation) : jusqu'à **5 ans d'emprisonnement** et **100 M€** d'amende (ou jusqu'à 10 fois le profit), le montant ne pouvant être inférieur au profit réalisé.

Depuis la loi du **21 juin 2016** (règle *non bis in idem*), une même personne ne peut plus être poursuivie à la fois devant l'AMF et devant le juge pénal pour les mêmes faits : l'AMF et le **Parquet national financier (PNF)** se concertent pour choisir la voie de poursuite (procédure d'« aiguillage »).
`,
      keyPoints: [
        "Sanction administrative AMF : 100 M€ ou 10 fois le profit.",
        "Sanction pénale : 5 ans d'emprisonnement et 100 M€ (ou 10 fois le profit).",
        "Non bis in idem : concertation AMF / PNF pour choisir une seule voie de poursuite.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Quels sont les trois manquements définis par le règlement MAR ?", ["Opération d'initié, divulgation illicite d'information privilégiée, manipulation de marché", "Fraude fiscale, blanchiment, corruption", "Défaut de conseil, défaut d'information, démarchage illicite", "Front running, churning, late trading"], 0, "MAR définit trois manquements : opérations d'initiés, divulgation illicite et manipulation de marché."],
    ["A", "Une information privilégiée doit notamment être :", ["Publique et vérifiable", "Précise et non rendue publique", "Diffusée par l'émetteur", "Écrite"], 1, "Elle est précise, non publique, liée à un émetteur/instrument, et susceptible d'influencer sensiblement le cours."],
    ["A", "Annuler un ordre de bourse après avoir pris connaissance d'une information privilégiée :", ["Est autorisé car aucune transaction n'a lieu", "Constitue une opération d'initié", "N'est sanctionné que si l'ordre dépasse 20 000 €", "Est une pratique de marché admise"], 1, "MAR vise expressément l'annulation ou la modification d'un ordre en utilisant une information privilégiée."],
    ["C", "Depuis quelle date le règlement MAR est-il applicable ?", ["1er novembre 2007", "3 juillet 2016", "3 janvier 2018", "1er janvier 2023"], 1, "MAR est entré en application le 3 juillet 2016."],
    ["C", "Le « spoofing » ou « layering » consiste à :", ["Diffuser une recherche indépendante", "Placer des ordres que l'on n'a pas l'intention d'exécuter pour influencer le cours", "Racheter ses propres actions", "Effectuer un sondage de marché"], 1, "C'est une manipulation de marché via des ordres fictifs annulés avant exécution."],
    ["C", "Le contrat de liquidité est :", ["Une manipulation de marché", "Une pratique de marché admise par l'AMF", "Interdit depuis MIF 2", "Réservé aux SICAV"], 1, "Le contrat de liquidité est une pratique de marché admise, encadrée par l'AMF."],
    ["A", "Dans quel délai un dirigeant doit-il déclarer ses transactions sur les titres de sa société ?", ["24 heures", "3 jours ouvrés", "15 jours", "1 mois"], 1, "Délai de 3 jours ouvrés, au-delà d'un seuil cumulé de 20 000 € par année civile."],
    ["C", "La fenêtre négative applicable aux dirigeants avant la publication des résultats annuels est de :", ["15 jours calendaires", "30 jours calendaires", "45 jours ouvrés", "3 mois"], 1, "MAR prévoit une période d'interdiction de 30 jours calendaires."],
    ["C", "Les listes d'initiés doivent être conservées pendant au moins :", ["1 an", "3 ans", "5 ans", "10 ans"], 2, "Conservation d'au moins 5 ans après leur établissement ou mise à jour."],
    ["A", "Un PSI qui détecte un ordre suspect non exécuté :", ["N'a rien à faire car l'ordre n'est pas exécuté", "Doit le déclarer sans délai à l'AMF", "Doit le déclarer à Tracfin uniquement", "Doit en informer le client"], 1, "Les STOR couvrent les ordres et transactions, exécutés ou non, et sont adressés sans délai à l'AMF."],
    ["C", "La diffusion d'une fausse rumeur sur un réseau social afin de faire monter le cours d'une action est :", ["Une liberté d'expression non sanctionnée", "Une manipulation de marché", "Une opération d'initié", "Une divulgation licite"], 1, "La diffusion d'informations fausses ou trompeuses, y compris en ligne, est une manipulation de marché."],
    ["C", "Quelle est la peine d'emprisonnement maximale encourue pour un délit d'initié ?", ["1 an", "2 ans", "5 ans", "10 ans"], 2, "Le délit d'initié est puni de 5 ans d'emprisonnement et de 100 M€ d'amende (ou jusqu'à 10 fois le profit)."],
    ["C", "La règle « non bis in idem » en matière d'abus de marché implique :", ["Une double poursuite systématique AMF et pénale", "Une concertation entre l'AMF et le PNF pour choisir une seule voie de poursuite", "La compétence exclusive de l'ACPR", "La suppression des sanctions pénales"], 1, "Depuis 2016, l'AMF et le PNF se concertent afin qu'une seule voie de poursuite soit engagée."],
    ["C", "Un émetteur peut différer la publication d'une information privilégiée notamment si :", ["Il le souhaite, sans condition", "La publication immédiate porterait atteinte à ses intérêts légitimes et la confidentialité est assurée", "Son cours de bourse est en baisse", "L'AMF lui en donne l'ordre"], 1, "Le différé est possible sous trois conditions cumulatives : intérêts légitimes, absence d'induction en erreur, confidentialité assurée."],
  ]),
};
