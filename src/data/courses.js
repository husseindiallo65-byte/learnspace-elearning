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
        { id: "introduction", title: "Présentation de React", content: "React permet de construire des interfaces utilisateur à partir de composants réutilisables. Dans ce chapitre, découvre son rôle et les concepts essentiels." },
        { id: "installation", title: "Installer un projet avec Vite", content: "Vite permet de démarrer rapidement un projet frontend. Crée un projet, installe les dépendances puis lance le serveur de développement." },
        { id: "composants", title: "Créer ton premier composant", content: "Un composant React est une fonction JavaScript qui retourne une interface en JSX. Les composants rendent le code plus lisible et réutilisable." }
      ]},
      { id: "module-2", title: "Module 2 — Interactions", chapters: [
        { id: "props", title: "Comprendre les props", content: "Les props transmettent des données d'un composant parent vers un composant enfant. Elles permettent de réutiliser un composant avec des contenus différents." },
        { id: "state", title: "Gérer le state avec useState", content: "Le hook useState permet à un composant de mémoriser une valeur et de se mettre à jour lorsqu'elle change." },
        { id: "events", title: "Gérer les événements", content: "Les événements comme onClick permettent de répondre aux actions de l'utilisateur. Combine-les avec le state pour créer des interfaces interactives." }
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
        { id: "couleurs", title: "Théorie des couleurs", content: "Les couleurs transmettent une ambiance et hiérarchisent les informations. Apprends à choisir une palette cohérente." },
        { id: "typographie", title: "Typographie et lisibilité", content: "La typographie donne une personnalité à un support. Privilégie la lisibilité et limite le nombre de polices utilisées." }
      ]},
      { id: "module-2", title: "Module 2 — Composition", chapters: [
        { id: "composition", title: "Équilibre et composition", content: "La hiérarchie, l'espace et l'alignement guident le regard et rendent un visuel plus facile à comprendre." }
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
  }
];

export const categories = ["Toutes", "Développement web", "Design graphique", "Marketing digital", "Bureautique"];

export function getCourse(id) {
  return courses.find((course) => course.id === id);
}

export function getAllChapters(course) {
  return course.modules.flatMap((module) => module.chapters);
}
