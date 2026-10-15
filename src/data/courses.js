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
      { question: "Les props servent principalement à…", options: ["Transmettre des données", "Créer une base de données", "Démarrer Vite", "Remplacer CSS"], answer: 0 }
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
  }
];

export const categories = ["Toutes", "Développement web", "Design graphique", "Marketing digital", "Bureautique"];

export function getCourse(id) {
  return courses.find((course) => course.id === id);
}

export function getAllChapters(course) {
  return course.modules.flatMap((module) => module.chapters);
}
