// Import core utilities
import { appState, config } from '../core/init.js';

class QuizModule {
    constructor() {
        this.currentQuiz = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.quizStats = {
            startTime: null,
            endTime: null,
            correctAnswers: 0,
            wrongAnswers: 0,
            timePerQuestion: []
        };
    }

    async init() {
        this.quizStats.startTime = new Date();
        await this.generateQuiz();
        this.showCurrentQuestion();
    }

    async generateQuiz() {
        const { category, difficulty } = appState.filters;
        const allCards = await this.getFilteredCards(category, difficulty);
        
        // Select 10 random cards for the quiz
        this.questions = this.shuffleArray(allCards)
            .slice(0, 10)
            .map(card => {
                // Generate wrong answers
                const wrongAnswers = this.generateWrongAnswers(card, allCards);
                return {
                    question: card.english,
                    correctAnswer: card.french,
                    allAnswers: this.shuffleArray([card.french, ...wrongAnswers]),
                    card: card,
                    timeStarted: null
                };
            });
    }

    generateWrongAnswers(correctCard, allCards) {
        return allCards
            .filter(card => card.id !== correctCard.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(card => card.french);
    }

    showCurrentQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        question.timeStarted = new Date();

        const studyArea = document.getElementById('study-area');
        studyArea.innerHTML = `
            <div class="flex flex-col items-center p-6">
                <!-- Progress -->
                <div class="w-full mb-8">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Question ${this.currentQuestionIndex + 1}/10</span>
                        <span>Score: ${this.score}/${this.currentQuestionIndex}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 rounded-full h-2 transition-all"
                             style="width: ${(this.currentQuestionIndex + 1) * 10}%">
                        </div>
                    </div>
                </div>

                <!-- Question -->
                <div class="text-center mb-8">
                    <div class="text-sm text-gray-500 mb-2">Traduisez :</div>
                    <div class="text-2xl font-bold">${question.question}</div>
                </div>

                <!-- Answers -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    ${question.allAnswers.map((answer, index) => `
                        <button onclick="window.quiz.checkAnswer('${answer}')"
                                class="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all text-left">
                            ${answer}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    checkAnswer(selectedAnswer) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;
        const timeSpent = new Date() - question.timeStarted;

        // Update statistics
        this.quizStats.timePerQuestion.push(timeSpent);
        if (isCorrect) {
            this.quizStats.correctAnswers++;
            this.score++;
        } else {
            this.quizStats.wrongAnswers++;
        }

        // Save answer for review
        this.answers.push({
            question: question.question,
            correctAnswer: question.correctAnswer,
            selectedAnswer: selectedAnswer,
            isCorrect: isCorrect,
            timeSpent: timeSpent
        });

        // Show feedback
        this.showAnswerFeedback(isCorrect, question);
    }

    showAnswerFeedback(isCorrect, question) {
        const studyArea = document.getElementById('study-area');
        studyArea.innerHTML = `
            <div class="flex flex-col items-center p-6">
                <div class="text-center mb-8">
                    <div class="text-6xl mb-4">${isCorrect ? '✅' : '❌'}</div>
                    <div class="text-2xl font-bold mb-2">
                        ${isCorrect ? 'Correct !' : 'Incorrect'}
                    </div>
                    <div class="text-gray-600">
                        "${question.question}" signifie "${question.correctAnswer}"
                    </div>
                    ${!isCorrect ? `
                        <div class="text-red-600 mt-2">
                            Votre réponse : "${question.selectedAnswer}"
                        </div>
                    ` : ''}
                </div>

                <div class="text-center mb-8">
                    <div class="text-sm text-gray-500 mb-2">Exemple d'utilisation :</div>
                    <div class="text-gray-700">${question.card.usage}</div>
                </div>

                <button onclick="window.quiz.nextQuestion()"
                        class="btn-primary">
                    ${this.currentQuestionIndex === 9 ? 'Voir les résultats' : 'Question suivante'}
                </button>
            </div>
        `;
    }

    nextQuestion() {
        if (this.currentQuestionIndex === 9) {
            this.showQuizResults();
            return;
        }

        this.currentQuestionIndex++;
        this.showCurrentQuestion();
    }

    showQuizResults() {
        this.quizStats.endTime = new Date();
        const duration = Math.round((this.quizStats.endTime - this.quizStats.startTime) / 1000);
        const accuracy = Math.round((this.score / 10) * 100);
        const avgTimePerQuestion = Math.round(this.quizStats.timePerQuestion.reduce((a, b) => a + b, 0) / 10 / 1000);

        const studyArea = document.getElementById('study-area');
        studyArea.innerHTML = `
            <div class="flex flex-col items-center p-6">
                <h2 class="text-2xl font-bold mb-8">Résultats du Quiz</h2>

                <!-- Stats Overview -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 w-full">
                    <div class="stat-card">
                        <div class="text-gray-600">Score</div>
                        <div class="text-2xl font-bold">${this.score}/10</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-gray-600">Précision</div>
                        <div class="text-2xl font-bold">${accuracy}%</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-gray-600">Temps total</div>
                        <div class="text-2xl font-bold">${duration}s</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-gray-600">Temps/Question</div>
                        <div class="text-2xl font-bold">${avgTimePerQuestion}s</div>
                    </div>
                </div>

                <!-- Detailed Review -->
                <div class="w-full max-w-2xl mb-8">
                    <h3 class="text-lg font-semibold mb-4">Révision détaillée</h3>
                    ${this.answers.map((answer, index) => `
                        <div class="mb-4 p-4 ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'} rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="font-medium">${index + 1}. ${answer.question}</div>
                                    <div class="text-gray-600">Réponse correcte : ${answer.correctAnswer}</div>
                                    ${!answer.isCorrect ? `
                                        <div class="text-red-600">Votre réponse : ${answer.selectedAnswer}</div>
                                    ` : ''}
                                </div>
                                <div class="text-sm text-gray-500">
                                    ${Math.round(answer.timeSpent / 1000)}s
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Actions -->
                <div class="flex gap-4">
                    <button onclick="window.quiz.startNewQuiz()"
                            class="btn-primary">
                        Nouveau Quiz
                    </button>
                    <button onclick="window.quiz.reviewMistakes()"
                            class="btn-secondary">
                        Revoir les erreurs
                    </button>
                </div>
            </div>
        `;
    }

    reviewMistakes() {
        const mistakes = this.answers.filter(answer => !answer.isCorrect);
        if (mistakes.length === 0) {
            alert('Aucune erreur à revoir ! Excellent travail !');
            return;
        }

        // Create new quiz with only mistaken questions
        this.questions = mistakes.map(mistake => {
            const card = this.questions.find(q => q.question === mistake.question).card;
            return {
                ...card,
                timeStarted: null
            };
        });

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.quizStats = {
            startTime: new Date(),
            endTime: null,
            correctAnswers: 0,
            wrongAnswers: 0,
            timePerQuestion: []
        };

        this.showCurrentQuestion();
    }

    startNewQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.init();
    }

    // Utility functions
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    async getFilteredCards(category, difficulty) {
        // This would normally fetch from your data source
        return []; // To be implemented with actual data
    }
}

// Initialize and export
const quiz = new QuizModule();
window.quiz = quiz;
export default quiz;
