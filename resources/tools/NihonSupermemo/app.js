        console.log('Script starting...');
        
        // Global variables
        let app;
        let currentLanguage = 'en';
        
        // Translations
        const translations = {
            en: {
                menu: {
                    language: '🌍 Language',
                    export: '💾 Export Data',
                    import: '📁 Import Data',
                    reset: '🔄 Reset All',
                    modeTitle: '📚 Mode',
                    modeMixed: 'Mixed',
                    modeHiragana: 'Hiragana',
                    modeKatakana: 'Katakana',
                    modeKanji: 'Kanji',
                    statsTitle: '📈 Stats'
                },
                stats: {
                    seen: 'Seen',
                    mastered: 'Mastered',
                    learning: 'Learning',
                    struggling: 'Struggling',
                    streak: 'Streak'
                },
                welcome: {
                    title: 'Welcome! 👋',
                    text1: 'Open the menu to select a learning mode.',
                    text2: 'The app uses spaced repetition for optimal retention.',
                    start: 'Start Learning'
                },
                progress: {
                    title: 'Progress',
                    mastered: 'Mastered',
                    learning: 'Learning',
                    struggling: 'Struggling',
                    unseen: 'Not Seen'
                },
                question: {
                    whatReading: 'What is the reading of this',
                    whichRepresents: 'Which',
                    represents: 'represents',
                    kanjiMeaning: 'What does this kanji mean?',
                    whichKanjiMeans: 'Which kanji means this?',
                    howReadKanji: 'How do you read this kanji?',
                    whichKanjiReading: 'Which kanji has this reading?',
                    whatReadingMeans: 'What does this reading mean?',
                    whatIsReading: 'What is the reading for this meaning?'
                },
                feedback: {
                    correct: 'Correct! Well done!',
                    incorrect: 'Incorrect. The answer was',
                    next: 'Next'
                },
                complete: {
                    title: '🎉 All reviewed!',
                    text1: 'Great job! You\'ve reviewed all available items.',
                    text2: 'Items will become available based on the spaced repetition schedule.',
                    check: 'Check Again'
                },
                alerts: {
                    exportSuccess: 'Data exported successfully!',
                    importSuccess: 'Data imported successfully!',
                    importError: 'Error importing file',
                    invalidFormat: 'Invalid file format',
                    resetConfirm: 'Are you sure you want to reset all progress? This cannot be undone!'
                }
            },
            fr: {
                menu: {
                    progress: '📊 Progrès détaillé',
                    language: '🌍 Langue',
                    export: '💾 Exporter',
                    import: '📁 Importer',
                    reset: '🔄 Réinitialiser',
                    modeTitle: '📚 Mode',
                    modeMixed: 'Mixte',
                    modeHiragana: 'Hiragana',
                    modeKatakana: 'Katakana',
                    modeKanji: 'Kanji',
                    statsTitle: '📈 Statistiques'
                },
                stats: {
                    seen: 'Vus',
                    mastered: 'Maîtrisés',
                    learning: 'En cours',
                    struggling: 'Difficiles',
                    streak: 'Série'
                },
                welcome: {
                    title: 'Bienvenue! 👋',
                    text1: 'Ouvrez le menu pour sélectionner un mode d\'apprentissage.',
                    text2: 'L\'application utilise la répétition espacée pour une rétention optimale.',
                    start: 'Commencer'
                },
                progress: {
                    title: 'Progrès',
                    mastered: 'Maîtrisé',
                    learning: 'En cours',
                    struggling: 'Difficile',
                    unseen: 'Non vu'
                },
                question: {
                    whatReading: 'Quelle est la lecture de ce',
                    whichRepresents: 'Quel',
                    represents: 'représente',
                    kanjiMeaning: 'Que signifie ce kanji?',
                    whichKanjiMeans: 'Quel kanji signifie ceci?',
                    howReadKanji: 'Comment lisez-vous ce kanji?',
                    whichKanjiReading: 'Quel kanji a cette lecture?',
                    whatReadingMeans: 'Que signifie cette lecture?',
                    whatIsReading: 'Quelle est la lecture pour cette signification?'
                },
                feedback: {
                    correct: 'Correct! Bien joué!',
                    incorrect: 'Incorrect. La réponse était',
                    next: 'Suivant'
                },
                complete: {
                    title: '🎉 Tout révisé!',
                    text1: 'Excellent! Vous avez révisé tous les éléments disponibles.',
                    text2: 'Les éléments deviendront disponibles selon le calendrier de répétition espacée.',
                    check: 'Vérifier à nouveau'
                },
                alerts: {
                    exportSuccess: 'Données exportées avec succès!',
                    importSuccess: 'Données importées avec succès!',
                    importError: 'Erreur lors de l\'importation',
                    invalidFormat: 'Format de fichier invalide',
                    resetConfirm: 'Êtes-vous sûr de vouloir réinitialiser tous les progrès? Cette action est irréversible!'
                }
            }
        };

        // Data structures - just a sample for testing
        // Data is now loaded from external data.js file

        // SuperMemo 2 Algorithm
        class SM2 {
            constructor() {
                this.defaultEasiness = 2.5;
                this.minEasiness = 1.3;
            }

            calculate(quality, repetitions, easiness, interval) {
                if (quality < 3) {
                    repetitions = 0;
                    interval = 1;
                } else {
                    if (repetitions === 0) {
                        interval = 1;
                    } else if (repetitions === 1) {
                        interval = 6;
                    } else {
                        interval = Math.round(interval * easiness);
                    }
                    repetitions += 1;
                }

                easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
                if (easiness < this.minEasiness) {
                    easiness = this.minEasiness;
                }

                return { repetitions, easiness, interval };
            }
        }

        // Main App Class
        class JapaneseSRSApp {
            constructor() {
                console.log('Creating JapaneseSRSApp instance');
                this.sm2 = new SM2();
                this.currentMode = 'mixed';
                this.currentItem = null;
                this.currentChoices = [];
                this.currentStreak = 0;
                this.isAnswered = false;
                console.log('About to call loadData()');
                this.loadData();
                console.log('loadData() completed');
                this.bindEvents();
                this.updateStats();
                this.updateUILanguage();
                // Update mode indicators after loading saved mode
                if (typeof updateModeIndicators === 'function') {
                    updateModeIndicators(this.currentMode);
                }
                
                // Auto-start learning if user has data (has used the app before)
                if (this.data && this.data.totalReviews > 0) {
                    console.log('Auto-starting learning with saved mode:', this.currentMode);
                    this.startLearning();
                }
            }

            loadData() {
                const saved = localStorage.getItem('japaneseSRSData');
                console.log('loadData: saved data exists:', !!saved);
                if (saved) {
                    try {
                        this.data = JSON.parse(saved);
                        console.log('loadData: parsed data settings:', this.data.settings);
                        if (this.data.settings && this.data.settings.language) {
                            currentLanguage = this.data.settings.language;
                        }
                        if (this.data.settings && this.data.settings.mode) {
                            this.currentMode = this.data.settings.mode;
                            console.log('Restored mode from localStorage:', this.currentMode);
                        } else {
                            console.log('loadData: no mode found in settings');
                        }
                        // Check for old kanji format and reinitialize if found
                        let needsReset = false;
                        Object.entries(this.data.items).forEach(([id, item]) => {
                            if (item.type === 'kanji' && !item.meanings) {
                                needsReset = true;
                            }
                        });
                        if (needsReset) {
                            console.log('Old kanji format detected, reinitializing data...');
                            this.initializeData();
                        }
                    } catch (e) {
                        console.error('Error loading saved data:', e);
                        this.initializeData();
                    }
                } else {
                    this.initializeData();
                }
            }

            initializeData() {
                console.log('Initializing data...');
                this.data = {
                    items: {},
                    lastReview: new Date().toISOString(),
                    totalReviews: 0,
                    settings: {
                        mode: 'mixed',
                        language: currentLanguage
                    }
                };

                // Initialize all items
                Object.entries(katakana).forEach(([char, romaji]) => {
                    this.data.items[`kata_${char}`] = {
                        type: 'katakana',
                        character: char,
                        romaji: romaji,
                        repetitions: 0,
                        easiness: 2.5,
                        interval: 0,
                        nextReview: new Date().toISOString(),
                        lastReview: null,
                        consecutiveCorrect: 0,
                        consecutiveWrong: 0,
                        totalSeen: 0
                    };
                });

                Object.entries(hiragana).forEach(([char, romaji]) => {
                    this.data.items[`hira_${char}`] = {
                        type: 'hiragana',
                        character: char,
                        romaji: romaji,
                        repetitions: 0,
                        easiness: 2.5,
                        interval: 0,
                        nextReview: new Date().toISOString(),
                        lastReview: null,
                        consecutiveCorrect: 0,
                        consecutiveWrong: 0,
                        totalSeen: 0
                    };
                });

                Object.entries(kanjiData).forEach(([char, data]) => {
                    this.data.items[`kanji_${char}`] = {
                        type: 'kanji',
                        character: char,
                        meanings: data,  // keep EN, FR, romaji array
                        repetitions: 0,
                        easiness: 2.5,
                        interval: 0,
                        nextReview: new Date().toISOString(),
                        lastReview: null,
                        consecutiveCorrect: 0,
                        consecutiveWrong: 0,
                        totalSeen: 0
                    };
                });

                this.saveData();
            }

            saveData() {
                this.data.settings.language = currentLanguage;
                this.data.settings.mode = this.currentMode;
                console.log('Saving mode to localStorage:', this.currentMode);
                localStorage.setItem('japaneseSRSData', JSON.stringify(this.data));
            }

            updateUILanguage() {
                const t = translations[currentLanguage];
                
                // Helper function to safely update element text
                const updateElement = (id, text) => {
                    const element = document.getElementById(id);
                    if (element) element.textContent = text;
                };
                
                // Update menu items
                updateElement('menuLanguage', t.menu.language);
                updateElement('menuExport', t.menu.export);
                updateElement('menuImport', t.menu.import);
                updateElement('menuReset', t.menu.reset);
                
                // Update mode section
                updateElement('menuModeTitle', t.menu.modeTitle);
                updateElement('menuModeMixed', t.menu.modeMixed);
                updateElement('menuModeHiragana', t.menu.modeHiragana);
                updateElement('menuModeKatakana', t.menu.modeKatakana);
                updateElement('menuModeKanji', t.menu.modeKanji);
                
                // Update stats section
                updateElement('menuStatsTitle', t.menu.statsTitle);
                updateElement('menuStatSeen', t.stats.seen);
                updateElement('menuStatMastered', t.stats.mastered);
                updateElement('menuStatLearning', t.stats.learning);
                updateElement('menuStatStruggling', t.stats.struggling);
                updateElement('menuStatStreak', t.stats.streak);
                
                // Update welcome screen
                updateElement('welcomeTitle', t.welcome.title);
                updateElement('welcomeText1', t.welcome.text1);
                updateElement('welcomeText2', t.welcome.text2);
                updateElement('startBtn', t.welcome.start);
                                
                // Update language indicator
                updateElement('currentLang', currentLanguage.toUpperCase());
                
                // Update kanji meanings in data
                Object.entries(this.data.items).forEach(([id, item]) => {
                    if (item.type === 'kanji') {
                        const char = item.character;
                        if (kanjiData[char]) {
                            item.romaji = kanjiData[char][currentLanguage];
                        }
                    }
                });
            }

            bindEvents() {
                // Hamburger menu
                const hamburger = document.getElementById('hamburger');
                const dropdownMenu = document.getElementById('dropdownMenu');
                
                hamburger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    hamburger.classList.toggle('active');
                    dropdownMenu.classList.toggle('active');
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!hamburger.contains(e.target) && !dropdownMenu.contains(e.target)) {
                        hamburger.classList.remove('active');
                        dropdownMenu.classList.remove('active');
                    }
                });
            }

            updateStats() {
                let totalSeen = 0;
                let mastered = 0;
                let learning = 0;
                let struggling = 0;
                
                Object.values(this.data.items).forEach(item => {
                    if (item.totalSeen > 0) {
                        totalSeen++;
                        
                        if (item.interval >= 30) {
                            mastered++;
                        } else if (item.consecutiveWrong >= 2) {
                            struggling++;
                        } else if (item.totalSeen > 0) {
                            learning++;
                        }
                    }
                });
                
                // Update stats in menu
                document.getElementById('menuTotalSeen').textContent = totalSeen;
                document.getElementById('menuMasteredCount').textContent = mastered;
                document.getElementById('menuLearningCount').textContent = learning;
                document.getElementById('menuStrugglingCount').textContent = struggling;
                document.getElementById('menuStreakCount').textContent = this.currentStreak;
            }

            startLearning() {
                console.log('Starting learning...');
                this.generateQuestion();
            }

            generateQuestion() {
                console.log('Generating question...');
                const nextItem = this.getNextItem();
                if (!nextItem) {
                    this.showComplete();
                    return;
                }

                this.currentItem = nextItem;
                const { item } = nextItem;
                
                // Handle kanji items differently
                if (item.type === 'kanji') {
                    const submodes = ['kanjiToMeaning','meaningToKanji','kanjiToRomaji','romajiToKanji','romajiToMeaning','meaningToRomaji'];
                    const mode = submodes[Math.floor(Math.random() * submodes.length)];
                    switch(mode) {
                        case 'kanjiToMeaning': this.showKanjiMeaningQuestion(item); break;
                        case 'meaningToKanji': this.showMeaningKanjiQuestion(item); break;
                        case 'kanjiToRomaji': this.showKanjiRomajiQuestion(item); break;
                        case 'romajiToKanji': this.showRomajiKanjiQuestion(item); break;
                        case 'romajiToMeaning': this.showRomajiMeaningQuestion(item); break;
                        case 'meaningToRomaji': this.showMeaningRomajiQuestion(item); break;
                    }
                } else {
                    // Original behavior for kana
                    const showCharacter = Math.random() < 0.5;
                    if (showCharacter) {
                        this.showCharacterQuestion(item);
                    } else {
                        this.showRomajiQuestion(item);
                    }
                }
                
                this.isAnswered = false;
            }

            getNextItem() {
                const now = new Date();
                let candidates = [];

                Object.entries(this.data.items).forEach(([id, item]) => {
                    if (this.currentMode !== 'mixed' && item.type !== this.currentMode) {
                        return;
                    }

                    const nextReview = new Date(item.nextReview);
                    if (nextReview <= now || item.totalSeen === 0) {
                        candidates.push({ id, item, priority: this.calculatePriority(item, now) });
                    }
                });

                if (candidates.length === 0) {
                    return null;
                }

                candidates.sort((a, b) => b.priority - a.priority);
                return candidates[0];
            }

            calculatePriority(item, now) {
                let priority = 0;
                
                if (item.totalSeen === 0) return 1000;
                if (item.consecutiveWrong >= 2) priority += 500;
                
                const overdue = (now - new Date(item.nextReview)) / (1000 * 60 * 60 * 24);
                priority += overdue * 10;
                priority += (3 - item.easiness) * 50;
                
                return priority;
            }

            showCharacterQuestion(item) {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                
                const correctAnswer = item.romaji;
                const allAnswers = this.getAnswerPool(item.type).map(i => i.romaji);
                const wrongAnswers = allAnswers.filter(a => a !== correctAnswer);
                
                const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
                const choices = [correctAnswer, ...shuffled.slice(0, Math.min(3, shuffled.length))];
                this.currentChoices = choices.sort(() => Math.random() - 0.5);
                this.currentQuestionType = 'characterToRomaji';  // Track question type
                
                container.innerHTML = `
                    <div class="question-card">
                        <div class="character">${item.character}</div>
                        <div class="question-text">${t.question.whatReading} ${item.type}?</div>
                        <div class="choices">
                            ${this.currentChoices.map((choice, index) => 
                                `<button class="choice-btn" data-answer="${choice}" onclick="app.checkAnswer('${choice}')">${choice}</button>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }

            showRomajiQuestion(item) {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                
                const correctAnswer = item.character;
                const allAnswers = this.getAnswerPool(item.type).map(i => i.character);
                const wrongAnswers = allAnswers.filter(a => a !== correctAnswer);
                
                const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
                const choices = [correctAnswer, ...shuffled.slice(0, Math.min(3, shuffled.length))];
                this.currentChoices = choices.sort(() => Math.random() - 0.5);
                this.currentQuestionType = 'romajiToCharacter';  // Track question type
                
                container.innerHTML = `
                    <div class="question-card">
                        <div class="question-text">${t.question.whichRepresents} ${item.type} ${t.question.represents}:</div>
                        <div class="character" style="font-size: min(20vw, 60px); margin: 15px 0;">"${item.romaji}"</div>
                        <div class="choices">
                            ${this.currentChoices.map((choice, index) => 
                                `<button class="choice-btn" data-answer="${choice}" onclick="app.checkAnswer('${choice}')">${choice}</button>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }

            getAnswerPool(type) {
                return Object.values(this.data.items).filter(item => item.type === type);
            }

            // Kanji -> Meaning
            showKanjiMeaningQuestion(item) {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                const correct = item.meanings[currentLanguage];
                const all = Object.values(kanjiData).map(d => d[currentLanguage]);
                const wrongs = all.filter(x => x !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
                const choices = [correct, ...wrongs].sort(() => Math.random() - 0.5);
                
                container.innerHTML = `
                    <div class="question-card">
                        <div class="character">${item.character}</div>
                        <div class="question-text">${t.question.kanjiMeaning}</div>
                        <div class="choices">
                            ${choices.map(c => `<button class="choice-btn" onclick="app.checkKanjiAnswer('${c.replace(/'/g, "\\'")}')">${c}</button>`).join('')}
                        </div>
                    </div>
                `;
                this.correctKanjiAnswer = correct;
            }

            // Meaning -> Kanji
            showMeaningKanjiQuestion(item) {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                const correct = item.character;
                const all = Object.keys(kanjiData);
                const wrongs = all.filter(x => x !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
                const choices = [correct, ...wrongs].sort(() => Math.random() - 0.5);
                
                container.innerHTML = `
                    <div class="question-card">
                        <div class="character" style="font-size: 24px;">${item.meanings[currentLanguage]}</div>
                        <div class="question-text">${t.question.whichKanjiMeans}</div>
                        <div class="choices">
                            ${choices.map(c => `<button class="choice-btn" onclick="app.checkKanjiAnswer('${c}')">${c}</button>`).join('')}
                        </div>
                    </div>
                `;
                this.correctKanjiAnswer = correct;
            }

            // Kanji -> Romaji
            showKanjiRomajiQuestion(item) {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                const correct = item.meanings.romaji[0]; // Use first reading
                const allReadings = [];
                Object.values(kanjiData).forEach(d => allReadings.push(...d.romaji));
                const wrongs = allReadings.filter(x => !item.meanings.romaji.includes(x)).sort(() => Math.random() - 0.5).slice(0, 3);
                const choices = [correct, ...wrongs].sort(() => Math.random() - 0.5);
                
                container.innerHTML = `
                    <div class="question-card">
                        <div class="character">${item.character}</div>
                        <div class="question-text">${t.question.howReadKanji}</div>
                        <div class="choices">
                            ${choices.map(c => `<button class="choice-btn" onclick="app.checkKanjiAnswer('${c}', true)">${c}</button>`).join('')}
                        </div>
                    </div>
                `;
                this.correctKanjiAnswer = item.meanings.romaji; // Store array for multiple correct answers
            }

            // Romaji -> Kanji
            showRomajiKanjiQuestion(item) {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                const correct = item.character;
                const reading = item.meanings.romaji[0];
                const all = Object.keys(kanjiData);
                const wrongs = all.filter(x => x !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
                const choices = [correct, ...wrongs].sort(() => Math.random() - 0.5);
                
                container.innerHTML = `
                    <div class="question-card">
                        <div class="character" style="font-size: 48px;">${reading}</div>
                        <div class="question-text">${t.question.whichKanjiReading}</div>
                        <div class="choices">
                            ${choices.map(c => `<button class="choice-btn" onclick="app.checkKanjiAnswer('${c}')">${c}</button>`).join('')}
                        </div>
                    </div>
                `;
                this.correctKanjiAnswer = correct;
            }

            // Romaji -> Meaning
            showRomajiMeaningQuestion(item) {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                const reading = item.meanings.romaji[0];
                const correct = item.meanings[currentLanguage];
                const all = Object.values(kanjiData).map(d => d[currentLanguage]);
                const wrongs = all.filter(x => x !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
                const choices = [correct, ...wrongs].sort(() => Math.random() - 0.5);
                
                container.innerHTML = `
                    <div class="question-card">
                        <div class="character" style="font-size: 48px;">${reading}</div>
                        <div class="question-text">${t.question.whatReadingMeans}</div>
                        <div class="choices">
                            ${choices.map(c => `<button class="choice-btn" onclick="app.checkKanjiAnswer('${c.replace(/'/g, "\\'")}')">${c}</button>`).join('')}
                        </div>
                    </div>
                `;
                this.correctKanjiAnswer = correct;
            }

            // Meaning -> Romaji
            showMeaningRomajiQuestion(item) {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                const correct = item.meanings.romaji[0];
                const allReadings = [];
                Object.values(kanjiData).forEach(d => allReadings.push(...d.romaji));
                const wrongs = allReadings.filter(x => !item.meanings.romaji.includes(x)).sort(() => Math.random() - 0.5).slice(0, 3);
                const choices = [correct, ...wrongs].sort(() => Math.random() - 0.5);
                
                container.innerHTML = `
                    <div class="question-card">
                        <div class="character" style="font-size: 24px;">${item.meanings[currentLanguage]}</div>
                        <div class="question-text">${t.question.whatIsReading}</div>
                        <div class="choices">
                            ${choices.map(c => `<button class="choice-btn" onclick="app.checkKanjiAnswer('${c}', true)">${c}</button>`).join('')}
                        </div>
                    </div>
                `;
                this.correctKanjiAnswer = item.meanings.romaji; // Store array for multiple correct answers
            }

            checkKanjiAnswer(answer, isRomajiAnswer = false) {
                if (this.isAnswered) return;
                this.isAnswered = true;
                
                const { item } = this.currentItem;
                let isCorrect;
                
                if (isRomajiAnswer && Array.isArray(this.correctKanjiAnswer)) {
                    // For romaji answers where multiple readings are correct
                    isCorrect = this.correctKanjiAnswer.includes(answer);
                } else {
                    isCorrect = answer === this.correctKanjiAnswer;
                }
                
                const t = translations[currentLanguage];
                
                // Update button states
                const buttons = document.querySelectorAll('.choice-btn');
                buttons.forEach(btn => {
                    btn.classList.add('disabled');
                    const btnText = btn.textContent;
                    if (btnText === answer) {
                        btn.classList.add(isCorrect ? 'correct' : 'incorrect');
                    }
                    // Show correct answer if wrong
                    if (!isCorrect) {
                        if (isRomajiAnswer && Array.isArray(this.correctKanjiAnswer)) {
                            if (this.correctKanjiAnswer.includes(btnText)) {
                                btn.classList.add('correct');
                            }
                        } else if (btnText === this.correctKanjiAnswer) {
                            btn.classList.add('correct');
                        }
                    }
                });
                
                // Update item stats
                item.totalSeen++;
                item.lastReview = new Date().toISOString();
                
                let quality;
                if (isCorrect) {
                    item.consecutiveCorrect++;
                    item.consecutiveWrong = 0;
                    this.currentStreak++;
                    quality = Math.min(5, 3 + item.consecutiveCorrect);
                } else {
                    item.consecutiveCorrect = 0;
                    item.consecutiveWrong++;
                    this.currentStreak = 0;
                    quality = item.consecutiveWrong >= 2 ? 0 : 2;
                }
                
                // Apply SM2 algorithm
                const { repetitions, easiness, interval } = this.sm2.calculate(
                    quality,
                    item.repetitions,
                    item.easiness,
                    item.interval
                );
                
                item.repetitions = repetitions;
                item.easiness = easiness;
                item.interval = interval;
                
                const nextReview = new Date();
                nextReview.setDate(nextReview.getDate() + interval);
                item.nextReview = nextReview.toISOString();
                
                this.data.totalReviews++;
                this.saveData();
                this.updateStats();
                
                // Show feedback
                const container = document.getElementById('cardContainer');
                const feedbackDiv = document.createElement('div');
                feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
                
                let feedbackText = t.feedback.correct;
                if (!isCorrect) {
                    // Show the correct answer
                    if (Array.isArray(this.correctKanjiAnswer)) {
                        // For romaji answers, show all possible readings
                        const connector = currentLanguage === 'fr' ? '" ou "' : '" or "';
                        feedbackText = `${t.feedback.incorrect} "${this.correctKanjiAnswer.join(connector)}"`;
                    } else {
                        feedbackText = `${t.feedback.incorrect} "${this.correctKanjiAnswer}"`;
                    }
                }
                
                feedbackDiv.innerHTML = `
                    <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
                    <div class="feedback-text">${feedbackText}</div>
                `;
                container.appendChild(feedbackDiv);
                
                const nextBtn = document.createElement('button');
                nextBtn.className = 'next-btn';
                nextBtn.textContent = t.feedback.next;
                nextBtn.onclick = () => this.generateQuestion();
                container.appendChild(nextBtn);
            }

            checkAnswer(answer) {
                if (this.isAnswered) return;
                this.isAnswered = true;
                
                const { item } = this.currentItem;
                const isCorrect = answer === item.romaji || answer === item.character;
                const t = translations[currentLanguage];
                
                // Determine what the correct answer should be based on the question type
                let correctAnswer;
                if (this.currentQuestionType === 'romajiToCharacter') {
                    // We showed romaji and asked for character
                    correctAnswer = item.character;
                } else if (this.currentQuestionType === 'characterToRomaji') {
                    // We showed character and asked for romaji
                    correctAnswer = item.romaji;
                } else {
                    // Fallback to old logic if question type not set
                    if (this.currentChoices && this.currentChoices.includes(item.character)) {
                        correctAnswer = item.character;
                    } else {
                        correctAnswer = item.romaji;
                    }
                }
                
                const buttons = document.querySelectorAll('.choice-btn');
                buttons.forEach(btn => {
                    btn.classList.add('disabled');
                    if (btn.dataset.answer === answer) {
                        btn.classList.add(isCorrect ? 'correct' : 'incorrect');
                    }
                    if ((btn.dataset.answer === item.romaji || btn.dataset.answer === item.character) && !isCorrect) {
                        btn.classList.add('correct');
                    }
                });
                
                item.totalSeen++;
                item.lastReview = new Date().toISOString();
                
                let quality;
                if (isCorrect) {
                    item.consecutiveCorrect++;
                    item.consecutiveWrong = 0;
                    this.currentStreak++;
                    quality = Math.min(5, 3 + item.consecutiveCorrect);
                } else {
                    item.consecutiveCorrect = 0;
                    item.consecutiveWrong++;
                    this.currentStreak = 0;
                    quality = item.consecutiveWrong >= 2 ? 0 : 2;
                }
                
                const { repetitions, easiness, interval } = this.sm2.calculate(
                    quality,
                    item.repetitions,
                    item.easiness,
                    item.interval
                );
                
                item.repetitions = repetitions;
                item.easiness = easiness;
                item.interval = interval;
                
                const nextReview = new Date();
                nextReview.setDate(nextReview.getDate() + interval);
                item.nextReview = nextReview.toISOString();
                
                this.data.totalReviews++;
                this.saveData();
                this.updateStats();
                
                const container = document.getElementById('cardContainer');
                const feedbackDiv = document.createElement('div');
                feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
                feedbackDiv.textContent = isCorrect ? t.feedback.correct : `${t.feedback.incorrect} "${correctAnswer}"`;
                container.appendChild(feedbackDiv);
                
                const nextBtn = document.createElement('button');
                nextBtn.className = 'next-btn';
                nextBtn.textContent = t.feedback.next;
                nextBtn.onclick = () => this.generateQuestion();
                container.appendChild(nextBtn);
            }

            showComplete() {
                const container = document.getElementById('cardContainer');
                const t = translations[currentLanguage];
                container.innerHTML = `
                    <div class="welcome">
                        <h2>${t.complete.title}</h2>
                        <p>${t.complete.text1}</p>
                        <p>${t.complete.text2}</p>
                        <button class="next-btn" onclick="app.generateQuestion()">${t.complete.check}</button>
                    </div>
                `;
            }
        }

        // Global functions
        function selectLanguage(lang) {
            console.log('Selecting language:', lang);
            currentLanguage = lang;
            localStorage.setItem('languagePreference', lang);
            
            // Hide language setup
            document.getElementById('languageSetup').classList.add('hidden');
            
            // Show main app
            document.getElementById('appHeader').classList.remove('hidden');
            document.getElementById('mainContainer').classList.remove('hidden');
            
            // Initialize app and make it globally accessible
            app = new JapaneseSRSApp();
            window.app = app;  // Make app accessible for onclick handlers
            
            // Set mode indicator to the app's current mode (could be restored from localStorage)
            updateModeIndicators(app.currentMode);
        }

        function setMode(mode) {
            console.log('Setting mode:', mode);
            if (app) {
                app.currentMode = mode;
                app.saveData();
                updateModeIndicators(mode);
                // Close the menu after selection
                setTimeout(() => {
                    document.getElementById('hamburger').classList.remove('active');
                    document.getElementById('dropdownMenu').classList.remove('active');
                }, 100);
            }
        }

        function updateModeIndicators(activeMode) {
            console.log('updateModeIndicators called with:', activeMode);
            // Clear all indicators
            document.getElementById('modeMixed').textContent = '';
            document.getElementById('modeHiragana').textContent = '';
            document.getElementById('modeKatakana').textContent = '';
            document.getElementById('modeKanji').textContent = '';
            
            // Set active indicator
            if (activeMode === 'mixed') document.getElementById('modeMixed').textContent = '✓';
            else if (activeMode === 'hiragana') document.getElementById('modeHiragana').textContent = '✓';
            else if (activeMode === 'katakana') document.getElementById('modeKatakana').textContent = '✓';
            else if (activeMode === 'kanji') document.getElementById('modeKanji').textContent = '✓';
        }

        function toggleLanguage() {
            currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
            if (app) {
                app.updateUILanguage();
                app.saveData();
            }
        }
        
        function startLearning() {
            if (!app) {
                app = new JapaneseSRSApp();
            }
            app.startLearning();
        }


        function exportData() {
            if (!app) {
                app = new JapaneseSRSApp();
            }
            
            const dataStr = JSON.stringify(app.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `nihon-supermemo-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }

        function importData(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const t = translations[currentLanguage];
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (imported.items && imported.lastReview) {
                        if (!app) {
                            app = new JapaneseSRSApp();
                        }
                        app.data = imported;
                        app.saveData();
                        app.updateStats();
                        alert(t.alerts.importSuccess);
                        location.reload();
                    } else {
                        alert(t.alerts.invalidFormat);
                    }
                } catch (error) {
                    alert(t.alerts.importError + ': ' + error.message);
                }
            };
            reader.readAsText(file);
        }

        function resetData() {
            const t = translations[currentLanguage];
            if (confirm(t.alerts.resetConfirm)) {
                localStorage.removeItem('japaneseSRSData');
                localStorage.removeItem('languagePreference');
                location.reload();
            }
        }

        // Initialize on page load
        window.addEventListener('DOMContentLoaded', function() {
            console.log('DOM Content Loaded');
            
            // Check for saved language preference
            const savedLang = localStorage.getItem('languagePreference');
            
            if (savedLang) {
                console.log('Found saved language:', savedLang);
                currentLanguage = savedLang;
                selectLanguage(savedLang);
            } else {
                console.log('No saved language, showing selection modal');
                // Add event listeners to language buttons
                document.getElementById('langBtnEn').addEventListener('click', function() {
                    console.log('English button clicked');
                    selectLanguage('en');
                });
                
                document.getElementById('langBtnFr').addEventListener('click', function() {
                    console.log('French button clicked');
                    selectLanguage('fr');
                });
            }
        });
        
        // Make app accessible globally for onclick handlers
        window.app = app;
        
        console.log('Script loaded successfully');
        
        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => console.log('Service Worker registered:', registration))
                    .catch(error => console.log('Service Worker registration failed:', error));
            });
        }
