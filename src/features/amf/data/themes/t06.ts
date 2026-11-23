import { buildQuestions, Theme } from "../../types";

const id = "t06";

export const theme06: Theme = {
  id,
  number: 6,
  title: "Relation client, conseil et information des clients",
  shortTitle: "Relation client",
  description:
    "Classification des clients, évaluation de l'adéquation et du caractère approprié, meilleure exécution, information sur les coûts et traitement des réclamations.",
  duration: 35,
  sections: [
    {
      id: "classification",
      title: "La classification des clients",
      content: `
MIF 2 impose de classer chaque client dans l'une des trois catégories ; le niveau de protection est décroissant :

| Catégorie | Protection | Exemples |
|---|---|---|
| **Client non professionnel** (de détail) | Maximale | Particuliers, petites entreprises |
| **Client professionnel** | Intermédiaire | Établissements financiers, grandes entreprises, États |
| **Contrepartie éligible** | Minimale (uniquement pour RTO, exécution et négociation pour compte propre) | Banques, entreprises d'investissement, assureurs, OPC, banques centrales |

### Les professionnels « par nature »

Entités agréées du secteur financier, États, banques centrales, et **grandes entreprises** remplissant au moins **2 des 3 critères** :

- total du bilan ≥ **20 M€** ;
- chiffre d'affaires net ≥ **40 M€** ;
- capitaux propres ≥ **2 M€**.

### Le professionnel « sur option »

Un client non professionnel peut demander à être traité comme professionnel s'il remplit au moins **2 des 3 critères** :

- avoir réalisé des transactions d'une **taille significative**, à raison d'au moins **10 par trimestre** en moyenne sur les **4 trimestres** précédents ;
- détenir un portefeuille d'instruments financiers (y compris dépôts en espèces) supérieur à **500 000 €** ;
- occuper ou avoir occupé pendant au moins **1 an** un poste dans le secteur financier requérant une connaissance des opérations envisagées.

La demande est **écrite**, l'établissement avertit le client des protections perdues, et le client confirme par écrit qu'il en est conscient.

### Les changements de catégorie

- Un professionnel peut toujours demander à être traité comme **non professionnel** (plus de protection).
- Il incombe au client professionnel d'informer l'établissement de tout changement susceptible de modifier sa catégorie.
`,
      keyPoints: [
        "Trois catégories : non professionnel, professionnel, contrepartie éligible.",
        "Grande entreprise : 2 critères sur 3 parmi bilan 20 M€, CA 40 M€, capitaux propres 2 M€.",
        "Professionnel sur option : 2 sur 3 parmi 10 transactions/trimestre sur 4 trimestres, portefeuille > 500 000 €, 1 an d'expérience professionnelle.",
      ],
    },
    {
      id: "adequation",
      title: "Adéquation et caractère approprié",
      content: `
### L'évaluation de l'adéquation (*suitability*)

Obligatoire pour le **conseil en investissement** et la **gestion de portefeuille**. L'établissement recueille des informations sur :

1. les **connaissances et l'expérience** du client en matière d'investissement ;
2. sa **situation financière**, y compris sa **capacité à subir des pertes** ;
3. ses **objectifs d'investissement**, y compris sa **tolérance au risque** et son horizon ;
4. ses **préférences en matière de durabilité** (depuis août 2022).

> Si le client ne fournit pas les informations nécessaires, l'établissement **ne peut pas** lui recommander de service de conseil ni de gestion.

Avant la transaction, le client non professionnel reçoit une **déclaration d'adéquation** sur support durable, expliquant en quoi la recommandation correspond à son profil.

### L'évaluation du caractère approprié (*appropriateness*)

Pour les **autres services** (RTO, exécution d'ordres), l'établissement évalue uniquement les **connaissances et l'expérience** du client au regard du produit.

- Si le produit n'est pas approprié, l'établissement **met en garde** le client (il peut néanmoins exécuter si le client insiste).
- Si le client ne fournit pas d'informations, il est averti que l'établissement n'est pas en mesure de juger du caractère approprié.

### L'exécution simple (*execution only*)

Aucune évaluation n'est requise lorsque les trois conditions sont réunies :

- le service est fourni **à l'initiative du client** ;
- il porte sur des **instruments non complexes** (actions cotées, obligations simples, OPCVM, instruments du marché monétaire…) ;
- le client a été informé qu'aucune évaluation n'est effectuée.

### Conseil indépendant ou non indépendant

Le client est informé, avant la prestation, du caractère **indépendant** ou non du conseil. Le conseil indépendant implique l'analyse d'une **gamme suffisante** d'instruments diversifiés et l'interdiction de conserver les rétrocessions.
`,
      keyPoints: [
        "Adéquation (conseil, gestion) : connaissances/expérience, situation financière, objectifs, préférences de durabilité.",
        "Caractère approprié (RTO, exécution) : connaissances et expérience uniquement ; mise en garde si inapproprié.",
        "Execution only : initiative du client + instrument non complexe + information du client.",
        "Déclaration d'adéquation remise avant la transaction au client non professionnel.",
      ],
    },
    {
      id: "execution",
      title: "Meilleure exécution et traitement des ordres",
      content: `
### La meilleure exécution (*best execution*)

Le PSI prend toutes les mesures suffisantes pour obtenir **le meilleur résultat possible** pour ses clients, en tenant compte :

- du **prix** et des **coûts** ;
- de la **rapidité** ;
- de la **probabilité d'exécution et de règlement** ;
- de la **taille** et de la **nature** de l'ordre ;
- de toute autre considération pertinente.

Pour un **client non professionnel**, le meilleur résultat est déterminé sur la base du **coût total** (prix de l'instrument + coûts liés à l'exécution).

Le PSI établit une **politique d'exécution**, à laquelle le client consent, et la réexamine **au moins une fois par an**. Une **instruction spécifique** du client prévaut sur la politique pour les éléments concernés.

### Le traitement des ordres

- exécution **rapide, honnête et équitable**, dans l'ordre d'arrivée des ordres comparables ;
- **regroupement** d'ordres autorisé s'il ne désavantage globalement aucun client, selon une politique d'allocation ;
- **horodatage** et enregistrement des ordres.

### L'enregistrement des conversations

Les conversations téléphoniques et communications électroniques relatives aux ordres et transactions sont **enregistrées** et **conservées 5 ans** (7 ans sur demande de l'autorité). Le client en est informé préalablement.
`,
      keyPoints: [
        "Best execution : prix, coûts, rapidité, probabilité d'exécution et de règlement, taille, nature.",
        "Client non professionnel : critère du coût total.",
        "Politique d'exécution réexaminée au moins annuellement.",
        "Enregistrements conservés 5 ans (7 ans sur demande de l'AMF).",
      ],
    },
    {
      id: "information",
      title: "Information du client et réclamations",
      content: `
### L'information sur les coûts et frais

- **Ex ante** : avant la fourniture du service, information agrégée sur l'ensemble des coûts (service + instrument), en montant et en pourcentage, avec l'effet cumulé sur le rendement.
- **Ex post** : au moins **une fois par an**, relevé des coûts effectivement supportés.

### Les relevés et comptes rendus

- **Avis d'exécution** envoyé au plus tard le **premier jour ouvrable** suivant l'exécution de l'ordre.
- Relevé des instruments et fonds détenus : au moins **trimestriel**.
- **Gestion sous mandat** : rapport périodique **trimestriel** ; alerte du client si la valeur du portefeuille **baisse de 10 %** depuis le dernier relevé (puis par multiples de 10 %), au plus tard à la fin du jour ouvrable.
- Pour les comptes comportant des positions à effet de levier, alerte en cas de baisse de 10 % de la valeur de chaque instrument.

### La convention de compte

La fourniture de services à un client non professionnel repose sur une **convention écrite** précisant les droits et obligations des parties.

### Le traitement des réclamations

- accusé de réception sous **10 jours ouvrables** maximum ;
- réponse dans un délai de **2 mois** maximum à compter de la réception ;
- traitement **gratuit**, information sur les voies de recours (médiateur de l'AMF ou médiateur de l'établissement).

### Le secret professionnel et la protection des données

Les établissements sont tenus au **secret professionnel** et au **RGPD** (finalité, minimisation, droits d'accès et de rectification…).
`,
      keyPoints: [
        "Coûts et frais : information ex ante et ex post (au moins annuelle).",
        "Avis d'exécution au plus tard le 1er jour ouvrable suivant.",
        "Gestion sous mandat : rapport trimestriel ; alerte à 10 % de baisse.",
        "Réclamations : accusé de réception sous 10 jours ouvrables, réponse sous 2 mois.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Quelle catégorie de clients bénéficie du plus haut niveau de protection sous MIF 2 ?", ["Contrepartie éligible", "Client professionnel", "Client non professionnel", "Investisseur qualifié"], 2, "Le client non professionnel (de détail) bénéficie de la protection maximale."],
    ["A", "Pour être traité comme professionnel sur option, un client doit remplir au moins :", ["1 critère sur 3", "2 critères sur 3", "3 critères sur 3", "4 critères sur 5"], 1, "Deux des trois critères : volume de transactions, portefeuille > 500 000 €, expérience professionnelle d'au moins 1 an."],
    ["C", "Le critère de portefeuille pour devenir client professionnel sur option est un portefeuille supérieur à :", ["100 000 €", "250 000 €", "500 000 €", "1 000 000 €"], 2, "Le portefeuille d'instruments financiers (y compris espèces) doit dépasser 500 000 €."],
    ["C", "Une grande entreprise est un client professionnel par nature si elle remplit 2 des 3 critères suivants :", ["Bilan 20 M€, CA 40 M€, capitaux propres 2 M€", "Bilan 10 M€, CA 20 M€, 250 salariés", "Bilan 43 M€, CA 50 M€, 250 salariés", "Bilan 5 M€, CA 10 M€, capitaux propres 1 M€"], 0, "Seuils MIF 2 : total bilan 20 M€, chiffre d'affaires net 40 M€, capitaux propres 2 M€."],
    ["A", "L'évaluation de l'adéquation est obligatoire pour :", ["La réception-transmission d'ordres", "Le conseil en investissement et la gestion de portefeuille", "La tenue de compte", "Toutes les opérations sur actions"], 1, "L'adéquation (suitability) concerne le conseil et la gestion sous mandat."],
    ["A", "Parmi ces éléments, lequel n'est PAS recueilli lors de l'évaluation du caractère approprié ?", ["Les connaissances du client", "L'expérience du client", "La situation financière et les objectifs du client", "Les types d'instruments déjà traités"], 2, "Le caractère approprié ne porte que sur les connaissances et l'expérience."],
    ["A", "Si un client refuse de communiquer les informations nécessaires à l'évaluation de l'adéquation, l'établissement :", ["Peut lui fournir un conseil standard", "Ne peut pas lui fournir de conseil en investissement ni de service de gestion", "Doit le déclarer à Tracfin", "Doit le classer en professionnel"], 1, "Sans informations, l'adéquation ne peut être évaluée : le conseil et la gestion sont exclus."],
    ["C", "Depuis août 2022, l'évaluation de l'adéquation intègre également :", ["Les opinions politiques du client", "Les préférences du client en matière de durabilité", "Son historique de crédit", "Sa nationalité"], 1, "Les préférences ESG/durabilité du client sont recueillies depuis le 2 août 2022."],
    ["A", "Le service d'exécution simple (execution only) suppose notamment :", ["Un instrument complexe", "Que le service soit fourni à l'initiative du client sur un instrument non complexe", "Un client professionnel", "Un mandat de gestion"], 1, "Conditions : initiative du client, instrument non complexe, information du client."],
    ["C", "Pour un client non professionnel, la meilleure exécution s'apprécie principalement au regard :", ["De la rapidité", "Du coût total", "De la taille de l'ordre", "Du lieu d'exécution le plus proche"], 1, "Pour un client de détail, le coût total (prix + frais) est déterminant."],
    ["C", "La politique d'exécution d'un PSI doit être réexaminée :", ["Tous les 5 ans", "Au moins une fois par an", "Uniquement à la demande de l'AMF", "Jamais"], 1, "Le réexamen intervient au moins annuellement, et à chaque changement significatif."],
    ["C", "Les enregistrements des conversations téléphoniques relatives aux ordres sont conservés :", ["1 an", "3 ans", "5 ans", "10 ans"], 2, "5 ans, voire 7 ans à la demande de l'autorité compétente."],
    ["C", "En gestion sous mandat pour un client non professionnel, celui-ci doit être informé lorsque la valeur du portefeuille baisse de :", ["5 %", "10 %", "20 %", "50 %"], 1, "Alerte à 10 % de baisse depuis le dernier relevé, puis par multiples de 10 %."],
    ["C", "Une réclamation client doit recevoir une réponse dans un délai maximal de :", ["10 jours", "1 mois", "2 mois", "6 mois"], 2, "Accusé de réception sous 10 jours ouvrables et réponse sous 2 mois maximum."],
    ["C", "L'avis d'exécution d'un ordre doit être adressé au client non professionnel :", ["Dans le mois", "Au plus tard le premier jour ouvrable suivant l'exécution", "Une fois par an", "Uniquement sur demande"], 1, "L'avis d'exécution est envoyé au plus tard le premier jour ouvrable suivant l'exécution."],
  ]),
};
