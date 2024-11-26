// Import core utilities
import { appState, config } from '../core/init.js';

class FlashcardsModule {
    constructor() {
        this.currentCard = null;
        this.isShowingAnswer = false;
        this.cardQueue = [];
        this.reviewStack = [];
        this.sessionStats = {
            started: null,
            reviewed: 0,
            correct: 0
        };
    }

    // Module Initialization
    async init() {
        this.sessionStats.started = new Date();
        await this.loadCards();
        this.setupEventListeners();
        this.showNextCard();
    }

    // Card Management
    async loadCards() {
        // Filter cards based on current settings
        const { category, difficulty } = appState.filters;
        this.cardQueue = await this.getFilteredCards(category, difficulty);
        this.shuffleCards();
    }

    async getFilteredCards(category, difficulty) {
        // Get cards based on spaced repetition and filters
        const today = new Date();
        return this.cardQueue.filter(card => {
            const categoryMatch = category === 'all' || card.category === category;
            const difficultyMatch = difficulty === 'all' || card.difficulty === parseInt(difficulty);
            const dueForReview = !card.nextReview || new Date(card.nextReview) <= today;
            return categoryMatch && difficultyMatch && dueForReview;
        });
    }

    shuffleCards() {
        for (let i = this.cardQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cardQueue[i], this.cardQueue[j]] = [this.cardQueue[j], this.cardQueue[i]];
        }
    }

    // Card Display
    showNextCard() {
        if (this.cardQueue.length === 0) {
            this.showSessionComplete();
            return;
        }

        this.currentCard = this.cardQueue.shift();
        this.isShowingAnswer = false;
        this.renderCard();
    }

    renderCard() {
        const studyArea = document.getElementById('study-area');
        
        if (!this.isShowingAnswer) {
            studyArea.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-[400px] card-container">
                    <div class="text-sm text-gray-500 mb-4">${this.currentCard.category.toUpperCase()}</div>
                    <div class="text-3xl font-bold mb-8">${this.currentCard.english}</div>
                    <button onclick="window.flashcards.showAnswer()" 
                            class="btn-primary transform transition hover:scale-105">
                        Voir la réponse
                    </button>
                    <div class="mt-8 text-sm text-gray-500">
                        Carte ${this.sessionStats.reviewed + 1}/${this.sessionStats.reviewed + this.cardQueue.length + 1}
                    </div>
                </div>
            `;
        } else {
            studyArea.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-[400px] card-container">
                    <div class="text-sm text-gray-500 mb-4">${this.currentCard.category.toUpperCase()}</div>
                    <div class="text-3xl font-bold mb-4">${this.currentCard.english}</div>
                    <div class="text-2xl text-blue-600 mb-4">${this.currentCard.french}</div>
                    <div class="text-gray-600 mb-8 text-center max-w-md">
                        <div class="mb-2 font-medium">Exemple :</div>
                        ${this.currentCard.usage}
                    </div>
                    <div class="flex gap-4">
                        <button onclick="window.flashcards.rateCard(1)" 
                                class="btn-danger transform transition hover:scale-105">
                            Difficile
                        </button>
                        <button onclick="window.flashcards.rateCard(3)" 
                                class="btn-warning transform transition hover:scale-105">
                            Moyen
                        </button>
                        <button onclick="window.flashcards.rateCard(5)" 
                                class="btn-success transform transition hover:scale-105">
                            Facile
                        </button>
                    </div>
                </div>
            `;
        }
    }

    showAnswer() {
        this.isShowingAnswer = true;
        this.renderCard();
    }

    // Card Rating & Spaced Repetition
    rateCard(rating) {
        this.sessionStats.reviewed++;
        if (rating >= 4) {
            this.sessionStats.correct++;
        }

        // Update card's spaced repetition data
        this.updateCardProgress(this.currentCard, rating);
        
        // Update global progress
        appState.updateProgress(rating >= 4);

        // Show next card
        this.showNextCard();
    }

    updateCardProgress(card, rating) {
        const now = new Date();
        
        // Calculate next review date based on rating and current level
        let interval;
        if (rating === 5) { // Easy
            interval = card.level ? card.level * 2 : 3;
        } else if (rating === 3) { // Medium
            interval = card.level ? card.level : 1;
        } else { // Hard
            interval = 1;
        }

        // Update card data
        card.lastReview = now;
        card.nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
        card.level = rating >= 3 ? (card.level ? card.level + 1 : 1) : 0;
    }

    // Session Management
    showSessionComplete() {
        const accuracy = (this.sessionStats.correct / this.sessionStats.reviewed * 100).toFixed(1);
        const duration = Math.round((new Date() - this.sessionStats.started) / 1000 / 60);

        const studyArea = document.getElementById('study-area');
        studyArea.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div class="text-3xl font-bold mb-8">Session terminée !</div>
                <div class="grid grid-cols-3 gap-8 mb-8">
                    <div class="stat-card">
                        <div class="text-gray-600">Cartes révisées</div>
                        <div class="text-2xl font-bold">${this.sessionStats.reviewed}</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-gray-600">Précision</div>
                        <div class="text-2xl font-bold">${accuracy}%</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-gray-600">Temps</div>
                        <div class="text-2xl font-bold">${duration} min</div>
                    </div>
                </div>
                <button onclick="window.flashcards.startNewSession()" 
                        class="btn-primary">
                    Nouvelle session
                </button>
            </div>
        `;
    }

    async startNewSession() {
        this.sessionStats = {
            started: new Date(),
            reviewed: 0,
            correct: 0
        };
        await this.loadCards();
        this.showNextCard();
    }

    // Event Listeners
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.currentCard) return;

            if (!this.isShowingAnswer && e.code === 'Space') {
                e.preventDefault();
                this.showAnswer();
            } else if (this.isShowingAnswer) {
                if (e.key === '1') {
                    this.rateCard(1); // Hard
                } else if (e.key === '2') {
                    this.rateCard(3); // Medium
                } else if (e.key === '3') {
                    this.rateCard(5); // Easy
                }
            }
        });
    }
}

// Initialize and export
const flashcards = new FlashcardsModule();
window.flashcards = flashcards; // For global access
export default flashcards;
