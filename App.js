// Base de données du vocabulaire
const vocabularyData = [
    { id: 1, english: "nevertheless", french: "néanmoins", category: "Transition", usage: "Nevertheless, this argument overlooks crucial factors" },
    { id: 2, english: "whereas", french: "tandis que", category: "Transition", usage: "Whereas previous studies focused on X, this paper examines Y" },
    { id: 3, english: "to shed light on", french: "éclairer/mettre en lumière", category: "Analysis", usage: "This study sheds light on the environmental impact" },
    { id: 4, english: "to draw a parallel", french: "établir un parallèle", category: "Comparison", usage: "We can draw a parallel between these two phenomena" },
    { id: 5, english: "in conclusion", french: "en conclusion", category: "Essay Structure", usage: "In conclusion, the evidence suggests that..." }
];

// État de l'application
let currentCardIndex = 0;
let showingAnswer = false;

// Fonctions principales
function showCard(index) {
    const card = vocabularyData[index];
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="text-center p-6">
            <div class="text-2xl font-bold mb-4">${card.english}</div>
            <div id="answer" class="${showingAnswer ? '' : 'hidden'}">
                <div class="text-xl text-blue-600 mb-2">${card.french}</div>
                <div class="text-gray-600 mb-4">${card.usage}</div>
            </div>
            <button onclick="toggleAnswer()" class="bg-blue-500 text-white px-6 py-2 rounded-lg mb-4">
                ${showingAnswer ? 'Cacher' : 'Voir la réponse'}
            </button>
            <div class="flex justify-center gap-4 mt-4">
                <button onclick="previousCard()" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Précédent</button>
                <button onclick="nextCard()" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Suivant</button>
            </div>
        </div>
    `;
}

function toggleAnswer() {
    showingAnswer = !showingAnswer;
    showCard(currentCardIndex);
}

function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % vocabularyData.length;
    showingAnswer = false;
    showCard(currentCardIndex);
}

function previousCard() {
    currentCardIndex = (currentCardIndex - 1 + vocabularyData.length) % vocabularyData.length;
    showingAnswer = false;
    showCard(currentCardIndex);
}

function startQuiz() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="text-center p-6">
            <h2 class="text-xl font-bold mb-4">Mode Quiz</h2>
            <p>Quiz en cours de développement...</p>
        </div>
    `;
}

function showExamPrep() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="text-center p-6">
            <h2 class="text-xl font-bold mb-4">Préparation aux épreuves</h2>
            <p>Section en cours de développement...</p>
        </div>
    `;
}

function showPhraseBuilder() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="text-center p-6">
            <h2 class="text-xl font-bold mb-4">Construction de phrases</h2>
            <p>Outil en cours de développement...</p>
        </div>
    `;
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Gestionnaires d'événements pour les boutons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            switch(mode) {
                case 'flashcards':
                    showCard(currentCardIndex);
                    break;
                case 'quiz':
                    startQuiz();
                    break;
                case 'exam':
                    showExamPrep();
                    break;
                case 'builder':
                    showPhraseBuilder();
                    break;
            }
        });
    });

    // Afficher la première carte au chargement
    showCard(currentCardIndex);
});
```

