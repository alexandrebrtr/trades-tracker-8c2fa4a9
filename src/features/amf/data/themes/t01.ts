import { buildQuestions, Theme } from "../../types";

const id = "t01";

export const theme01: Theme = {
  id,
  number: 1,
  title: "Cadre institutionnel et réglementaire français, européen et international",
  shortTitle: "Cadre institutionnel",
  description:
    "Les autorités de régulation (AMF, ACPR, BCE, ESMA…), les grands textes européens et les statuts des acteurs financiers.",
  duration: 35,
  sections: [
    {
      id: "autorites-fr",
      title: "Les autorités françaises",
      content: `
### L'Autorité des marchés financiers (AMF)

L'AMF est une **autorité publique indépendante** dotée de la personnalité morale, créée par la **loi de sécurité financière du 1er août 2003** (fusion de la COB, du CMF et du CDGF).

Ses **trois missions** (art. L.621-1 du Code monétaire et financier) :

1. veiller à la **protection de l'épargne** investie dans les instruments financiers et autres placements offerts au public ;
2. veiller à l'**information des investisseurs** ;
3. veiller au **bon fonctionnement des marchés** financiers.

Organisation :

| Organe | Rôle |
|---|---|
| **Collège** | Organe décisionnel : réglementation (Règlement général de l'AMF, homologué par arrêté du ministre de l'Économie), agréments, décisions individuelles, ouverture des procédures de sanction |
| **Commission des sanctions** | Organe distinct et indépendant du Collège, qui prononce les sanctions |
| **Président** | Nommé par décret du Président de la République, mandat de 5 ans non renouvelable |
| **Médiateur** | Règle à l'amiable et **gratuitement** les litiges entre épargnants et professionnels |

Sanctions : jusqu'à **100 millions d'euros** ou **10 fois le profit** réalisé. Sanctions disciplinaires possibles pour les professionnels (avertissement, blâme, interdiction d'exercer…). La **composition administrative** permet de transiger avec un professionnel pour certains manquements (hors abus de marché).

Recours : devant le **Conseil d'État** pour les professionnels régulés, devant la **Cour d'appel de Paris** pour les autres personnes.

### L'Autorité de contrôle prudentiel et de résolution (ACPR)

Créée en 2010, **adossée à la Banque de France**, l'ACPR veille à la **stabilité du système financier** et à la **protection des clients** des banques et assurances.

- Elle **agrée** les établissements de crédit, les entreprises d'investissement (hors SGP), les entreprises d'assurance, les établissements de paiement…
- Elle exerce le **contrôle prudentiel** (solvabilité, liquidité) et dispose d'un pouvoir de **résolution** des crises bancaires.
- Le **pôle commun AMF-ACPR** (« Assurance Banque Épargne Info Service ») coordonne le contrôle des pratiques commerciales.

### Autres acteurs

- **Ministère de l'Économie / Direction générale du Trésor** : prépare la législation financière.
- **Haut Conseil de stabilité financière (HCSF)** : politique macroprudentielle.
- **Banque de France** : membre de l'Eurosystème, tient le fichier des démarcheurs, adosse l'ACPR.
- **FGDR** (Fonds de garantie des dépôts et de résolution) : garantit les **dépôts jusqu'à 100 000 €** et les **titres jusqu'à 70 000 €** par client et par établissement.
`,
      keyPoints: [
        "AMF : autorité publique indépendante créée en 2003 ; protection de l'épargne, information des investisseurs, bon fonctionnement des marchés.",
        "Commission des sanctions distincte du Collège ; amende jusqu'à 100 M€ ou 10 fois le profit.",
        "ACPR : adossée à la Banque de France ; agrément et contrôle prudentiel des banques et assurances.",
        "FGDR : 100 000 € pour les dépôts, 70 000 € pour les titres.",
      ],
    },
    {
      id: "europe",
      title: "Le cadre européen",
      content: `
### Le Système européen de surveillance financière (SESF)

Créé en 2011 après la crise de 2008, il repose sur :

| Autorité | Siège | Domaine |
|---|---|---|
| **ESMA** (AEMF) | Paris | Marchés financiers et valeurs mobilières |
| **EBA** (ABE) | Paris (depuis 2019) | Banques |
| **EIOPA** (AEAPP) | Francfort | Assurances et retraites professionnelles |
| **CERS / ESRB** | Francfort | Risque systémique (surveillance macroprudentielle) |

L'ESMA élabore des **normes techniques**, des **orientations (guidelines)** et des **Q&A**, et supervise directement certains acteurs (agences de notation, référentiels centraux). Elle dispose de pouvoirs d'**intervention sur les produits** (ex. : interdiction des options binaires aux clients de détail).

### L'Union bancaire

- **Mécanisme de surveillance unique (MSU)** : depuis novembre 2014, la **BCE** supervise directement les banques « importantes » de la zone euro ; les autres restent supervisées par les autorités nationales (ACPR en France) sous son contrôle.
- **Mécanisme de résolution unique (MRU)** et Fonds de résolution unique.

### Le processus Lamfalussy

Méthode d'élaboration de la réglementation financière européenne en **4 niveaux** :

1. **Niveau 1** : textes cadres (directives / règlements) adoptés par le Parlement et le Conseil ;
2. **Niveau 2** : mesures d'exécution (actes délégués, normes techniques) ;
3. **Niveau 3** : convergence de la supervision (orientations de l'ESMA…) ;
4. **Niveau 4** : contrôle de l'application par la Commission européenne.

> Une **directive** doit être transposée en droit national ; un **règlement** est d'application directe dans tous les États membres.

### Principaux textes à connaître

- **MIF 2 / MiFIR** (directive 2014/65/UE, appliquée le **3 janvier 2018**) : services d'investissement, protection des investisseurs, structure des marchés.
- **MAR** (règlement abus de marché, 2016).
- **OPCVM (UCITS)** et **AIFM** (gestion collective).
- **PRIIPs** (document d'informations clés).
- **EMIR** (dérivés de gré à gré) et **CSDR** (dépositaires centraux).
- **SFDR** et **Taxonomie** (finance durable).
- **MiCA** (crypto-actifs, pleinement applicable depuis le 30 décembre 2024).
- **DORA** (résilience opérationnelle numérique, applicable depuis janvier 2025).

### Le passeport européen

Un prestataire agréé dans un État membre peut exercer dans tout l'Espace économique européen :

- en **libre prestation de services (LPS)** : sans implantation locale ;
- en **libre établissement** : via une **succursale**.

Il suffit d'une **notification** auprès de l'autorité d'origine, qui la transmet à l'autorité d'accueil.
`,
      keyPoints: [
        "ESMA à Paris (marchés), EBA à Paris (banques), EIOPA à Francfort (assurances), CERS (risque systémique).",
        "La BCE supervise directement les banques importantes de la zone euro depuis 2014 (MSU).",
        "Lamfalussy : 4 niveaux ; un règlement est d'application directe, une directive doit être transposée.",
        "Passeport européen : libre prestation de services ou libre établissement (succursale).",
      ],
    },
    {
      id: "international",
      title: "Le cadre international",
      content: `
- **OICV / IOSCO** : Organisation internationale des commissions de valeurs ; elle réunit les régulateurs de marchés du monde entier et établit des principes de régulation.
- **Comité de Bâle** (au sein de la BRI) : normes prudentielles bancaires (**Bâle III** : ratios de fonds propres, de liquidité LCR et NSFR, ratio de levier).
- **Conseil de stabilité financière (FSB)** : coordination internationale sous l'égide du G20.
- **GAFI / FATF** : lutte contre le blanchiment et le financement du terrorisme (voir thème 3).
- **FMI** et **Banque mondiale** : stabilité monétaire internationale et financement du développement.
`,
      keyPoints: [
        "OICV/IOSCO : régulateurs de marchés ; Comité de Bâle : normes prudentielles bancaires.",
        "FSB : coordination de la stabilité financière sous l'égide du G20.",
      ],
    },
    {
      id: "acteurs",
      title: "Les statuts des acteurs",
      content: `
### Les prestataires de services d'investissement (PSI)

Les PSI sont les **entreprises d'investissement** et les **établissements de crédit** agréés pour fournir des services d'investissement.

Les **services d'investissement** (art. L.321-1 CMF) :

1. Réception et transmission d'ordres (**RTO**) pour le compte de tiers ;
2. **Exécution d'ordres** pour le compte de tiers ;
3. **Négociation pour compte propre** ;
4. **Gestion de portefeuille** pour le compte de tiers ;
5. **Conseil en investissement** ;
6. **Prise ferme** ;
7. **Placement garanti** ;
8. **Placement non garanti** ;
9. Exploitation d'un **système multilatéral de négociation (SMN)** ;
10. Exploitation d'un **système organisé de négociation (OTF)**.

Les **services connexes** incluent notamment la **tenue de compte-conservation**, l'octroi de crédit pour réaliser une opération, le conseil aux entreprises (structure du capital, fusions), le service de change lié, la recherche en investissement.

Agrément : les entreprises d'investissement sont agréées par l'**ACPR**, après **approbation par l'AMF du programme d'activité** pour les services d'investissement.

### Les sociétés de gestion de portefeuille (SGP)

Agréées par l'**AMF**, elles gèrent des OPC (OPCVM, FIA) et/ou des mandats individuels.

### Les autres statuts

| Statut | Supervision | Particularités |
|---|---|---|
| **CIF** (conseiller en investissements financiers) | Adhésion à une **association agréée par l'AMF** et immatriculation à l'**ORIAS** | Conseil en investissement, ne peut pas recevoir de fonds des clients (sauf honoraires) |
| **PSFP** (prestataire de services de financement participatif) | Agrément AMF (règlement européen ECSP) | Plateformes de crowdfunding |
| **PSCA / CASP** (prestataire de services sur crypto-actifs) | Agrément AMF sous **MiCA** | Remplace l'ancien régime PSAN depuis la fin de la période transitoire |
| **Agent lié** | Mandaté par un seul PSI, qui en est responsable | Immatriculé à l'ORIAS |

> L'**ORIAS** tient le registre unique des intermédiaires en assurance, banque et finance (CIF, IOBSP, agents liés…).
`,
      keyPoints: [
        "PSI = entreprises d'investissement + établissements de crédit agréés pour fournir des services d'investissement.",
        "La tenue de compte-conservation est un service connexe, pas un service d'investissement.",
        "SGP agréées par l'AMF ; entreprises d'investissement agréées par l'ACPR après approbation du programme d'activité par l'AMF.",
        "CIF : adhésion à une association agréée par l'AMF + immatriculation ORIAS.",
      ],
    },
  ],
  questions: buildQuestions(id, [
    ["A", "Quelle loi a créé l'Autorité des marchés financiers ?", ["La loi de modernisation des activités financières de 1996", "La loi de sécurité financière du 1er août 2003", "La loi PACTE de 2019", "La loi Sapin 2 de 2016"], 1, "L'AMF a été créée par la loi de sécurité financière du 1er août 2003, par fusion de la COB, du CMF et du CDGF."],
    ["A", "Parmi les missions suivantes, laquelle ne relève PAS de l'AMF ?", ["La protection de l'épargne investie dans les instruments financiers", "L'information des investisseurs", "Le contrôle de la solvabilité des banques", "Le bon fonctionnement des marchés financiers"], 2, "Le contrôle prudentiel (solvabilité) des banques relève de l'ACPR et, pour les banques importantes, de la BCE."],
    ["A", "Quel organe de l'AMF prononce les sanctions ?", ["Le Collège", "La Commission des sanctions", "Le Président de l'AMF", "Le Médiateur"], 1, "La Commission des sanctions est un organe distinct du Collège ; le Collège ouvre la procédure (notification des griefs), la Commission des sanctions statue."],
    ["C", "Quel est le montant maximal de la sanction pécuniaire que peut prononcer la Commission des sanctions de l'AMF ?", ["1,5 million d'euros", "15 millions d'euros", "100 millions d'euros ou 10 fois le profit réalisé", "Il n'existe pas de plafond"], 2, "Le plafond est de 100 millions d'euros ou du décuple du montant de l'avantage retiré du manquement."],
    ["C", "Le recours contre une sanction de l'AMF prononcée à l'encontre d'un professionnel régulé est porté devant :", ["La Cour de cassation", "Le Conseil d'État", "Le tribunal de commerce", "La Cour européenne des droits de l'homme"], 1, "Les professionnels régulés forment leur recours devant le Conseil d'État ; les autres personnes devant la Cour d'appel de Paris."],
    ["C", "L'ACPR est adossée à :", ["L'AMF", "La Banque de France", "La Direction générale du Trésor", "La Banque centrale européenne"], 1, "L'ACPR est une autorité administrative indépendante adossée à la Banque de France."],
    ["C", "Où se situe le siège de l'ESMA ?", ["Francfort", "Bruxelles", "Paris", "Luxembourg"], 2, "L'ESMA (Autorité européenne des marchés financiers) est installée à Paris. L'EBA y est également installée depuis 2019."],
    ["C", "Depuis 2014, la supervision directe des grandes banques de la zone euro est assurée par :", ["L'EBA", "La BCE dans le cadre du MSU", "Le Comité de Bâle", "Chaque autorité nationale exclusivement"], 1, "Le Mécanisme de surveillance unique (MSU) confie à la BCE la supervision directe des banques importantes."],
    ["C", "Dans le processus Lamfalussy, le niveau 3 correspond :", ["À l'adoption des textes cadres", "Aux mesures d'exécution", "À la convergence des pratiques de supervision", "Au contrôle de l'application du droit par la Commission"], 2, "Niveau 3 : coopération et convergence des superviseurs (orientations, Q&A de l'ESMA)."],
    ["A", "Un règlement européen :", ["Doit être transposé en droit national dans un délai de 2 ans", "Est d'application directe dans tous les États membres", "N'a qu'une valeur de recommandation", "Ne s'applique qu'aux États de la zone euro"], 1, "Contrairement à la directive, le règlement est directement applicable sans transposition."],
    ["A", "Parmi les services suivants, lequel est un service connexe et non un service d'investissement ?", ["La gestion de portefeuille pour compte de tiers", "Le conseil en investissement", "La tenue de compte-conservation", "La réception et transmission d'ordres"], 2, "La tenue de compte-conservation est un service connexe (art. L.321-2 CMF)."],
    ["C", "Une société de gestion de portefeuille est agréée par :", ["L'ACPR", "L'AMF", "La Banque de France", "L'ORIAS"], 1, "Les SGP sont agréées par l'AMF."],
    ["C", "Un conseiller en investissements financiers (CIF) doit notamment :", ["Être agréé par l'ACPR", "Adhérer à une association professionnelle agréée par l'AMF et être immatriculé à l'ORIAS", "Disposer d'un capital minimum de 5 millions d'euros", "Être obligatoirement salarié d'une banque"], 1, "Le CIF adhère à une association agréée par l'AMF et s'immatricule au registre de l'ORIAS."],
    ["C", "Le passeport européen permet à un PSI agréé en France de fournir ses services dans un autre État de l'EEE :", ["Uniquement après un nouvel agrément dans le pays d'accueil", "En libre prestation de services ou via une succursale, sur simple notification", "Uniquement via une filiale", "Uniquement pour les clients professionnels"], 1, "Le passeport repose sur une notification à l'autorité d'origine, en LPS ou en libre établissement (succursale)."],
    ["C", "Quel est le plafond de garantie du FGDR pour les titres d'un client auprès d'un établissement ?", ["30 000 €", "70 000 €", "100 000 €", "150 000 €"], 1, "La garantie des titres est de 70 000 € ; celle des dépôts de 100 000 €."],
    ["C", "Le Médiateur de l'AMF :", ["Facture ses services à l'épargnant", "Intervient gratuitement pour régler à l'amiable les litiges", "Peut prononcer des sanctions", "N'intervient que pour les clients professionnels"], 1, "La médiation de l'AMF est gratuite et confidentielle ; le médiateur ne sanctionne pas."],
  ]),
};
