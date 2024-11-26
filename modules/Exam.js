// Import core utilities
import { appState, config } from '../core/init.js';

class ExamModule {
    constructor() {
        this.examTypes = {
            synthesis: {
                name: "Synthèse de documents",
                duration: 180, // 3 heures
                instructions: "Rédigez une synthèse des documents proposés en 500-600 mots."
            },
            essay: {
                name: "Expression écrite",
                duration: 120, // 2 heures
                instructions: "Rédigez un essai argumenté en réponse au sujet proposé."
            }
        };
        
        this.currentExam = null;
        this.timer = null;
        this.timeLeft = 0;
    }

    async init() {
        this.showExamMenu();
    }

    showExamMenu() {
        const studyArea = document.getElementById('study-area');
        studyArea.innerHTML = `
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-6">Préparation aux épreuves</h2>
                
                <!-- Mode Synthèse -->
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <div class="exam-type-card" onclick="window.exam.startExam('synthesis')">
                        <div class="text-xl font-bold mb-2">Synthèse de documents</div>
                        <div class="text-gray-600 mb-4">
                            Entraînez-vous à la synthèse avec des sujets types concours
                        </div>
                        <ul class="text-sm text-gray-500 space-y-2">
                            <li>• 3-4 documents en anglais</li>
                            <li>• Durée : 3 heures</li>
                            <li>• Objectif : 500-600 mots</li>
                        </ul>
                        <div class="mt-4 text-blue-600">Commencer →</div>
                    </div>

                    <!-- Mode Essay -->
                    <div class="exam-type-card" onclick="window.exam.startExam('essay')">
                        <div class="text-xl font-bold mb-2">Expression écrite</div>
                        <div class="text-gray-600 mb-4">
                            Pratiquez la rédaction d'essais argumentés
                        </div>
                        <ul class="text-sm text-gray-500 space-y-2">
                            <li>• Sujets d'actualité</li>
                            <li>• Durée : 2 heures</li>
                            <li>• Structure argumentative</li>
                        </ul>
                        <div class="mt-4 text-blue-600">Commencer →</div>
                    </div>
                </div>

                <!-- Derniers résultats -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Vos derniers entraînements</h3>
                    <div id="exam-history">
                        ${this.getExamHistory()}
                    </div>
                </div>
            </div>
        `;
    }

    async startExam(type) {
        const examType = this.examTypes[type];
        this.currentExam = {
            type: type,
            startTime: new Date(),
            timeLeft: examType.duration * 60, // en secondes
            content: await this.generateExamContent(type)
        };

        this.showExam();
        this.startTimer();
    }

    async generateExamContent(type) {
        // Cette fonction serait connectée à une base de données de sujets
        if (type === 'synthesis') {
            return {
                documents: [
                    {
                        title: "The Impact of AI on Modern Society",
                        source: "The Economist, 2023",
                        content: `[Premier paragraphe du document...]
                                [Second paragraphe du document...]
                                [...]`
                    },
                    {
                        title: "Ethics in Artificial Intelligence",
                        source: "MIT Technology Review, 2023",
                        content: `[Contenu du deuxième document...]`
                    },
                    {
                        title: "AI Regulation Challenges",
                        source: "Financial Times, 2023",
                        content: `[Contenu du troisième document...]`
                    }
                ],
                instructions: "Synthesize these documents focusing on the main challenges and opportunities of AI integration in society."
            };
        } else {
            return {
                title: "Technology and Human Relations",
                question: "To what extent has modern technology improved or damaged human relationships? Discuss with reference to specific examples.",
                hints: [
                    "Consider both positive and negative impacts",
                    "Include concrete examples",
                    "Discuss both personal and professional relationships",
                    "Consider different age groups and contexts"
                ]
            };
        }
    }

    showExam() {
        const studyArea = document.getElementById('study-area');
        studyArea.innerHTML = `
            <div class="h-full flex flex-col">
                <!-- Header avec timer et contrôles -->
                <div class="flex justify-between items-center p-4 bg-gray-50 border-b">
                    <div class="flex items-center gap-4">
                        <button onclick="window.exam.confirmQuit()" 
                                class="text-gray-600 hover:text-gray-800">
                            ← Quitter
                        </button>
                        <span class="font-medium">${this.examTypes[this.currentExam.type].name}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div id="exam-timer" class="font-mono text-lg"></div>
                        <button onclick="window.exam.toggleTimer()"
                                class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
                            ⏸
                        </button>
                    </div>
                </div>

                <!-- Contenu de l'examen -->
                <div class="flex-1 overflow-hidden flex">
                    <!-- Documents/Instructions (gauche) -->
                    <div class="w-1/2 overflow-y-auto p-6 border-r">
                        ${this.currentExam.type === 'synthesis' ? 
                            this.renderSynthesisDocuments() : 
                            this.renderEssayInstructions()}
                    </div>

                    <!-- Zone de rédaction (droite) -->
                    <div class="w-1/2 flex flex-col p-6">
                        <div class="flex justify-between items-center mb-4">
                            <div class="text-sm text-gray-600">
                                Mots : <span id="word-count">0</span>
                            </div>
                            <button onclick="window.exam.saveProgress()"
                                    class="text-blue-600 hover:text-blue-700">
                                Sauvegarder
                            </button>
                        </div>
                        <textarea id="exam-answer"
                                  class="flex-1 w-full p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  oninput="window.exam.updateWordCount(this)"
                                  placeholder="Rédigez votre réponse ici..."></textarea>
                    </div>
                </div>

                <!-- Footer avec outils -->
                <div class="border-t p-4">
                    <div class="flex justify-between items-center">
                        <div class="flex gap-4">
                            <button onclick="window.exam.toggleStructureHelper()"
                                    class="text-sm text-blue-600 hover:text-blue-700">
                                Structure suggérée
                            </button>
                            <button onclick="window.exam.toggleVocabHelper()"
                                    class="text-sm text-blue-600 hover:text-blue-700">
                                Expressions utiles
                            </button>
                        </div>
                        <button onclick="window.exam.submitExam()"
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Terminer
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Initialize timer display
        this.updateTimerDisplay();
    }

    renderSynthesisDocuments() {
        return `
            <div class="space-y-8">
                <div class="text-sm text-gray-500 mb-4">
                    ${this.examTypes.synthesis.instructions}
                </div>
                ${this.currentExam.content.documents.map((doc, index) => `
                    <div class="document-card">
                        <div class="font-bold mb-2">Document ${index + 1}: ${doc.title}</div>
                        <div class="text-sm text-gray-500 mb-4">${doc.source}</div>
                        <div class="prose">${doc.content}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEssayInstructions() {
        return `
            <div class="space-y-6">
                <div class="text-xl font-bold">${this.currentExam.content.title}</div>
                <div class="text-gray-800">${this.currentExam.content.question}</div>
                <div class="bg-blue-50 p-4 rounded">
                    <div class="font-medium mb-2">Points à considérer :</div>
                    <ul class="space-y-2">
                        ${this.currentExam.content.hints.map(hint => `
                            <li>• ${hint}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.currentExam.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.currentExam.timeLeft <= 0) {
                this.endExam(true);
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const hours = Math.floor(this.currentExam.timeLeft / 3600);
        const minutes = Math.floor((this.currentExam.timeLeft % 3600) / 60);
        const seconds = this.currentExam.timeLeft % 60;
        
        const display = document.getElementById('exam-timer');
        if (display) {
            display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Visual warning when time is running out
            if (this.currentExam.timeLeft < 300) { // Less than 5 minutes
                display.classList.add('text-red-600', 'animate-pulse');
            }
        }
    }

    toggleTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        } else {
            this.startTimer();
        }
    }

    updateWordCount(textarea) {
        const words = textarea.value.trim().split(/\s+/).length;
        document.getElementById('word-count').textContent = words;
    }

    saveProgress() {
        const answer = document.getElementById('exam-answer').value;
        localStorage.setItem(`exam-${this.currentExam.type}-draft`, answer);
        // Show save confirmation
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
        notification.textContent = 'Progrès sauvegardé !';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    async submitExam() {
        if (!confirm('Êtes-vous sûr de vouloir terminer l'examen ?')) return;
        
        await this.endExam(false);
    }

    async endExam(timeUp = false) {
        clearInterval(this.timer);
        const answer = document.getElementById('exam-answer').value;
        const wordCount = answer.trim().split(/\s+/).length;
        
        // Save exam result
        const result = {
            type: this.currentExam.type,
            date: new Date(),
            duration: this.examTypes[this.currentExam.type].duration * 60 - this.currentExam.timeLeft,
            wordCount: wordCount,
            timeUp: timeUp
        };

        // Save to history
        let history = JSON.parse(localStorage.getItem('exam-history') || '[]');
        history.unshift(result);
        localStorage.setItem('exam-history', JSON.stringify(history));

        this.showExamComplete(result);
    }

    showExamComplete(result) {
        const studyArea = document.getElementById('study-area');
        studyArea.innerHTML = `
            <div class="p-6 text-center">
                <h2 class="text-2xl font-bold mb-6">
                    ${result.timeUp ? '⏰ Temps écoulé !' : '🎉 Examen terminé !'}
                </h2>
                
                <div class="grid grid-cols-3 gap-6 mb-8">
                    <div class="stat-card">
                        <div class="text-gray-600">Durée</div>
                        <div class="text-2xl font-bold">
                            ${Math.floor(result.duration / 60)}m ${result.duration % 60}s
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="text-gray-600">Mots</div>
                        <div class="text-2xl font-bold">${result.wordCount}</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-gray-600">Type</div>
                        <div class="text-2xl font-bold">${this.examTypes[result.type].name}</div>
                    </div>
                </div>

                <div class="flex justify-center gap-4">
                    <button onclick="window.exam.startNewExam()"
                            class="btn-primary">
                        Nouvel examen
                    </button>
                    <button onclick="window.exam.reviewExam()"
                            class="btn-secondary">
                        Revoir la copie
                    </button>
                </div>
            </div>
        `;
    }

    confirmQuit() {
        if (confirm('Êtes-vous sûr de vouloir quitter ? Votre progression sera perdue.')) {
            clearInterval(this.timer);
            this.showExamMenu();
        }
    }

    getExamHistory() {
        const history = JSON.parse(localStorage.getItem('exam-history') || '[]');
        if (history.length === 0) {
            return `<div class="text-gray-500 text-center">Aucun entraînement effectué</div>`;
        }

        return history
            .slice(0, 5)
            .map(exam => `
