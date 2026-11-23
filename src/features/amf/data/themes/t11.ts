import { buildQuestions, Theme } from "../../types";

const id = "t11";

export const theme11: Theme = {
  id,
  number: 11,
  title: "Les émissions, les opérations sur titres et l'information des émetteurs",
  shortTitle: "Émissions & OST",
  description:
    "Introduction en bourse, prospectus, augmentations de capital, DPS, dividendes, offres publiques, rachats d'actions et information financière des sociétés cotées.",
  duration: 30,
  sections: [
    {
      id: "ipo",
      title: "L'introduction en bourse et le prospectus",
      content: `
### Les procédures d'introduction

L'introduction combine en général :

- une **offre à prix ouvert (OPO)** destinée aux **particuliers**, dans une fourchette de prix indicative ;
- un **placement global** destiné aux **investisseurs institutionnels**, organisé par les banques (constitution d'un livre d'ordres — *book building*).

D'autres procédures existent : **cotation directe**, offre à prix minimal, offre à prix ferme.

Une **option de surallocation** (*greenshoe*), dans la limite de 15 % de l'offre, permet de stabiliser le cours dans les 30 jours suivant l'introduction.

### Le prospectus

Le **règlement Prospectus** (UE 2017/1129) impose un prospectus en cas d'**offre au public** de titres ou d'**admission sur un marché réglementé**.

- Il est **approuvé par l'AMF** (contrôle de son caractère complet, compréhensible et cohérent ; l'approbation ne vaut pas jugement sur l'opportunité de l'opération).
- Il comporte un **résumé** (7 pages maximum) et des **facteurs de risque** spécifiques classés.
- Il est **valable 12 mois** après son approbation ; un **supplément** est requis en cas de fait nouveau significatif.
- **Exemptions** : offres d'un montant total inférieur à **8 M€** sur 12 mois (seuil retenu en France), offres réservées aux **investisseurs qualifiés** ou à moins de **150 personnes** par État membre, etc.

Les émetteurs fréquents peuvent établir un **document d'enregistrement universel (URD)**.
`,
      keyPoints: [
        "OPO pour les particuliers, placement global pour les institutionnels.",
        "Prospectus approuvé par l'AMF, valable 12 mois, résumé de 7 pages maximum.",
        "Exemption en France sous 8 M€, pour les investisseurs qualifiés ou moins de 150 personnes par État.",
      ],
    },
    {
      id: "capital",
      title: "Les augmentations de capital et opérations sur titres",
      content: `
### Augmentation de capital en numéraire

- **Avec droit préférentiel de souscription (DPS)** : chaque actionnaire peut souscrire à titre **irréductible** (proportionnellement à ses droits) et à titre **réductible** (actions non souscrites, réparties en fonction des demandes). Le DPS est **négociable** pendant la période de souscription ; s'il n'est ni exercé ni vendu, il perd sa valeur.
- **Sans DPS** (suppression votée par l'AGE) : placement auprès d'investisseurs, éventuellement avec un **délai de priorité** pour les actionnaires.

Valeur théorique du DPS = cours avant opération − valeur théorique de l'action après opération (**TERP**).

### Augmentation de capital par incorporation de réserves

Elle prend la forme :

- d'une **attribution d'actions gratuites** aux actionnaires (droit d'attribution) ;
- ou d'une **élévation du nominal**.

Elle ne modifie pas les capitaux propres (simple transfert comptable) et n'apporte pas de ressources à la société.

### Autres opérations sur titres (OST)

| Opération | Effet |
|---|---|
| **Division du nominal** (*split*) | Plus d'actions, cours proportionnellement réduit, capitalisation inchangée |
| **Regroupement** | Moins d'actions, cours plus élevé |
| **Dividende** | Détachement du coupon (date *ex-date*), puis paiement ; le cours baisse mécaniquement du montant du dividende |
| **Paiement du dividende en actions** | Option offerte à l'actionnaire, si l'AG le prévoit |
| **Réduction de capital** | Par annulation d'actions (ex. : après rachat) ou réduction du nominal |

### Les rachats d'actions propres

Autorisés par l'**assemblée générale** (pour 18 mois maximum), dans la limite de **10 % du capital**. Objectifs : annulation, couverture de plans d'actionnariat salarié, animation du titre via un contrat de liquidité, croissance externe.
`,
      keyPoints: [
        "DPS : souscription à titre irréductible et réductible ; DPS négociable.",
        "Incorporation de réserves : actions gratuites ou élévation du nominal ; pas de ressources nouvelles.",
        "Division du nominal : capitalisation inchangée.",
        "Rachat d'actions : 10 % du capital maximum, autorisation d'AG de 18 mois maximum.",
      ],
    },
    {
      id: "offres",
      title: "Les offres publiques",
      content: `
| Offre | Principe |
|---|---|
| **OPA** (offre publique d'achat) | Achat des titres contre des **espèces** |
| **OPE** (offre publique d'échange) | Échange contre des **titres** de l'initiateur |
| **Offre mixte / alternative** | Combinaison espèces + titres, ou choix |
| **OPR** (offre publique de retrait) | Permet aux minoritaires de sortir lorsque l'actionnaire majoritaire détient au moins 90 % des droits de vote |
| **Retrait obligatoire** | Exclusion des minoritaires (au moins 90 %), avec indemnisation |

Principes : **égalité de traitement** des actionnaires, **transparence**, **loyauté** dans la compétition, **libre jeu des offres et surenchères**.

L'AMF délivre une **déclaration de conformité** qui emporte visa de la note d'information. Une offre « volontaire » peut être assortie d'un **seuil de caducité** ; une offre obligatoire (franchissement de 30 %) est soumise à un seuil de caducité de 50 %.
`,
      keyPoints: [
        "OPA = espèces ; OPE = titres ; OPR = sortie des minoritaires.",
        "L'AMF délivre une déclaration de conformité ; principes d'égalité, de transparence et de loyauté.",
      ],
    },
    {
      id: "info-emetteurs",
      title: "L'information financière des sociétés cotées",
      content: `
### Information périodique (sociétés cotées sur un marché réglementé)

| Document | Délai |
|---|---|
| **Rapport financier annuel** | Dans les **4 mois** suivant la clôture de l'exercice |
| **Rapport financier semestriel** | Dans les **3 mois** suivant la fin du semestre |

Les comptes consolidés des sociétés cotées sont établis selon les normes **IFRS** depuis 2005. Les grandes entreprises publient un **rapport de durabilité** conforme à la directive **CSRD** (normes ESRS).

### Information permanente

Publication **dès que possible** de toute information privilégiée (voir MAR, thème 4), par voie de communiqué diffusé de manière effective et intégrale.

### Les assemblées générales

- **AGO** : approbation des comptes (dans les 6 mois suivant la clôture), affectation du résultat, nomination des administrateurs ;
- **AGE** : modification des statuts, augmentation ou réduction de capital, fusion.

Le **say on pay** soumet la rémunération des dirigeants au vote des actionnaires.
`,
      keyPoints: [
        "Rapport financier annuel sous 4 mois, semestriel sous 3 mois.",
        "IFRS pour les comptes consolidés des sociétés cotées depuis 2005.",
        "AGO : comptes et dividende ; AGE : statuts et capital.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Lors d'une introduction en bourse, l'offre à prix ouvert (OPO) est principalement destinée :", ["Aux investisseurs institutionnels", "Aux particuliers", "Aux salariés uniquement", "À l'État"], 1, "L'OPO s'adresse aux particuliers ; le placement global aux institutionnels."],
    ["A", "Le prospectus d'une offre au public de titres est approuvé en France par :", ["L'ACPR", "L'AMF", "Euronext", "La Banque de France"], 1, "L'AMF approuve les prospectus (règlement Prospectus)."],
    ["C", "Quelle est la durée de validité d'un prospectus après son approbation ?", ["3 mois", "6 mois", "12 mois", "24 mois"], 2, "Le prospectus est valable 12 mois, sous réserve de suppléments en cas de faits nouveaux."],
    ["C", "L'approbation d'un prospectus par l'AMF signifie :", ["Que l'AMF garantit le succès de l'opération", "Que l'AMF recommande l'investissement", "Que le prospectus est complet, compréhensible et cohérent", "Que les comptes ont été certifiés par l'AMF"], 2, "L'approbation porte sur la qualité de l'information, pas sur l'opportunité de l'investissement."],
    ["A", "Le droit préférentiel de souscription permet à l'actionnaire de souscrire :", ["À titre irréductible et, le cas échéant, réductible", "Uniquement à titre réductible", "Gratuitement aux nouvelles actions", "À un prix fixé par l'AMF"], 0, "Le DPS s'exerce à titre irréductible (proportionnel) et réductible (sur le solde non souscrit)."],
    ["C", "Une augmentation de capital par incorporation de réserves :", ["Apporte de nouvelles ressources financières à la société", "Ne modifie pas le montant des capitaux propres", "Nécessite un DPS", "Augmente l'endettement"], 1, "C'est un simple transfert des réserves vers le capital, sans apport de ressources."],
    ["C", "Une division du nominal par 2 a pour effet :", ["De doubler la capitalisation boursière", "De doubler le nombre d'actions et de diviser le cours par 2 environ", "De réduire de moitié le nombre d'actions", "De supprimer le droit de vote"], 1, "La capitalisation reste inchangée : plus d'actions, cours proportionnellement réduit."],
    ["C", "Le jour du détachement d'un dividende de 2 €, le cours de l'action :", ["Augmente mécaniquement de 2 €", "Baisse mécaniquement d'environ 2 €", "N'est pas affecté", "Est suspendu"], 1, "Le cours est ajusté du montant du dividende détaché."],
    ["A", "Une société cotée peut racheter ses propres actions dans la limite de :", ["5 % du capital", "10 % du capital", "25 % du capital", "50 % du capital"], 1, "Le plafond légal est de 10 % du capital."],
    ["C", "Une OPE est une offre publique :", ["D'achat contre espèces", "D'échange contre des titres", "De retrait", "De vente"], 1, "OPE = offre publique d'échange, rémunérée en titres."],
    ["C", "Le rapport financier annuel d'une société cotée sur un marché réglementé doit être publié dans un délai de :", ["2 mois", "3 mois", "4 mois", "6 mois"], 2, "Le rapport financier annuel est publié dans les 4 mois suivant la clôture."],
    ["C", "En France, une offre au public de titres peut être dispensée de prospectus lorsque son montant total sur 12 mois est inférieur à :", ["1 M€", "8 M€", "20 M€", "100 M€"], 1, "La France a fixé ce seuil à 8 M€ (avec un document d'information synthétique)."],
    ["C", "La modification des statuts ou une augmentation de capital relève :", ["De l'assemblée générale ordinaire", "De l'assemblée générale extraordinaire", "Du directeur financier seul", "De l'AMF"], 1, "L'AGE est compétente pour modifier les statuts et le capital."],
  ]),
};
