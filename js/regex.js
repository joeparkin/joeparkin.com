const GRID_SIZE = 10;
const POSSIBLE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'.split('');

function generateGameState() {
    const gameState = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        gameState[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            // Randomly select a character from POSSIBLE_CHARS
            const randomChar = POSSIBLE_CHARS[Math.floor(Math.random() * POSSIBLE_CHARS.length)];
            gameState[i][j] = randomChar;
        }
    }
    return gameState;
}

function createGameGrid() {
    const gameGrid = document.getElementById('game-grid');
    const gameState = generateGameState();
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const tile = document.createElement('div');
            tile.classList.add('game-tile');
            tile.dataset.row = i;
            tile.dataset.col = j;
            // Store the hidden character as a data attribute
            tile.dataset.char = gameState[i][j];
            // Question mark to represent hidden state
            tile.textContent = '?';
            gameGrid.appendChild(tile);
        }
    }
    gameGrid.dataset.gameState = JSON.stringify(gameState);
}

function initializeRegexTesting() {
    const testButton = document.getElementById('test-regex');
    const regexInput = document.getElementById('regex-input');

    testButton.addEventListener('click', () => {
        const regex = regexInput.value;
        testRegex(regex);
    });

    // Also allow Enter key to submit
    regexInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            testRegex(regexInput.value);
        }
    });
}

function testRegex(regexStr) {
    // Return early if regex is empty or only whitespace
    if (!regexStr || !regexStr.trim()) {
        return;
    }
    try {
        const regex = new RegExp(regexStr);
        const gameGrid = document.getElementById('game-grid');
        const tiles = gameGrid.getElementsByClassName('game-tile');
        
        // Reset all tiles to hidden state
        Array.from(tiles).forEach(tile => {
            tile.textContent = '?';
            tile.classList.remove('revealed');
        });
        
        // Reveal tiles that match the regex
        Array.from(tiles).forEach(tile => {
            const char = tile.dataset.char;
            if (regex.test(char)) {
                tile.textContent = char;
                tile.classList.add('revealed');
            }
        });
    } catch (e) {
        console.error('Invalid regex:', e);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createGameGrid();
    initializeRegexTesting();
});