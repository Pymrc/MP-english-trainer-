
// Base de données du vocabulaire et des expressions
const vocabularyData = {
    academic: [
        { id: 1, english: "nevertheless", french: "néanmoins", category: "Transition", usage: "Nevertheless, this argument overlooks crucial factors", difficulty: 1, lastReview: null, nextReview: null },
        { id: 2, english: "whereas", french: "tandis que", category: "Transition", usage: "Whereas previous studies focused on X, this paper examines Y", difficulty: 1, lastReview: null, nextReview: null },
        // Ajoutez plus de vocabulaire académique ici
    ],
    expressions: [
        { id: 101, english: "to shed light on", french: "éclairer/mettre en lumière", category: "Analysis", usage: "This study sheds light on the environmental impact", difficulty: 2, lastReview: null, nextReview: null },
        { id: 102, english: "to draw a parallel", french: "établir un parallèle", category: "Comparison", usage: "We can draw a parallel between these two phenomena", difficulty: 2, lastReview: null, nextReview: null },
        // Ajoutez plus d'expressions ici
    ],
    examPrep: [
        { id: 201, english: "In conclusion", french: "En conclusion", category: "Essay Structure", usage: "In conclusion, the evidence suggests that...", difficulty: 1, lastReview: null, nextReview: null },
        { id: 202, english: "To illustrate this point", french: "Pour illustrer ce point", category: "Essay Structure", usage: "To illustrate this point, we can examine...", difficulty: 1, lastReview: null, nextReview: null },
        // Ajoutez plus de phrases type concours ici
    ]
};

// État de l'application
const state = {
    currentMode: 'flashcards',
    currentCard: null,
    score: 0,
    streak: 0,
    mastered: 0,
    reviewQueue: [],
};

// Système de révision espacée (Algorithme SM-2 simplifié)
class SpacedRepetition {
    static calculateNextReview(quality, repetitions) {
        if (quality < 3) {
            return new Date(Date.now() + 1000 * 60 * 60 * 24); // Revoir demain
        }
        const interval = Math.pow(2, repetitions) * 24 * 60 * 60 * 1000;
        return new Date(Date.now() + interval);
    }
}

// Gestionnaire de stockage local
class Storage {
    static saveProgress(progress) {
        localStorage.setItem('mp-english-progress', JSON.stringify(progress));
    }

    static getProgress() {
        const saved = localStorage.getItem('mp-english-progress');
        return saved ? JSON.parse(saved) : {};
    }
}

// Gestionnaire de l'interface utilisateur
class UI {
    static updateStats() {
        document.getElementById('streak').textContent = `Série: ${state.streak}`;
        document.getElementById('mastered').textContent = `Maîtrisés: ${state.mastered}/${Object.keys(vocabularyData).reduce((acc, key) => acc + vocabularyData[key].length, 0)}`;
    }

    static showCard(card) {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="text-center">
                <div class="text-lg font-bold mb-4">${card.english}</div>
                <div class="hidden" id="answer">
                    <div class="text-xl mb-2">${card.french}</div>
                    <div class="text-sm text-gray-600 mb-4">${card.usage}</div>
                </div>
                <button id="showAnswer" class="bg-blue-500 text-white px-4 py-2 rounded">
                    Voir la réponse
                </button>
                <div id="ratingButtons" class="hidden mt-4 space-x-2">
                    <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="App.rateCard(1)">Difficile</button>
                    <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="App.rateCard(3)">Moyen</button>
                    <button class="bg-green-500 text-white px-4 py-2 rounded" onclick="App.rateCard(5)">Facile</button>
                </div>
            </div>
        `;

        document.getElementById('showAnswer').addEventListener('click', () => {
            document.getElementById('answer').classList.remove('hidden');
            document.getElementById('ratingButtons').classList.remove('hidden');
            document.getElementById('showAnswer').classList.add('hidden');
        });
    }
}

// Application principale
class App {
    static init() {
        // Initialiser les événements des boutons de mode
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });

        // Charger la progression sauvegardée
        const progress = Storage.getProgress();
        state.mastered = Object.keys(progress).length;

        // Démarrer en mode flashcards
        this.switchMode('flashcards');
    }

    static switchMode(mode) {
        state.currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
            btn.classList.toggle('bg-blue-500', btn.dataset.mode === mode);
            btn.classList.toggle('bg-gray-200', btn.dataset.mode !== mode);
            btn.classList.toggle('text-white', btn.dataset.mode === mode);
        });

        switch (mode) {
            case 'flashcards':
                this.startFlashcards();
                break;
            case 'quiz':
                this.startQuiz();
                break;
            case 'exam':
                this.showExamPrep();
                break;
            case 'builder':
                this.showPhraseBuilder();
                break;
        }
    }

    static startFlashcards() {
        state.reviewQueue = this.getReviewQueue();
        if (state.reviewQueue.length > 0) {
            state.currentCard = state.reviewQueue[0];
            UI.showCard(state.currentCard);
        } else {
            document.getElementById('content').innerHTML = `
                <div class="text-center py-12">
                    <p class="text-xl">Félicitations ! Vous avez terminé toutes les révisions pour aujourd'hui.</p>
                </div>
            `;
        }
    }

    static getReviewQueue() {
        const progress = Storage.getProgress();
        const now = new Date();
        
        return Object.values(vocabularyData)
            .flat()
            .filter(card => {
                const cardProgress = progress[card.id];
                return !cardProgress || new Date(cardProgress.nextReview) <= now;
            })
            .sort(() => Math.random() - 0.5);
    }

    static rateCard(quality) {
        const progress = Storage.getProgress();
        const cardProgress = progress[state.currentCard.id] || { repetitions: 0 };
        
        cardProgress.repetitions = quality < 3 ? 0 : cardProgress.repetitions + 1;
        cardProgress.lastReview = new Date();
        cardProgress.nextReview = SpacedRepetition.calculateNextReview(quality, cardProgress.repetitions);
        
        progress[state.currentCard.id] = cardProgress;
        Storage.saveProgress(progress);

        if (quality >= 4) {
            state.streak++;
            if (!progress[state.currentCard.id]) {
                state.mastered++;
            }
        } else {
            state.streak = 0;
        }

        UI.updateStats();
        state.reviewQueue.shift();
        this.startFlashcards();
    }

    static startQuiz() {
        // Implémenter le mode quiz
    }

    static showExamPrep() {
        // Implémenter la préparation aux examens
    }

    static showPhraseBuilder() {
        // Implémenter le constructeur de phrases
    }
}

// Initialiser l'application au chargement
document.addEventListener('DOMContentLoaded', () => App.init());
