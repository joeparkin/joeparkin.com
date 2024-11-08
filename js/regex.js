const GRID_SIZE = 10;
const POSSIBLE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'.split('');
const MINE_PROBABILITY = 0.1;

function generateGameState() {
    const gameState = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        gameState[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            // Randomly select a character from POSSIBLE_CHARS
            const randomChar = POSSIBLE_CHARS[Math.floor(Math.random() * POSSIBLE_CHARS.length)];
            const isMine = Math.random() < MINE_PROBABILITY;
            gameState[i][j] = {
                char: randomChar,
                isMine: isMine
            }
        }
    }
    return gameState;
}

function createGameGrid() {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = ''; // Clear grid if one already existed
    const gameState = generateGameState();
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const tile = document.createElement('div');
            tile.classList.add('game-tile');
            tile.dataset.row = i;
            tile.dataset.col = j;
            tile.dataset.char = gameState[i][j].char; // Store the hidden character as a data attribute
            tile.dataset.isMine = gameState[i][j].isMine;
            tile.textContent = '?'; // Question mark to represent hidden state
            gameGrid.appendChild(tile);
        }
    }
    gameGrid.dataset.gameState = JSON.stringify(gameState);
}

function initializeRegexTesting() {
    const testButton = document.getElementById('test-regex');
    const shuffleButton = document.getElementById('shuffle-grid');
    const regexInput = document.getElementById('regex-input');

    testButton.addEventListener('click', () => {
        const regex = regexInput.value;
        testRegex(regex);
    });

    shuffleButton.addEventListener('click', () => {
        createGameGrid();  // Generate new random characters
        regexInput.value = '';  // Clears input field
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
        
        // Reset all tiles to hidden state - this should probably be it's own function at some point
        Array.from(tiles).forEach(tile => {
            tile.textContent = '?';
            tile.classList.remove('revealed');
            tile.classList.remove('mine-exploded');
            void tile.offsetWidth; // Weird hack to force a DOM reflow. Mine explosions are now visible even if they were hit just before this test.
        });

        let hitMine = false;
        
        // Reveal tiles that match the regex - this should probably be it's own function at some point
        Array.from(tiles).forEach(tile => {
            const char = tile.dataset.char;
            const isMine = tile.dataset.isMine === 'true';
            if (regex.test(char)) {
                tile.textContent = char;
                tile.classList.add('revealed');
                if (isMine) {
                    hitMine = true;
                    tile.classList.add('mine-exploded');
                }
            }
        });

        if (hitMine) {
            console.log('Boom! You hit a mine!');
        }

    } catch (e) {
        console.error('Invalid regex:', e);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createGameGrid();
    initializeRegexTesting();
});