// Application Configuration
const CONFIG = {
    // Core settings
    examDate: new Date('2024-04-28'),
    dailyGoalBase: 50,
    streakThreshold: 50,
    
    // Study settings
    reviewIntervals: {
        easy: 7,
        medium: 3,
        hard: 1
    },
    
    // Achievement levels
    levels: {
        beginner: { threshold: 0, name: "Débutant" },
        intermediate: { threshold: 100, name: "Intermédiaire" },
        advanced: { threshold: 300, name: "Avancé" },
        expert: { threshold: 500, name: "Expert" }
    },
    
    // Performance tracking
    performance: {
        minAccuracy: 0.7,
        targetStreak: 7,
        bonusThresholds: {
            accuracy: 0.9,
            streak: 14
        }
    }
};

// Application State Management
class AppState {
    constructor() {
        this.currentMode = 'flashcards';
        this.userProgress = {
            totalCards: 0,
            masteredCards: 0,
            currentStreak: 0,
            bestStreak: 0,
            dailyGoal: CONFIG.dailyGoalBase,
            todayProgress: 0,
            lastStudyDate: null,
            weeklyProgress: new Array(7).fill(0)
        };
        this.studySession = {
            startTime: null,
            cardsStudied: 0,
            correctAnswers: 0
        };
        this.filters = {
            category: 'all',
            difficulty: 'all'
        };
    }

    // Progress tracking
    updateProgress(correct) {
        this.userProgress.totalCards++;
        this.userProgress.todayProgress++;
        if (correct) {
            this.userProgress.currentStreak++;
            this.studySession.correctAnswers++;
            if (this.userProgress.currentStreak > this.userProgress.bestStreak) {
                this.userProgress.bestStreak = this.userProgress.currentStreak;
            }
        } else {
            this.userProgress.currentStreak = 0;
        }
        this.studySession.cardsStudied++;
        this.saveState();
        this.updateUI();
    }

    // Daily tracking
    checkDailyReset() {
        const today = new Date().toDateString();
        if (this.userProgress.lastStudyDate !== today) {
            this.userProgress.todayProgress = 0;
            this.userProgress.lastStudyDate = today;
            this.studySession = {
                startTime: new Date(),
                cardsStudied: 0,
                correctAnswers: 0
            };
        }
    }

    // State persistence
    saveState() {
        localStorage.setItem('mp-english-state', JSON.stringify({
            userProgress: this.userProgress,
            filters: this.filters
        }));
    }

    loadState() {
        const saved = localStorage.getItem('mp-english-state');
        if (saved) {
            const data = JSON.parse(saved);
            this.userProgress = {...this.userProgress, ...data.userProgress};
            this.filters = {...this.filters, ...data.filters};
        }
    }

    // UI Updates
    updateUI() {
        // Update countdown
        const countdownDisplay = document.getElementById('countdown-display');
        const daysLeft = Math.ceil((CONFIG.examDate - new Date()) / (1000 * 60 * 60 * 24));
        countdownDisplay.querySelector('.countdown-value').textContent = `${daysLeft} jours`;

        // Update progress
        document.getElementById('current-progress').textContent = this.userProgress.todayProgress;
        document.getElementById('daily-progress').style.width = 
            `${(this.userProgress.todayProgress / this.userProgress.dailyGoal) * 100}%`;

        // Update stats
        document.getElementById('streak-display').textContent = this.userProgress.currentStreak;
        document.getElementById('best-streak').textContent = this.userProgress.bestStreak;
        document.getElementById('mastered-display').textContent = 
            `${this.userProgress.masteredCards}/${this.userProgress.totalCards}`;

        // Update accuracy
        const accuracy = this.studySession.cardsStudied > 0 
            ? (this.studySession.correctAnswers / this.studySession.cardsStudied * 100).toFixed(1)
            : 0;
        document.getElementById('accuracy-display').textContent = `${accuracy}%`;

        // Update calendar
        this.updateCalendar();
    }

    updateCalendar() {
        const weeklyTracker = document.getElementById('weekly-tracker');
        const today = new Date().getDay();
        
        weeklyTracker.querySelectorAll('.day-circle').forEach((circle, index) => {
            circle.classList.remove('completed', 'current', 'future');
            if (index < today) {
                circle.classList.add(this.userProgress.weeklyProgress[index] >= CONFIG.streakThreshold ? 'completed' : 'future');
            } else if (index === today) {
                circle.classList.add('current');
            } else {
                circle.classList.add('future');
            }
        });
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    window.appState = new AppState();
    window.appState.loadState();
    window.appState.checkDailyReset();
    window.appState.updateUI();

    // Mode switching
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const mode = e.currentTarget.dataset.mode;
            document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
            window.appState.currentMode = mode;
            // Mode specific initialization will be handled by respective modules
            import(`../modules/${mode}.js`).then(module => {
                module.default.init();
            });
        });
    });

    // Filter handling
    document.querySelectorAll('select[id$="-filter"]').forEach(select => {
        select.addEventListener('change', (e) => {
            const filterType = e.target.id.split('-')[0];
            window.appState.filters[filterType] = e.target.value;
            window.appState.saveState();
            // Trigger re-render of current mode
            const currentModule = window.appState.currentMode;
            import(`../modules/${currentModule}.js`).then(module => {
                module.default.refresh();
            });
        });
    });
});

// Export for module usage
export const appState = window.appState;
export const config = CONFIG;
