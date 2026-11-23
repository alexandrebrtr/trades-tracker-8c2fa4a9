import { buildQuestions, Theme } from "../../types";

const id = "t10";

export const theme10: Theme = {
  id,
  number: 10,
  title: "Le post-marché et les infrastructures de marché",
  shortTitle: "Post-marché",
  description:
    "Compensation, contrepartie centrale, règlement-livraison, dépositaire central, T2S, tenue de compte-conservation, EMIR et CSDR.",
  duration: 30,
  sections: [
    {
      id: "chaine",
      title: "La chaîne de traitement des titres",
      content: `
Une transaction passe par trois étapes successives :

1. **Négociation** (*trading*) : rencontre de l'offre et de la demande sur un lieu d'exécution ;
2. **Compensation** (*clearing*) : calcul des positions nettes des participants et, le cas échéant, interposition d'une contrepartie centrale ;
3. **Règlement-livraison** (*settlement*) : transfert simultané des titres et des espèces.

### La contrepartie centrale (CCP)

La chambre de compensation **s'interpose** entre l'acheteur et le vendeur : elle devient l'acheteur de tout vendeur et le vendeur de tout acheteur. Elle **garantit la bonne fin** des transactions et supprime le **risque de contrepartie** entre participants.

Outils de maîtrise des risques :

- **dépôts de garantie** (marges initiales) ;
- **appels de marge** quotidiens selon la variation des positions ;
- **fonds de défaillance** alimenté par les membres compensateurs.

Exemples : **LCH SA** (Paris), **Euronext Clearing**, Eurex Clearing.

### Le règlement-livraison

- Principe du **règlement contre paiement** (DVP — *delivery versus payment*) : la livraison des titres et le paiement sont simultanés et irrévocables.
- Délai standard en Europe : **J+2** (T+2) après la négociation, pour les titres négociés sur une plateforme. L'Union européenne a programmé le passage à **J+1** au **11 octobre 2027**.
- **Dépositaire central (CSD)** : en France, **Euroclear France**. Il assure l'émission des titres en compte, la tenue des comptes des teneurs de compte et le règlement-livraison.
- **T2S** (*TARGET2-Securities*) : plateforme de l'Eurosystème qui assure le règlement-livraison des titres en monnaie banque centrale pour de nombreux CSD européens.
`,
      keyPoints: [
        "Négociation → compensation → règlement-livraison.",
        "La CCP s'interpose et garantit la bonne fin : dépôts de garantie, appels de marge, fonds de défaillance.",
        "Règlement-livraison à J+2 en Europe, passage à J+1 prévu le 11 octobre 2027.",
        "Euroclear France = dépositaire central ; T2S = plateforme de règlement de l'Eurosystème.",
      ],
    },
    {
      id: "tcc",
      title: "La tenue de compte-conservation",
      content: `
En France, les titres sont **dématérialisés** depuis **1984** : ils n'existent que par une **inscription en compte**.

### Les modes de détention

| Mode | Teneur du compte | Particularités |
|---|---|---|
| **Nominatif pur** | L'**émetteur** (ou son mandataire) | Pas de droits de garde ; l'émetteur connaît l'actionnaire |
| **Nominatif administré** | L'intermédiaire financier du client (l'émetteur tient aussi un registre) | Actionnaire connu de l'émetteur |
| **Au porteur** | L'intermédiaire financier | L'émetteur ne connaît pas directement ses actionnaires (procédure d'identification possible) |

### Le teneur de compte-conservateur (TCC)

Il :

- tient les comptes-titres des clients et **conserve** les titres ;
- assure le traitement des **opérations sur titres** (OST : dividendes, coupons, augmentations de capital…) ;
- assure la **ségrégation** des avoirs des clients et de ses propres avoirs ;
- adresse aux clients les relevés et l'IFU (imprimé fiscal unique).

Il est soumis à une **obligation de restitution** des titres. Les avoirs des clients sont protégés en cas de défaillance du TCC.

### Les autres acteurs

- **Centralisateur** d'une OST ;
- **Agent payeur** ;
- **Dépositaire** d'OPC (voir thème 8).
`,
      keyPoints: [
        "Titres dématérialisés depuis 1984 : inscription en compte.",
        "Nominatif pur (tenu par l'émetteur), nominatif administré, porteur.",
        "Le TCC conserve les titres, traite les OST et ségrègue les avoirs des clients.",
      ],
    },
    {
      id: "reglementation",
      title: "EMIR et CSDR",
      content: `
### EMIR (*European Market Infrastructure Regulation*, 2012)

Il encadre les **dérivés de gré à gré**, les contreparties centrales et les référentiels centraux :

- **obligation de compensation** par une CCP des dérivés OTC standardisés désignés par l'ESMA (certains swaps de taux, CDS sur indices…) ;
- **déclaration** de toutes les transactions sur dérivés (cotés et OTC) à un **référentiel central** (*trade repository*) ;
- **techniques d'atténuation des risques** pour les dérivés non compensés (échange de collatéral, confirmation rapide, rapprochement de portefeuilles).

### CSDR (*Central Securities Depositories Regulation*, 2014)

Il harmonise le fonctionnement des dépositaires centraux :

- délai maximal de règlement à **J+2** pour les titres négociés sur une plateforme ;
- **discipline en matière de règlement** : **pénalités** en espèces pour les suspens de livraison (depuis février 2022) ;
- passeport pour les CSD.
`,
      keyPoints: [
        "EMIR : compensation obligatoire des dérivés OTC standardisés + déclaration aux référentiels centraux.",
        "CSDR : J+2 maximum, pénalités pour les suspens de règlement.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Dans quel ordre se déroule la chaîne de traitement d'une transaction ?", ["Compensation, négociation, règlement-livraison", "Négociation, compensation, règlement-livraison", "Règlement-livraison, négociation, compensation", "Négociation, règlement-livraison, compensation"], 1, "La transaction est négociée, puis compensée, puis dénouée par le règlement-livraison."],
    ["A", "Le rôle principal d'une contrepartie centrale est :", ["De conseiller les investisseurs", "De s'interposer entre acheteur et vendeur et de garantir la bonne fin des transactions", "De conserver les titres des particuliers", "De fixer les cours de bourse"], 1, "La CCP devient l'acheteur de tout vendeur et le vendeur de tout acheteur."],
    ["A", "Le délai standard de règlement-livraison des actions négociées sur Euronext est actuellement de :", ["J (le jour même)", "J+2", "J+3", "J+5"], 1, "J+2 depuis 2014 ; l'UE prévoit le passage à J+1 le 11 octobre 2027."],
    ["C", "Le dépositaire central de titres en France est :", ["La Banque de France", "Euroclear France", "Euronext Paris", "LCH SA"], 1, "Euroclear France est le CSD français."],
    ["C", "T2S est :", ["Un indice boursier", "Une plateforme de règlement-livraison de l'Eurosystème", "Une chambre de compensation privée", "Un système de paiement par carte"], 1, "TARGET2-Securities permet le règlement en monnaie banque centrale."],
    ["C", "Le principe DVP (delivery versus payment) signifie :", ["Que la livraison des titres précède le paiement de 2 jours", "Que la livraison des titres et le paiement sont simultanés", "Que le paiement est facultatif", "Que les titres sont livrés au domicile"], 1, "DVP : livraison contre paiement simultanée, éliminant le risque en principal."],
    ["C", "Les outils de maîtrise des risques d'une chambre de compensation comprennent :", ["Les dépôts de garantie et les appels de marge", "Les rétrocessions", "Le droit de vote double", "Le prospectus"], 0, "Dépôts de garantie, appels de marge et fonds de défaillance."],
    ["A", "Au nominatif pur, le compte-titres de l'actionnaire est tenu par :", ["Son intermédiaire financier", "L'émetteur ou son mandataire", "L'AMF", "Euronext"], 1, "Au nominatif pur, c'est l'émetteur qui tient le compte."],
    ["C", "Depuis quelle année les titres sont-ils dématérialisés en France ?", ["1968", "1984", "2000", "2010"], 1, "La dématérialisation a été instaurée par la loi de finances pour 1982, effective en 1984."],
    ["C", "Le teneur de compte-conservateur doit notamment :", ["Garantir la performance des titres", "Assurer la ségrégation des avoirs de ses clients", "Fixer le dividende", "Agréer les émetteurs"], 1, "Il sépare les avoirs des clients de ses propres avoirs et en assure la restitution."],
    ["C", "Le règlement EMIR impose notamment :", ["La compensation obligatoire des dérivés OTC standardisés et leur déclaration à un référentiel central", "L'interdiction des dérivés", "La cotation de tous les dérivés sur Euronext", "Le règlement à J+5"], 0, "EMIR repose sur la compensation obligatoire, la déclaration et l'atténuation des risques."],
    ["C", "Le régime de discipline en matière de règlement de CSDR prévoit :", ["Des pénalités en espèces pour les suspens de livraison", "La suppression des CSD", "Un règlement à J+10", "Une garantie de l'État"], 0, "Des pénalités s'appliquent aux participants responsables de suspens de règlement."],
  ]),
};
