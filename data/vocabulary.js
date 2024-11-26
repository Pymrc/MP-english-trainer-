// data/vocabulary.js

export const vocabulary = {
    // Transitions et connecteurs logiques
    transitionWords: [
        {
            id: "t1",
            english: "furthermore",
            french: "de plus",
            category: "addition",
            register: "formal",
            usage: "Furthermore, recent studies have shown significant progress in this field.",
            context: "Perfect for adding supporting arguments in essays"
        },
        {
            id: "t2",
            english: "nevertheless",
            french: "néanmoins",
            category: "contrast",
            register: "formal",
            usage: "Nevertheless, some challenges remain to be addressed.",
            context: "Useful for introducing counter-arguments"
        },
        // ... plus de transitions
    ],

    // Vocabulaire académique essentiel
    academicVocabulary: [
        {
            id: "a1",
            english: "to analyze",
            french: "analyser",
            forms: {
                noun: "analysis",
                adjective: "analytical",
                adverb: "analytically"
            },
            collocations: [
                "to analyze data",
                "to analyze the implications",
                "detailed analysis",
                "analytical approach"
            ],
            usage: "This paper analyzes the impact of recent technological developments.",
            level: "B2"
        },
        // ... plus de vocabulaire académique
    ],

    // Expressions pour la synthèse
    synthesisExpressions: [
        {
            id: "s1",
            english: "According to",
            french: "Selon",
            context: "Document reference",
            examples: [
                "According to Document 1, renewable energy sources are becoming increasingly important.",
                "According to the author, this trend is likely to continue."
            ]
        },
        // ... plus d'expressions pour la synthèse
    ],

    // Expressions pour l'expression écrite
    essayExpressions: [
        {
            id: "e1",
            english: "In my opinion",
            french: "À mon avis",
            alternates: [
                "From my perspective",
                "In my view",
                "As I see it"
            ],
            register: "neutral",
            context: "Opinion expression",
            usage: "In my opinion, the advantages of this technology outweigh its drawbacks."
        },
        // ... plus d'expressions pour les essays
    ],

    // Vocabulaire technique MP
    technicalVocabulary: [
        {
            id: "tech1",
            english: "quantum computing",
            french: "informatique quantique",
            field: "computer science",
            context: "Advanced technology",
            definition: "Computing using quantum-mechanical phenomena",
            usage: "Quantum computing could revolutionize cryptography and data processing.",
            relatedTerms: [
                "quantum bit",
                "quantum entanglement",
                "quantum supremacy"
            ]
        },
        // ... plus de vocabulaire technique
    ],

    // Expressions idiomatiques utiles
    idiomaticExpressions: [
        {
            id: "i1",
            english: "to shed light on",
            french: "éclairer/mettre en lumière",
            register: "formal",
            usage: "This research sheds light on the complex relationship between technology and society.",
            synonyms: [
                "to illuminate",
                "to clarify",
                "to elucidate"
            ]
        },
        // ... plus d'expressions idiomatiques
    ],

    // Vocabulaire pour la discussion des enjeux contemporains
    contemporaryIssues: [
        {
            id: "ci1",
            english: "artificial intelligence",
            french: "intelligence artificielle",
            subtopics: [
                "machine learning",
                "neural networks",
                "AI ethics"
            ],
            keyPhrases: [
                "ethical implications of AI",
                "AI-driven innovation",
                "machine learning algorithms"
            ],
            usage: "The ethical implications of artificial intelligence are becoming increasingly important.",
            relatedVocabulary: [
                "automation",
                "deep learning",
                "data privacy"
            ]
        },
        // ... plus de sujets contemporains
    ],

    // Exemples de sujets de concours
    examTopics: [
        {
            id: "et1",
            topic: "Technology and Society",
            subtopics: [
                "Digital privacy",
                "Social media impact",
                "Technological dependence"
            ],
            keyVocabulary: [
                "digital footprint",
                "data protection",
                "online privacy"
            ],
            usefulPhrases: [
                "The impact of technology on society is far-reaching",
                "Digital privacy has become a major concern",
                "Social media has transformed communication"
            ]
        },
        // ... plus de sujets de concours
    ]
};

// Formules couramment utilisées dans les concours
export const commonFormulas = {
    introduction: [
        {
            structure: "General statement + Specific focus + Thesis",
            example: "The rapid advancement of technology has transformed every aspect of our lives. In particular, artificial intelligence has emerged as a powerful force in modern society. This essay will examine the implications of AI development for privacy and security.",
            when: "Perfect for essay introductions"
        },
        // ... plus de formules d'introduction
    ],
    
    conclusion: [
        {
            structure: "Summary + Future perspective",
            example: "While the benefits of AI are clear, careful consideration must be given to its ethical implications. The coming years will be crucial in determining how we balance technological progress with human values.",
            when: "Ideal for essay conclusions"
        },
        // ... plus de formules de conclusion
    ]
};

// Thèmes récurrents aux concours
export const commonThemes = [
    {
        name: "Technology and Progress",
        vocabulary: [
            "innovation",
            "breakthrough",
            "advancement",
            "development"
        ],
        expressions: [
            "technological breakthrough",
            "cutting-edge technology",
            "revolutionary innovation"
        ]
    },
    // ... plus de thèmes
];

// Vocabulaire spécifique aux différentes sections des épreuves
export const examSections = {
    comprehension: {
        vocabulary: [/* ... */],
        expressions: [/* ... */]
    },
    synthesis: {
        vocabulary: [/* ... */],
        expressions: [/* ... */]
    },
    essay: {
        vocabulary: [/* ... */],
        expressions: [/* ... */]
    }
};
