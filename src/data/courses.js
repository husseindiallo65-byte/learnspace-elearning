export const courses = [
  {
    id: "react-debutant",
    title: "Apprendre React de zéro",
    category: "Développement web",
    level: "Débutant",
    duration: "8 heures",
    modulesCount: 2,
    students: 1240,
    rating: "4.9",
    color: "blue",
    icon: "⚛️",
    shortDescription: "Construis tes premières interfaces modernes avec React.",
    description: "Une formation progressive pour découvrir React, comprendre les composants et créer une petite application interactive.",
    instructor: "Aminata Ndiaye",
    objectives: ["Comprendre les composants React", "Utiliser les props et le state", "Réagir aux événements", "Créer une interface simple"],
    modules: [
      { id: "module-1", title: "Module 1 — Les bases", chapters: [
        { id: "introduction", title: "Présentation de React", content: "React permet de construire des interfaces utilisateur à partir de composants réutilisables. Dans ce chapitre, découvre son rôle et les concepts essentiels.", videoUrl: "https://youtu.be/ygAuD83FAeA", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/ygAuD83FAeA" },
        { id: "installation", title: "Installer un projet avec Vite", content: "Vite permet de démarrer rapidement un projet frontend. Crée un projet, installe les dépendances puis lance le serveur de développement.", videoUrl: "https://youtu.be/nol0O75VHBE", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/nol0O75VHBE" },
        { id: "composants", title: "Créer ton premier composant", content: "Un composant React est une fonction JavaScript qui retourne une interface en JSX. Les composants rendent le code plus lisible et réutilisable.", videoUrl: "https://youtu.be/zoVdbxOTAFs", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/zoVdbxOTAFs" }
      ]},
      { id: "module-2", title: "Module 2 — Interactions", chapters: [
        { id: "props", title: "Comprendre les props", content: "Les props transmettent des données d'un composant parent vers un composant enfant. Elles permettent de réutiliser un composant avec des contenus différents.", videoUrl: "https://youtu.be/PvndxDHVaW8", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/PvndxDHVaW8" },
        { id: "state", title: "Gérer le state avec useState", content: "Le hook useState permet à un composant de mémoriser une valeur et de se mettre à jour lorsqu'elle change.", videoUrl: "https://youtu.be/OumO16lH9uo", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/OumO16lH9uo" },
        { id: "events", title: "Gérer les événements", content: "Les événements comme onClick permettent de répondre aux actions de l'utilisateur. Combine-les avec le state pour créer des interfaces interactives.", videoUrl: "https://youtu.be/SgyVPPrKffA", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/SgyVPPrKffA" }
      ]}
    ],
    quiz: [
      { question: "Quel hook React permet de gérer un état local ?", options: ["useEffect", "useState", "useRouter", "useFetch"], answer: 1 },
      { question: "Quel langage décrit la structure d'une interface React ?", options: ["SQL", "Bash", "JSX", "PHP uniquement"], answer: 2 },
      { question: "Les props servent principalement à…", options: ["Transmettre des données", "Créer une base de données", "Démarrer Vite", "Remplacer CSS"], answer: 0 },
      { question: "Which options can define a React component?", options: ["A function that returns JSX", "A class extending React.Component", "A CSS selector", "A SQL query"], answer: [0, 1], multiple: true }
    ]
  },
  {
    id: "design-graphique",
    title: "Les bases du design graphique",
    category: "Design graphique",
    level: "Débutant",
    duration: "6 heures",
    modulesCount: 2,
    students: 860,
    rating: "4.8",
    color: "purple",
    icon: "🎨",
    shortDescription: "Apprends les couleurs, la typographie et la composition.",
    description: "Découvre les principes fondamentaux du design et apprends à composer des visuels clairs et harmonieux.",
    instructor: "Moussa Fall",
    objectives: ["Comprendre les couleurs", "Choisir une typographie adaptée", "Organiser une composition", "Créer un visuel cohérent"],
    modules: [
      { id: "module-1", title: "Module 1 — Principes visuels", chapters: [
        { id: "couleurs", title: "Théorie des couleurs", content: "Les couleurs transmettent une ambiance et hiérarchisent les informations. Apprends à choisir une palette cohérente.", videoUrl: "https://youtu.be/x3CAA1Ykh-c", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/x3CAA1Ykh-c" },
        { id: "typographie", title: "Typographie et lisibilité", content: "La typographie donne une personnalité à un support. Privilégie la lisibilité et limite le nombre de polices utilisées.", videoUrl: "https://youtu.be/l2YLOqfXLdY", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/l2YLOqfXLdY" }
      ]},
      { id: "module-2", title: "Module 2 — Composition", chapters: [
        { id: "composition", title: "Équilibre et composition", content: "La hiérarchie, l'espace et l'alignement guident le regard et rendent un visuel plus facile à comprendre.", videoUrl: "https://youtu.be/puO6p2Mo1NM", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/puO6p2Mo1NM" }
      ]}
    ],
    quiz: [
      { question: "Quel élément aide à hiérarchiser un visuel ?", options: ["L'alignement et la taille", "Le hasard", "Le texte invisible", "Aucun"], answer: 0 },
      { question: "Pourquoi choisir une palette cohérente ?", options: ["Pour compliquer la lecture", "Pour créer une harmonie", "Pour supprimer le contraste", "Pour cacher le titre"], answer: 1 }
    ]
  },
  {
    id: "marketing-digital",
    title: "Réussir sur les réseaux sociaux",
    category: "Marketing digital",
    level: "Intermédiaire",
    duration: "5 heures",
    modulesCount: 2,
    students: 940,
    rating: "4.7",
    color: "green",
    icon: "📱",
    shortDescription: "Planifie du contenu et développe une présence en ligne.",
    description: "Apprends à définir tes objectifs, connaître ton public et préparer une stratégie de contenu adaptée aux réseaux sociaux.",
    instructor: "Fatou Sarr",
    objectives: ["Définir une audience", "Créer un calendrier éditorial", "Analyser les résultats", "Améliorer ses contenus"],
    modules: [
      { id: "module-1", title: "Module 1 — Stratégie", chapters: [
        { id: "audience", title: "Connaître son audience", content: "Une stratégie efficace commence par la compréhension du public, de ses besoins et des plateformes qu'il utilise." },
        { id: "contenu", title: "Créer du contenu utile", content: "Un contenu utile répond à un besoin, respecte le format de la plateforme et propose un message clair." }
      ]},
      { id: "module-2", title: "Module 2 — Mesure", chapters: [
        { id: "statistiques", title: "Lire les statistiques", content: "Observe la portée, l'engagement et les clics pour comprendre ce qui fonctionne et améliorer les prochaines publications." }
      ]}
    ],
    quiz: [
      { question: "À quoi sert un calendrier éditorial ?", options: ["À planifier les contenus", "À supprimer les publications", "À changer de mot de passe", "À coder un site"], answer: 0 },
      { question: "Quel indicateur peut mesurer les interactions ?", options: ["L'engagement", "La météo", "La taille de l'écran", "Le nom de domaine"], answer: 0 }
    ]
  },
  {
    id: "bureautique",
    title: "Maîtriser les outils bureautiques",
    category: "Bureautique",
    level: "Débutant",
    duration: "4 heures",
    modulesCount: 1,
    students: 720,
    rating: "4.6",
    color: "orange",
    icon: "📊",
    Image: "https://www.magnific.com/free-photo/african-american-girl-comparing-course-notes-with-data-from-library-collection_416754179.htm#fromView=search&page=1&position=30&uuid=3310a279-9c48-40a8-bc21-5873a2a0ebd7&track=ais_hybrid&query=apprendre+React",
    shortDescription: "Organise tes documents, tableaux et présentations.",
    description: "Une introduction pratique aux outils bureautiques utiles pour les études et le travail.",
    instructor: "Ibrahima Ba",
    objectives: ["Structurer un document", "Créer un tableau", "Présenter des informations", "Organiser ses fichiers"],
    modules: [
      { id: "module-1", title: "Module 1 — Outils essentiels", chapters: [
        { id: "documents", title: "Créer un document clair", content: "Utilise les titres, les paragraphes et les listes pour rendre un document professionnel et facile à lire." },
        { id: "tableaux", title: "Organiser les données", content: "Un tableau bien structuré facilite la lecture et la comparaison des données." }
      ]}
    ],
    quiz: [
      { question: "Quel outil est adapté à des données en lignes et colonnes ?", options: ["Un tableur", "Un lecteur audio", "Une galerie photo", "Un navigateur seul"], answer: 0 }
    ]
  },
  {
    id: "html-css",
    title: "Apprendre HTML et CSS",
    category: "Développement web",
    level: "Débutant",
    duration: "6 heures",
    modulesCount: 2,
    students: 680,
    rating: "4.8",
    color: "orange",
    icon: "💻",
    shortDescription: "Crée et mets en forme tes premières pages web.",
    description: "Découvre HTML pour structurer une page et CSS pour créer des mises en page adaptées à tous les écrans.",
    instructor: "Aminata Ndiaye",
    objectives: ["Structurer une page avec HTML", "Utiliser les balises sémantiques", "Mettre en forme avec CSS", "Créer une mise en page responsive"],
    modules: [
      { id: "module-1", title: "Module 1 — Les bases du HTML", chapters: [
        { id: "structure-html", title: "Structurer une page HTML", content: "Découvre la structure d'un document HTML et le rôle des balises principales comme les titres, les paragraphes et les liens." },
        { id: "balises-semantiques", title: "Utiliser les balises sémantiques", content: "Les balises header, nav, main, section et footer donnent du sens au contenu et facilitent sa compréhension." }
      ]},
      { id: "module-2", title: "Module 2 — Les bases du CSS", chapters: [
        { id: "styles-css", title: "Mettre en forme avec CSS", content: "Apprends à sélectionner des éléments et à modifier leurs couleurs, polices, espacements et bordures avec CSS." },
        { id: "mise-en-page", title: "Créer une mise en page responsive", content: "Utilise Flexbox, Grid et les media queries pour adapter une page aux écrans mobiles et aux ordinateurs." }
      ]}
    ],
    quiz: [
      { question: "Quel langage sert à structurer le contenu d'une page web ?", options: ["CSS", "HTML", "SQL", "Bash"], answer: 1 },
      { question: "À quoi sert principalement CSS ?", options: ["À mettre en forme une page", "À stocker des données", "À envoyer des courriels", "À créer un serveur"], answer: 0 },
      { question: "Quelle balise représente le contenu principal d'une page ?", options: ["<main>", "<color>", "<style>", "<img>"], answer: 0 }
    ]
  },
  {
    id: "javascript-debutant",
    title: "Les bases de JavaScript",
    category: "Développement web",
    level: "Débutant",
    duration: "7 heures",
    modulesCount: 2,
    students: 590,
    rating: "4.9",
    color: "green",
    icon: "🟨",
    shortDescription: "Ajoute de l'interactivité à tes pages web.",
    description: "Apprends les fondamentaux de JavaScript et utilise-les pour réagir aux actions des utilisateurs et manipuler une page web.",
    instructor: "Moussa Fall",
    objectives: ["Déclarer des variables", "Utiliser les conditions et les boucles", "Créer des fonctions", "Réagir aux événements d'une page"],
    modules: [
      { id: "module-1", title: "Module 1 — Les fondamentaux", chapters: [
        { id: "variables-js", title: "Variables et types de données", content: "Découvre let et const, puis manipule des chaînes de caractères, des nombres et des valeurs booléennes." },
        { id: "conditions-js", title: "Conditions et boucles", content: "Utilise les conditions pour choisir une action et les boucles pour répéter des instructions." }
      ]},
      { id: "module-2", title: "Module 2 — Fonctions et interactions", chapters: [
        { id: "fonctions-js", title: "Créer des fonctions", content: "Une fonction regroupe des instructions réutilisables. Apprends à lui transmettre des paramètres et à retourner un résultat." },
        { id: "evenements-js", title: "Réagir aux événements", content: "Les événements comme un clic permettent de déclencher du code et de rendre une page interactive." }
      ]}
    ],
    quiz: [
      { question: "Quel mot-clé permet de déclarer une variable qui ne sera pas réassignée ?", options: ["const", "for", "return", "if"], answer: 0 },
      { question: "À quoi sert une fonction ?", options: ["À regrouper des instructions réutilisables", "À styliser une page", "À créer une image", "À remplacer HTML"], answer: 0 },
      { question: "Quel événement correspond à un clic sur un élément ?", options: ["change", "click", "loadtext", "style"], answer: 1 }
    ]
  },
  {
    id: "entrepreneuriat-business",
    title: "Entrepreneuriat & Business",
    category: "Entrepreneuriat & Business",
    level: "Débutant",
    duration: "8 heures",
    modulesCount: 2,
    students: 420,
    rating: "4.8",
    color: "green",
    icon: "📈",
    shortDescription: "Transforme une idée en projet d’entreprise viable.",
    description: "Découvre les bases de l’entrepreneuriat, construis une proposition de valeur et apprends à organiser le lancement de ton activité.",
    instructor: "Aminata Ndiaye",
    objectives: ["Évaluer une idée et les besoins du marché", "Définir une proposition de valeur", "Construire un modèle économique", "Préparer le lancement et le suivi d’une activité"],
    modules: [
      {
        id: "module-1",
        title: "Module 1 — De l’idée au modèle économique",
        chapters: [
          { id: "idee-entrepreneuriale", title: "Trouver et évaluer une idée", content: "Une idée d’entreprise répond à un besoin réel. Identifie un problème, observe les solutions existantes et échange avec de futurs clients pour vérifier que ton idée leur serait utile." },
          { id: "etude-marche", title: "Comprendre son marché", content: "Une étude de marché aide à connaître ses clients, ses concurrents et les tendances du secteur. Définis ton public cible et recueille des informations avant de prendre des décisions." },
          { id: "modele-economique", title: "Construire son modèle économique", content: "Le modèle économique explique comment une entreprise crée de la valeur et génère des revenus. Précise ton offre, tes clients, tes canaux de vente, tes coûts et tes sources de revenus." }
        ]
      },
      {
        id: "module-2",
        title: "Module 2 — Lancer et développer son activité",
        chapters: [
          { id: "plan-financier", title: "Préparer un budget prévisionnel", content: "Estime les dépenses nécessaires au démarrage, les coûts réguliers et les revenus attendus. Un budget prévisionnel permet d’anticiper les besoins de financement et de suivre la santé financière de l’activité." },
          { id: "strategie-commerciale", title: "Définir sa stratégie commerciale", content: "Choisis comment présenter ton offre, fixer tes prix et atteindre tes clients. Une stratégie commerciale efficace s’appuie sur la valeur apportée et sur une relation de confiance avec les clients." },
          { id: "lancement-activite", title: "Organiser le lancement de son entreprise", content: "Prépare les étapes de lancement, les priorités et les indicateurs qui te permettront de mesurer les résultats. Recueille les retours des premiers clients et ajuste ton offre au fil du temps." }
        ]
      }
    ],
    quiz: [
      { question: "Quel est l’objectif principal d’une étude de marché ?", options: ["Comprendre les clients et l’environnement concurrentiel", "Garantir un bénéfice immédiat", "Remplacer le suivi des dépenses"], answer: 0 },
      { question: "Que décrit un modèle économique ?", options: ["Comment l’entreprise crée de la valeur et génère des revenus", "Uniquement le nom de l’entreprise", "Le calendrier des congés"], answer: 0 },
      { question: "À quoi sert un budget prévisionnel ?", options: ["Anticiper les coûts et les revenus", "Éviter de suivre les dépenses", "Déterminer les goûts de tous les clients"], answer: 0 },
      { question: "Quelle action aide à améliorer une offre après son lancement ?", options: ["Écouter les retours des clients", "Ignorer les résultats", "Arrêter toute communication"], answer: 0 }
    ]
  },
  {
    id: "relation-client-centres-appel",
    title: "Métiers des centres d'appel & Relation client",
    category: "Relation client",
    level: "Débutant",
    duration: "7 heures",
    modulesCount: 2,
    students: 360,
    rating: "4.8",
    color: "blue",
    icon: "🎧",
    shortDescription: "Développe les compétences essentielles des métiers de la relation client.",
    description: "Découvre le fonctionnement d’un centre d’appel, apprends à communiquer avec les clients et entraîne-toi à gérer les demandes et les situations difficiles avec professionnalisme.",
    instructor: "Fatou Sarr",
    objectives: ["Comprendre les missions d’un centre d’appel", "Accueillir et écouter un client avec professionnalisme", "Communiquer clairement au téléphone", "Gérer les réclamations et assurer le suivi des demandes"],
    modules: [
      {
        id: "module-1",
        title: "Module 1 — Les fondamentaux de la relation client",
        chapters: [
          { id: "metiers-centre-appel", title: "Découvrir les métiers des centres d’appel", content: "Les centres d’appel accompagnent les clients par téléphone et parfois par messagerie. Les conseillers peuvent répondre aux demandes, fournir des informations, assurer un suivi ou contacter des clients. La qualité de service repose sur l’écoute, la clarté et le respect des procédures." },
          { id: "accueil-client", title: "Réussir l’accueil téléphonique", content: "Un accueil professionnel commence par une salutation claire, la présentation de l’entreprise et l’identification du besoin. Garde un ton courtois, vérifie les informations utiles et explique au client les prochaines étapes." },
          { id: "ecoute-active", title: "Pratiquer l’écoute active", content: "L’écoute active consiste à laisser le client exprimer sa demande, repérer les informations importantes et reformuler le besoin pour confirmer sa compréhension. Pose des questions simples et évite d’interrompre ton interlocuteur." }
        ]
      },
      {
        id: "module-2",
        title: "Module 2 — Communication et gestion des demandes",
        chapters: [
          { id: "communication-telephone", title: "Communiquer avec clarté et empathie", content: "Adapte ton vocabulaire au client, parle à un rythme facile à suivre et privilégie des explications concises. Reconnaître la difficulté rencontrée par le client permet de créer un échange respectueux, sans promettre une solution qui n’est pas confirmée." },
          { id: "gestion-reclamations", title: "Gérer une réclamation avec méthode", content: "Face à une réclamation, reste calme et laisse le client expliquer la situation. Reformule le problème, vérifie les faits, puis propose une réponse conforme aux procédures ou transmets la demande au bon interlocuteur." },
          { id: "suivi-qualite", title: "Assurer le suivi et la qualité de service", content: "Après l’échange, consigne les informations nécessaires dans l’outil prévu et indique les actions convenues. Un suivi rigoureux aide l’équipe à reprendre le dossier et permet au client de connaître la suite donnée à sa demande." }
        ]
      }
    ],
    quiz: [
      { question: "Quelle pratique aide à confirmer la compréhension de la demande d’un client ?", options: ["Reformuler son besoin", "Changer immédiatement de sujet", "L’interrompre pour accélérer l’appel"], answer: 0 },
      { question: "Comment réagir face à une réclamation ?", options: ["Écouter, reformuler et vérifier les faits", "Promettre une solution sans vérifier", "Mettre fin à l’échange sans explication"], answer: 0 },
      { question: "Pourquoi consigner les informations après un échange ?", options: ["Pour assurer le suivi du dossier", "Pour éviter toute transmission à l’équipe", "Pour remplacer la réponse au client"], answer: 0 },
      { question: "Quel comportement contribue à une communication professionnelle ?", options: ["Parler clairement et avec courtoisie", "Employer un ton impatient", "Utiliser un vocabulaire volontairement compliqué"], answer: 0 }
    ]
  },
  {
    id: "leadership-developpement-personnel",
    title: "Leadership & Développement personnel",
    category: "Développement personnel",
    level: "Débutant",
    duration: "6 heures",
    modulesCount: 2,
    students: 310,
    rating: "4.8",
    color: "purple",
    icon: "🌱",
    shortDescription: "Renforce ta confiance, ton organisation et tes compétences de leadership.",
    description: "Apprends à mieux te connaître, à définir des objectifs réalistes et à développer les qualités nécessaires pour guider un projet et collaborer efficacement.",
    instructor: "Moussa Fall",
    objectives: ["Identifier ses forces et ses axes de progression", "Définir des objectifs clairs et atteignables", "Améliorer son organisation personnelle", "Développer une communication et un leadership responsables"],
    modules: [
      {
        id: "module-1",
        title: "Module 1 — Se connaître et progresser",
        chapters: [
          { id: "connaissance-de-soi", title: "Mieux se connaître", content: "La connaissance de soi consiste à reconnaître ses valeurs, ses forces et les situations qui nous motivent. Prendre le temps d’observer ses habitudes aide à choisir des objectifs cohérents et à repérer les compétences à développer." },
          { id: "objectifs-personnels", title: "Définir des objectifs motivants", content: "Un objectif clair donne une direction à l’effort. Décris le résultat souhaité, fixe une échéance réaliste et identifie de petites étapes mesurables. Réévalue régulièrement ton plan pour l’adapter aux progrès et aux contraintes." },
          { id: "organisation-personnelle", title: "Organiser son temps et ses priorités", content: "Une bonne organisation commence par distinguer les tâches urgentes des tâches importantes. Planifie des périodes de travail réalistes, limite les distractions et prévois des pauses afin de maintenir un rythme durable." }
        ]
      },
      {
        id: "module-2",
        title: "Module 2 — Communiquer et guider une équipe",
        chapters: [
          { id: "communication-leadership", title: "Communiquer avec clarté", content: "Une communication efficace présente les idées de façon claire, écoute les autres et vérifie que le message est compris. Adapte ton ton et tes explications à la situation, et accueille les questions avec respect." },
          { id: "collaboration-equipe", title: "Favoriser la collaboration", content: "Une équipe avance mieux lorsque les rôles et les objectifs sont partagés. Encourage les contributions, reconnais les compétences de chacun et traite les désaccords en recherchant des solutions constructives." },
          { id: "leadership-responsable", title: "Pratiquer un leadership responsable", content: "Le leadership consiste à donner une direction et à aider un groupe à progresser, pas seulement à donner des consignes. Un leadership responsable s’appuie sur l’exemplarité, l’équité, l’écoute et la prise de responsabilité." }
        ]
      }
    ],
    quiz: [
      { question: "Quel est l’intérêt de mieux connaître ses forces et ses valeurs ?", options: ["Choisir des objectifs cohérents et repérer ses axes de progression", "Éviter tout retour des autres", "Garantir que chaque projet réussira"], answer: 0 },
      { question: "Comment rendre un objectif plus facile à suivre ?", options: ["Le découper en étapes mesurables", "Ne pas fixer de résultat attendu", "Attendre la dernière minute pour planifier"], answer: 0 },
      { question: "Quelle pratique favorise une communication efficace ?", options: ["Écouter et vérifier que le message est compris", "Parler sans laisser de place aux questions", "Employer le plus de jargon possible"], answer: 0 },
      { question: "Sur quoi repose un leadership responsable ?", options: ["L’écoute, l’équité et l’exemplarité", "Le contrôle de chaque décision", "L’absence de collaboration"], answer: 0 }
    ]
  }
];

export const categories = ["Toutes", "Développement web", "Design graphique", "Marketing digital", "Bureautique", "Entrepreneuriat & Business", "Relation client", "Développement personnel"];

export function getCourse(id) {
  return courses.find((course) => course.id === id);
}

export function getAllChapters(course) {
  return course.modules.flatMap((module) => module.chapters);
}
