// Import core utilities
import { appState, config } from '../core/init.js';

class PhrasesModule {
    constructor() {
        // Structures de phrases pour différents contextes
        this.phraseStructures = {
            introduction: [
                {
                    title: "Présenter le sujet",
                    templates: [
                        "The question of {topic} has become increasingly significant in {context}",
                        "In recent years, {topic} has emerged as a crucial issue in {context}",
                        "The relationship between {topic} and {context} raises important questions"
                    ],
                    examples: [
                        {
                            topic: "artificial intelligence",
                            context: "modern society",
                            full: "The question of artificial intelligence has become increasingly significant in modern society."
                        }
                    ]
                },
                {
                    title: "Annoncer la problématique",
                    templates: [
                        "This raises the question of whether {statement}",
                        "It is worth examining to what extent {statement}",
                        "One may wonder how {statement}"
                    ]
                }
            ],
            development: [
                {
                    title: "Premier argument",
                    templates: [
                        "First and foremost, {argument}",
                        "The primary consideration is that {argument}",
                        "One of the main arguments in favor of this view is that {argument}"
                    ]
                },
                {
                    title: "Argument suivant",
                    templates: [
                        "Furthermore, it should be noted that {argument}",
                        "Moreover, another crucial aspect is {argument}",
                        "In addition to this, {argument}"
                    ]
                },
                {
                    title: "Contraste",
                    templates: [
                        "However, one must also consider that {argument}",
                        "On the other hand, {argument}",
                        "Nevertheless, it is important to recognize that {argument}"
                    ]
                }
            ],
            conclusion: [
                {
                    title: "Synthèse",
                    templates: [
                        "In light of the above arguments, it appears that {conclusion}",
                        "Taking all these factors into consideration, one can conclude that {conclusion}",
                        "Based on the evidence presented, it is clear that {conclusion}"
                    ]
                },
                {
                    title: "Ouverture",
                    templates: [
                        "This leads us to question whether {future_consideration}",
                        "Looking ahead, one might wonder if {future_consideration}",
                        "The future development of {topic} will likely determine {future_consideration}"
                    ]
                }
            ]
        };

        // Expressions académiques par fonction
        this.academicPhrases = {
            comparing: [
                "Similarly,", "In contrast,", "Whereas", "While", "Unlike",
                "On the other hand,", "Conversely,", "By comparison,"
            ],
            emphasizing: [
                "Indeed,", "Notably,", "Particularly,", "Especially,", 
                "It should be emphasized that", "Significantly,"
            ],
            exemplifying: [
                "For instance,", "For example,", "To illustrate this,",
                "A case in point is", "This can be demonstrated by"
            ],
            concluding: [
                "Therefore,", "Consequently,", "As a result,",
                "Thus,", "Hence,", "It follows that"
            ],
            causeEffect: [
                "Because of this,", "This leads to",
                "The reason for this is", "This results in",
                "Due to", "Owing to"
            ]
        };
    }

    init() {
        this.showMainInterface();
    }

    showMainInterface() {
        const studyArea = document.getElementById('study-area');
        studyArea.innerHTML = `
            <div class="flex h-full">
                <!-- Panneau de gauche: Structure et expressions -->
                <div class="w-1/3 border-r p-4 overflow-y-auto">
                    <h2 class="text-lg font-bold mb-4">Construction de phrases</h2>
                    
                    <!-- Navigation -->
                    <div class="flex gap-2 mb-4">
                        <button onclick="window.phrases.showStructures()" 
                                class="px-3 py-1 rounded bg-blue-500 text-white">
                            Structures
                        </button>
                        <button onclick="window.phrases.showExpressions()"
                                class="px-3 py-1 rounded bg-gray-200">
                            Expressions
                        </button>
                    </div>

                    <!-- Zone de contenu dynamique -->
                    <div id="phrase-content" class="space-y-4">
                        ${this.renderStructures()}
                    </div>
                </div>

                <!-- Panneau de droite: Zone de travail -->
                <div class="w-2/3 p-4 flex flex-col">
                    <!-- Zone de composition -->
                    <div class="flex-1 mb-4">
                        <textarea id="composition-area"
                                class="w-full h-full p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Composez votre texte ici..."></textarea>
                    </div>

                    <!-- Barre d'outils -->
                    <div class="flex justify-between items-center bg-gray-50 p-4 rounded">
                        <div>
                            <span class="text-sm text-gray-600">
                                Mots: <span id="word-count">0</span>
                            </span>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.phrases.saveWork()"
                                    class="px-3 py-1 rounded bg-blue-500 text-white">
                                Sauvegarder
                            </button>
                            <button onclick="window.phrases.clearWork()"
                                    class="px-3 py-1 rounded bg-gray-200">
                                Effacer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    renderStructures() {
        return Object.entries(this.phraseStructures).map(([section, structures]) => `
            <div class="mb-6">
                <h3 class="font-semibold mb-2 capitalize">${section}</h3>
                ${structures.map(struct => `
                    <div class="mb-4">
                        <div class="text-sm font-medium mb-2">${struct.title}</div>
                        <div class="space-y-2">
                            ${struct.templates.map(template => `
                                <div class="phrase-template cursor-pointer p-2 rounded hover:bg-blue-50"
                                     onclick="window.phrases.insertPhrase('${template.replace(/'/g, "\\'")}')">
                                    ${template}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    renderExpressions() {
        return Object.entries(this.academicPhrases).map(([category, phrases]) => `
            <div class="mb-6">
                <h3 class="font-semibold mb-2 capitalize">${category}</h3>
                <div class="grid grid-cols-2 gap-2">
                    ${phrases.map(phrase => `
                        <div class="phrase-template cursor-pointer p-2 rounded hover:bg-blue-50"
                             onclick="window.phrases.insertPhrase('${phrase}')">
                            ${phrase}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    showStructures() {
        document.getElementById('phrase-content').innerHTML = this.renderStructures();
        // Update active button states
        const buttons = document.querySelectorAll('#phrase-content + button');
        buttons[0].classList.add('bg-blue-500', 'text-white');
        buttons[1].classList.remove('bg-blue-500', 'text-white');
    }

    showExpressions() {
        document.getElementById('phrase-content').innerHTML = this.renderExpressions();
        // Update active button states
        const buttons = document.querySelectorAll('#phrase-content + button');
        buttons[1].classList.add('bg-blue-500', 'text-white');
        buttons[0].classList.remove('bg-blue-500', 'text-white');
    }

    insertPhrase(template) {
        const textarea = document.getElementById('composition-area');
        const position = textarea.selectionStart;
        const currentContent = textarea.value;
        
        // Insert with proper spacing
        const beforeCursor = currentContent.substring(0, position);
        const afterCursor = currentContent.substring(position);
        const needsSpaceBefore = position > 0 && !beforeCursor.endsWith(' ');
        const needsSpaceAfter = afterCursor.length > 0 && !afterCursor.startsWith(' ');

        const insertContent = `${needsSpaceBefore ? ' ' : ''}${template}${needsSpaceAfter ? ' ' : ''}`;
        
        textarea.value = beforeCursor + insertContent + afterCursor;
        
        // Update word count
        this.updateWordCount();
        
        // Set focus back to textarea
        textarea.focus();
    }

    updateWordCount() {
        const textarea = document.getElementById('composition-area');
        const wordCount = textarea.value.trim().split(/\s+/).length;
        document.getElementById('word-count').textContent = wordCount;
    }

    saveWork() {
        const content = document.getElementById('composition-area').value;
        localStorage.setItem('phrases-draft', content);
        
        // Show save confirmation
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
        notification.textContent = 'Travail sauvegardé !';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    clearWork() {
        if (confirm('Êtes-vous sûr de vouloir effacer tout le contenu ?')) {
            document.getElementById('composition-area').value = '';
            this.updateWordCount();
        }
    }

    setupEventListeners() {
        // Word count update
        document.getElementById('composition-area').addEventListener('input', () => {
            this.updateWordCount();
        });

        // Load saved content if any
        const savedContent = localStorage.getItem('phrases-draft');
        if (savedContent) {
            document.getElementById('composition-area').value = savedContent;
            this.updateWordCount();
        }
    }
}

// Initialize and export
const phrases = new PhrasesModule();
window.phrases = phrases;
export default phrases;
