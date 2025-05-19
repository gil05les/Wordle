<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wordle Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            background-color: #f0f2f5;
        }
        h1 {
            color: #1a1a1a;
            margin-bottom: 20px;
        }
        .game-board {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-bottom: 20px;
        }
        .row {
            display: flex;
            gap: 5px;
        }
        .cell {
            width: 60px;
            height: 60px;
            border: 2px solid #d3d6da;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .correct {
            background-color: #6aaa64;
            color: white;
            border-color: #6aaa64;
        }
        .present {
            background-color: #c9b458;
            color: white;
            border-color: #c9b458;
        }
        .absent {
            background-color: #787c7e;
            color: white;
            border-color: #787c7e;
        }
        .keyboard {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            max-width: 500px;
        }
        .keyboard-row {
            display: flex;
            justify-content: center;
            gap: 6px;
        }
        .key {
            min-width: 40px;
            height: 58px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            cursor: pointer;
            background-color: #d3d6da;
            text-transform: uppercase;
        }
        .key.wide {
            min-width: 65px;
        }
        .message {
            margin: 20px 0;
            padding: 10px 15px;
            border-radius: 4px;
            background-color: white;
            border: 1px solid #ddd;
            min-height: 20px;
        }
        .error {
            color: #e74c3c;
        }
        .success {
            color: #2ecc71;
        }
        button {
            padding: 10px 15px;
            font-size: 1rem;
            border: none;
            background-color: #6aaa64;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 0;
        }
        button:hover {
            background-color: #5c9658;
        }
        .settings {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }
        .wordlist-info {
            font-size: 0.8rem;
            color: #6a6a6a;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <h1>Wordle</h1>
    <div class="message" id="message"></div>
    <div class="game-board" id="game-board"></div>
    <div class="keyboard">
        <div class="keyboard-row">
            <div class="key" data-key="q">q</div>
            <div class="key" data-key="w">w</div>
            <div class="key" data-key="e">e</div>
            <div class="key" data-key="r">r</div>
            <div class="key" data-key="t">t</div>
            <div class="key" data-key="y">y</div>
            <div class="key" data-key="u">u</div>
            <div class="key" data-key="i">i</div>
            <div class="key" data-key="o">o</div>
            <div class="key" data-key="p">p</div>
        </div>
        <div class="keyboard-row">
            <div class="key" data-key="a">a</div>
            <div class="key" data-key="s">s</div>
            <div class="key" data-key="d">d</div>
            <div class="key" data-key="f">f</div>
            <div class="key" data-key="g">g</div>
            <div class="key" data-key="h">h</div>
            <div class="key" data-key="j">j</div>
            <div class="key" data-key="k">k</div>
            <div class="key" data-key="l">l</div>
        </div>
        <div class="keyboard-row">
            <div class="key wide" data-key="enter">enter</div>
            <div class="key" data-key="z">z</div>
            <div class="key" data-key="x">x</div>
            <div class="key" data-key="c">c</div>
            <div class="key" data-key="v">v</div>
            <div class="key" data-key="b">b</div>
            <div class="key" data-key="n">n</div>
            <div class="key" data-key="m">m</div>
            <div class="key wide" data-key="backspace">⌫</div>
        </div>
    </div>
    <button id="new-game">New Game</button>
    <div class="settings">
        <select id="difficulty">
            <option value="easy">Easy Mode</option>
            <option value="normal" selected>Normal Mode</option>
            <option value="hard">Hard Mode</option>
        </select>
    </div>
    <div class="wordlist-info">
        Using a list of 280+ common 5-letter words
    </div>

    <script>
        // Common 5-letter words for target words (words to guess)
        const COMMON_TARGET_WORDS = [
            // Animals
            "tiger", "horse", "whale", "snake", "shark", "eagle", "mouse", "goose", "camel", "zebra",
            "panda", "koala", "sheep", "frog", "wolf", "bear", "moose", "fox", "deer", "otter",
            
            // Foods
            "apple", "pasta", "bread", "pizza", "peach", "melon", "lemon", "candy", "berry", "bacon",
            "beans", "steak", "sugar", "olive", "curry", "donut", "grape", "mango", "onion", "salad",
            
            // Household
            "chair", "table", "lamp", "couch", "sofa", "plate", "spoon", "fork", "knife", "clock",
            "phone", "paper", "photo", "plant", "shelf", "house", "floor", "door", "roof", "wall",
            
            // Clothing
            "shirt", "pants", "dress", "skirt", "shoes", "socks", "scarf", "boots", "glove", "hat", 
            "watch", "belt", "coat", "suit", "jeans", "hood", "short", "vest", "bag", "cap",
            
            // Nature
            "beach", "river", "ocean", "cloud", "storm", "rain", "snow", "sun", "moon", "star",
            "tree", "grass", "flower", "wind", "hill", "mountain", "forest", "fire", "cave", "lake",
            
            // Colors
            "black", "white", "green", "blue", "red", "brown", "gray", "pink", "purple", "orange",
            "teal", "gold", "silver", "bronze", "amber", "beige", "indigo", "ivory", "navy", "rose",
            
            // Common verbs
            "catch", "throw", "build", "write", "read", "speak", "help", "find", "make", "move",
            "jump", "climb", "dance", "laugh", "smile", "walk", "run", "sleep", "think", "dream",
            
            // Transportation
            "train", "plane", "car", "truck", "boat", "ship", "bus", "taxi", "bike", "canoe",
            
            // Emotions
            "happy", "sad", "angry", "calm", "brave", "proud", "shy", "tired", "quiet", "loud",
            
            // Time
            "clock", "month", "year", "day", "night", "hour", "week", "today", "soon", "later",
            
            // Sports
            "sport", "game", "ball", "team", "goal", "win", "race", "swim", "golf", "chess",
            
            // Music
            "music", "song", "band", "tune", "note", "piano", "drum", "flute", "beat", "sound",
            
            // School/Work
            "learn", "teach", "book", "page", "grade", "class", "desk", "test", "study", "work",
            "paper", "pen", "note", "text", "job", "task", "skill", "plan", "idea", "goal",
            
            // People
            "child", "adult", "baby", "friend", "group", "team", "crowd", "mom", "dad", "aunt",
            "uncle", "wife", "woman", "man", "boy", "girl", "son", "host", "guest", "chef"
        ];

        // Additional valid guesses - a small subset of 5-letter words
        // In a real implementation, this would include many more words
        const ADDITIONAL_VALID_GUESSES = [
            "about", "above", "actor", "admit", "adopt", "after", "again", "agree", "ahead", "album",
            "allow", "alone", "along", "alter", "among", "anger", "angle", "angry", "ankle", "apart",
            "apple", "apply", "arena", "argue", "arise", "array", "arrow", "asset", "avoid", "award",
            "aware", "awful", "bacon", "badge", "badly", "basic", "basis", "batch", "beach", "beard",
            "begin", "being", "below", "bench", "birth", "black", "blade", "blame", "blank", "blast",
            "bleed", "blend", "bless", "blind", "block", "blood", "bloom", "blues", "bluff", "board",
            "boost", "booth", "brain", "brake", "brand", "brave", "bread", "break", "breed", "brick",
            "brief", "bring", "broad", "brown", "brush", "build", "built", "bunch", "burst", "cabin",
            "cable", "camel", "canal", "candy", "canon", "cargo", "carry", "carve", "catch", "cause",
            "cedar", "chair", "charm", "chart", "chase", "cheap", "check", "chess", "chest", "chief",
            "child", "chill", "china", "chips", "choke", "civil", "claim", "clash", "class", "clean"
        ];

        // Combine all valid guesses
        const VALID_GUESSES = [...COMMON_TARGET_WORDS, ...ADDITIONAL_VALID_GUESSES];

        let targetWord = "";
        let currentRow = 0;
        let currentCol = 0;
        let currentGuess = '';
        let gameOver = false;
        let hardMode = false;

        // Initialize the game board
        function initializeBoard() {
            const gameBoard = document.getElementById('game-board');
            gameBoard.innerHTML = '';
            
            for (let i = 0; i < 6; i++) {
                const row = document.createElement('div');
                row.className = 'row';
                
                for (let j = 0; j < 5; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.setAttribute('data-row', i);
                    cell.setAttribute('data-col', j);
                    row.appendChild(cell);
                }
                
                gameBoard.appendChild(row);
            }
            
            currentRow = 0;
            currentCol = 0;
            currentGuess = '';
            gameOver = false;
            
            // Reset keyboard
            const keys = document.querySelectorAll('.key');
            keys.forEach(key => {
                key.classList.remove('correct', 'present', 'absent');
            });
            
            // Choose a random word based on difficulty
            selectTargetWord();
            
            showMessage('Game started! Guess a 5-letter word.', 'normal');
        }

        // Select a target word based on difficulty
        function selectTargetWord() {
            const difficulty = document.getElementById('difficulty').value;
            
            // For all difficulties, we'll use the common words, but with different selection strategies
            if (difficulty === 'easy') {
                // Easy mode: Select from a subset of more common words
                const easyWords = COMMON_TARGET_WORDS.filter(word => 
                    // Words with more common letters and fewer repeated letters
                    word.includes('e') || word.includes('a') || word.includes('r') ||
                    word.includes('t') || word.includes('o') || word.includes('s')
                );
                targetWord = easyWords[Math.floor(Math.random() * easyWords.length)];
            } 
            else if (difficulty === 'hard') {
                // Hard mode: Select words with less common letters or repeated letters
                const hardWords = COMMON_TARGET_WORDS.filter(word => 
                    word.includes('j') || word.includes('q') || word.includes('x') ||
                    word.includes('z') || word.includes('v') || word.includes('k') ||
                    new Set(word).size < word.length // Has repeated letters
                );
                targetWord = hardWords.length > 0 ? 
                    hardWords[Math.floor(Math.random() * hardWords.length)] : 
                    COMMON_TARGET_WORDS[Math.floor(Math.random() * COMMON_TARGET_WORDS.length)];
                
                // Enable hard mode constraints
                hardMode = true;
            } 
            else {
                // Normal mode: Select from all common words
                targetWord = COMMON_TARGET_WORDS[Math.floor(Math.random() * COMMON_TARGET_WORDS.length)];
                hardMode = false;
            }
            
            console.log(`Target word: ${targetWord} (Difficulty: ${difficulty}, Hard Mode: ${hardMode})`);
        }

        // Show a message
        function showMessage(text, type) {
            const message = document.getElementById('message');
            message.textContent = text;
            message.className = 'message ' + type;
        }

        // Update the board with a letter
        function updateBoard(letter) {
            if (currentCol < 5 && !gameOver) {
                const rows = document.querySelectorAll('.row');
                const cells = rows[currentRow].querySelectorAll('.cell');
                cells[currentCol].textContent = letter;
                currentCol++;
                currentGuess += letter;
            }
        }

        // Delete a letter
        function deleteLetter() {
            if (currentCol > 0 && !gameOver) {
                currentCol--;
                const rows = document.querySelectorAll('.row');
                const cells = rows[currentRow].querySelectorAll('.cell');
                cells[currentCol].textContent = '';
                currentGuess = currentGuess.slice(0, -1);
            }
        }

        // Check if a guess is valid for hard mode
        function isValidHardModeGuess(guess) {
            if (!hardMode || currentRow === 0) return true;
            
            // Get feedback from previous guesses
            const previousFeedback = [];
            
            for (let row = 0; row < currentRow; row++) {
                const rowElement = document.querySelectorAll('.row')[row];
                const cells = rowElement.querySelectorAll('.cell');
                
                const rowFeedback = {
                    correct: [],
                    present: []
                };
                
                for (let i = 0; i < 5; i++) {
                    if (cells[i].classList.contains('correct')) {
                        rowFeedback.correct.push({
                            letter: cells[i].textContent.toLowerCase(),
                            position: i
                        });
                    } else if (cells[i].classList.contains('present')) {
                        rowFeedback.present.push(cells[i].textContent.toLowerCase());
                    }
                }
                
                previousFeedback.push(rowFeedback);
            }
            
            // Check last guess's feedback to ensure this guess follows hard mode rules
            const lastFeedback = previousFeedback[previousFeedback.length - 1];
            
            // Check if all correct letters are in the right positions
            for (const { letter, position } of lastFeedback.correct) {
                if (guess[position] !== letter) {
                    showMessage(`Letter ${letter.toUpperCase()} must be in position ${position + 1}`, 'error');
                    return false;
                }
            }
            
            // Check if all present letters are used
            for (const letter of lastFeedback.present) {
                if (!guess.includes(letter)) {
                    showMessage(`Must use revealed letter ${letter.toUpperCase()}`, 'error');
                    return false;
                }
            }
            
            return true;
        }

        // Submit a guess
        function submitGuess() {
            if (currentGuess.length !== 5 || gameOver) return;
            
            // Check if the word is in our list of valid guesses
            if (!VALID_GUESSES.includes(currentGuess)) {
                showMessage('Not in word list', 'error');
                return;
            }
            
            // Check hard mode constraints
            if (!isValidHardModeGuess(currentGuess)) {
                return;
            }
            
            // Initialize feedback
            const feedback = [];
            let targetChars = targetWord.split('');
            const guessChars = currentGuess.split('');
            
            // First pass: Mark exact matches as 'correct'
            for (let i = 0; i < 5; i++) {
                if (guessChars[i] === targetChars[i]) {
                    feedback[i] = 'correct';
                    targetChars[i] = null; // Mark as used
                } else {
                    feedback[i] = 'absent'; // Default to absent, may change in second pass
                }
            }
            
            // Second pass: Mark present letters
            for (let i = 0; i < 5; i++) {
                if (feedback[i] !== 'correct') {
                    const indexInTarget = targetChars.indexOf(guessChars[i]);
                    if (indexInTarget !== -1) {
                        feedback[i] = 'present';
                        targetChars[indexInTarget] = null; // Mark as used
                    }
                }
            }
            
            // Update cell colors
            const rows = document.querySelectorAll('.row');
            const cells = rows[currentRow].querySelectorAll('.cell');
            
            for (let i = 0; i < 5; i++) {
                const letter = currentGuess[i];
                const status = feedback[i];
                
                setTimeout(() => {
                    cells[i].classList.add(status);
                    
                    // Update keyboard key color
                    const key = document.querySelector(`.key[data-key="${letter}"]`);
                    if (key) {
                        if (status === 'correct') {
                            key.classList.remove('present', 'absent');
                            key.classList.add('correct');
                        } else if (status === 'present' && !key.classList.contains('correct')) {
                            key.classList.remove('absent');
                            key.classList.add('present');
                        } else if (status === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
                            key.classList.add('absent');
                        }
                    }
                }, i * 100); // Animate with a delay
            }
            
            // Check if game is over
            if (currentGuess === targetWord) {
                gameOver = true;
                setTimeout(() => {
                    showMessage(`Congratulations! You guessed the word: ${targetWord.toUpperCase()}`, 'success');
                }, 600);
            } else if (currentRow === 5) { // Last row (0-based index)
                gameOver = true;
                setTimeout(() => {
                    showMessage(`Game over! The word was: ${targetWord.toUpperCase()}`, 'error');
                }, 600);
            } else {
                // Move to next row
                currentRow++;
                currentCol = 0;
                currentGuess = '';
            }
        }

        // Event listener for keyboard clicks
        document.querySelector('.keyboard').addEventListener('click', (e) => {
            if (!e.target.classList.contains('key')) return;
            
            const key = e.target.getAttribute('data-key');
            
            if (key === 'enter') {
                submitGuess();
            } else if (key === 'backspace') {
                deleteLetter();
            } else if (/^[a-z]$/.test(key)) {
                updateBoard(key);
            }
        });

        // Event listener for physical keyboard
        document.addEventListener('keydown', (e) => {
            if (gameOver && e.key !== 'Enter') return;
            
            if (e.key === 'Enter') {
                if (gameOver) {
                    initializeBoard();
                } else {
                    submitGuess();
                }
            } else if (e.key === 'Backspace') {
                deleteLetter();
            } else if (/^[a-zA-Z]$/.test(e.key) && e.key.length === 1) {
                updateBoard(e.key.toLowerCase());
            }
        });

        // Event listener for "New Game" button
        document.getElementById('new-game').addEventListener('click', initializeBoard);
        
        // Event listener for difficulty change
        document.getElementById('difficulty').addEventListener('change', () => {
            if (!gameOver) {
                if (confirm('Changing difficulty will start a new game. Continue?')) {
                    initializeBoard();
                }
            }
        });

        // Initialize the game when the page loads
        document.addEventListener('DOMContentLoaded', initializeBoard);
    </script>
</body>
</html>
