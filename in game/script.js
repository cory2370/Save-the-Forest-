const DIFFICULTY_SETTINGS = {
    easy: {
        name: "Eco-Friendly",
        gridSize: 5,
        burnInterval: 4500, 
        saplingTeleport: false,
        obstacles: 0,
        keyPressRequirement: 1, 
        treePercentage: 0.75,
        burningPercentage: 0.15
    },
    medium: {
        name: "Sustainable",
        gridSize: 6,
        burnInterval: 4000, 
        saplingTeleport: true,
        obstacles: 0,
        keyPressRequirement: 1,
        treePercentage: 0.75,
        burningPercentage: 0.15
    },
    hard: {
        name: "Drought",
        gridSize: 8,
        burnInterval: 4000, 
        saplingTeleport: true,
        obstacles: 5,
        keyPressRequirement: 2,
        treePercentage: 0.7,
        burningPercentage: 0.2
    },
    wrath: {
        name: "Polluted",
        gridSize: 12,
        burnInterval: 3000, 
        saplingTeleport: true,
        obstacles: 20,
        keyPressRequirement: 3, 
        treePercentage: 0.75,
        burningPercentage: 0.25
    },
    custom: {
        name: "Custom",
        gridSize: 6,
        burnInterval: 4000,
        saplingTeleport: true,
        obstacles: 0,
        keyPressRequirement: 1,
        treePercentage: 0.75,
        burningPercentage: 0.15
    }
};

try {
    const storedSettings = localStorage.getItem('customGameSettings');
    if (storedSettings) {
        DIFFICULTY_SETTINGS.custom = JSON.parse(storedSettings);
    }
} catch (error) {
    console.error('Error loading custom settings');
}

document.addEventListener('DOMContentLoaded', function() {
    const isSettingsPage = document.querySelector('.config-form') !== null;
    
    if (isSettingsPage) {
        initSettingsPage();
    } else {
        initGamePage();
    }
});

function initSettingsPage() {
    const gridSizeSlider = document.getElementById('gridSize');
    const gridSizeValue = document.getElementById('gridSizeValue');
    const burnIntervalSlider = document.getElementById('burnInterval');
    const burnIntervalValue = document.getElementById('burnIntervalValue');
    const obstaclesSlider = document.getElementById('obstacles');
    const obstaclesValue = document.getElementById('obstaclesValue');
    const keyPressSlider = document.getElementById('keyPressRequirement');
    const keyPressValue = document.getElementById('keyPressRequirementValue');
    const treePercentageSlider = document.getElementById('treePercentage');
    const treePercentageValue = document.getElementById('treePercentageValue');
    const burningPercentageSlider = document.getElementById('burningPercentage');
    const burningPercentageValue = document.getElementById('burningPercentageValue');
    const saplingTeleportToggle = document.getElementById('saplingTeleport');
    
    const difficultyBar = document.getElementById('difficultyBar');
    const difficultyDescription = document.getElementById('difficultyDescription');
    
    const presetEasyButton = document.getElementById('presetEasy');
    const presetMediumButton = document.getElementById('presetMedium');
    const presetHardButton = document.getElementById('presetHard');
    const presetExtremeButton = document.getElementById('presetExtreme');
    const startGameButton = document.getElementById('startGameButton');
    
    function initializeSettings() {
        let settings = DIFFICULTY_SETTINGS.custom;
        
        try {
            const savedSettings = localStorage.getItem('customGameSettings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                
                if (parsed.treePercentage <= 1) {
                    parsed.treePercentage = Math.round(parsed.treePercentage * 100);
                }
                if (parsed.burningPercentage <= 1) {
                    parsed.burningPercentage = Math.round(parsed.burningPercentage * 100);
                }
                
                settings = parsed;
            }
        } catch (error) {
            console.error('Error loading saved settings');
        }
        
        gridSizeSlider.value = settings.gridSize || 6;
        burnIntervalSlider.value = settings.burnInterval || 4000;
        obstaclesSlider.value = settings.obstacles || 0;
        keyPressSlider.value = settings.keyPressRequirement || 1;
        treePercentageSlider.value = settings.treePercentage || 75;
        burningPercentageSlider.value = settings.burningPercentage || 15;
        
        saplingTeleportToggle.checked = settings.saplingTeleport !== undefined ? settings.saplingTeleport : true;
        
        updateAllDisplayedValues();
    }
    
    function updateGridSizeValue() {
        const size = parseInt(gridSizeSlider.value);
        gridSizeValue.textContent = `${size} × ${size}`;
        
        const maxObstacles = Math.floor(Math.pow(size, 2) * 0.3);
        obstaclesSlider.max = maxObstacles;
        
        if (parseInt(obstaclesSlider.value) > maxObstacles) {
            obstaclesSlider.value = maxObstacles;
            updateObstaclesValue();
        }
    }
    
    function updateBurnIntervalValue() {
        const interval = parseInt(burnIntervalSlider.value);
        burnIntervalValue.textContent = `${interval / 1000} seconds`;
    }
    
    function updateObstaclesValue() {
        obstaclesValue.textContent = obstaclesSlider.value;
    }
    
    function updateKeyPressValue() {
        keyPressValue.textContent = keyPressSlider.value;
    }
    
    function updateTreePercentageValue() {
        treePercentageValue.textContent = `${treePercentageSlider.value}%`;
        
        const maxBurning = Math.floor(parseInt(treePercentageSlider.value) * 0.5);
        if (parseInt(burningPercentageSlider.value) > maxBurning) {
            burningPercentageSlider.value = maxBurning;
            updateBurningPercentageValue();
        }
    }
    
    function updateBurningPercentageValue() {
        burningPercentageValue.textContent = `${burningPercentageSlider.value}%`;
    }
    
    function updateAllDisplayedValues() {
        updateGridSizeValue();
        updateBurnIntervalValue();
        updateObstaclesValue();
        updateKeyPressValue();
        updateTreePercentageValue();
        updateBurningPercentageValue();
        updateDifficultyMeter();
    }
    
    function updateDifficultyMeter() {
        const gridSizeFactor = ((parseInt(gridSizeSlider.value) - 4) / 11) * 15;
        const burnIntervalFactor = ((7000 - parseInt(burnIntervalSlider.value)) / 6000) * 25;
        const obstaclesFactor = (parseInt(obstaclesSlider.value) / 30) * 20;
        const keyPressFactor = ((parseInt(keyPressSlider.value) - 1) / 9) * 10;
        const treePercentageFactor = ((90 - parseInt(treePercentageSlider.value)) / 60) * 10;
        const burningPercentageFactor = ((parseInt(burningPercentageSlider.value) - 5) / 45) * 15;
        const teleportFactor = saplingTeleportToggle.checked ? 5 : 0;
        
        const difficultyScore = Math.round(
            gridSizeFactor + 
            burnIntervalFactor + 
            obstaclesFactor + 
            keyPressFactor + 
            treePercentageFactor + 
            burningPercentageFactor + 
            teleportFactor
        );
        
        difficultyBar.style.width = `${difficultyScore}%`;
        
        let description;
        if (difficultyScore < 25) {
            description = "Beginner friendly - perfect for learning the game";
        } else if (difficultyScore < 50) {
            description = "Moderate challenge - good for casual players";
        } else if (difficultyScore < 75) {
            description = "Challenging - requires strategy and quick thinking";
        } else {
            description = "Extreme difficulty - only for the bravest firefighters!";
        }
        
        difficultyDescription.textContent = description;
    }
    
    function applyPreset(preset) {
        const settings = DIFFICULTY_SETTINGS[preset];
        
        gridSizeSlider.value = settings.gridSize;
        burnIntervalSlider.value = settings.burnInterval;
        obstaclesSlider.value = settings.obstacles;
        keyPressSlider.value = settings.keyPressRequirement;
        treePercentageSlider.value = settings.treePercentage * 100;
        burningPercentageSlider.value = settings.burningPercentage * 100;
        saplingTeleportToggle.checked = settings.saplingTeleport;
        
        updateAllDisplayedValues();
    }
    
    function saveSettings() {
        const settings = {
            name: "Custom",
            gridSize: parseInt(gridSizeSlider.value),
            burnInterval: parseInt(burnIntervalSlider.value),
            obstacles: parseInt(obstaclesSlider.value),
            keyPressRequirement: parseInt(keyPressSlider.value),
            treePercentage: parseInt(treePercentageSlider.value) / 100,
            burningPercentage: parseInt(burningPercentageSlider.value) / 100,
            saplingTeleport: saplingTeleportToggle.checked
        };
        
        localStorage.setItem('customGameSettings', JSON.stringify(settings));
        
        return settings;
    }
    
    gridSizeSlider.addEventListener('input', function() {
        updateGridSizeValue();
        updateDifficultyMeter();
    });
    
    burnIntervalSlider.addEventListener('input', function() {
        updateBurnIntervalValue();
        updateDifficultyMeter();
    });
    
    obstaclesSlider.addEventListener('input', function() {
        updateObstaclesValue();
        updateDifficultyMeter();
    });
    
    keyPressSlider.addEventListener('input', function() {
        updateKeyPressValue();
        updateDifficultyMeter();
    });
    
    treePercentageSlider.addEventListener('input', function() {
        updateTreePercentageValue();
        updateDifficultyMeter();
    });
    
    burningPercentageSlider.addEventListener('input', function() {
        updateBurningPercentageValue();
        updateDifficultyMeter();
    });
    
    saplingTeleportToggle.addEventListener('change', updateDifficultyMeter);
    
    presetEasyButton.addEventListener('click', function() {
        applyPreset('easy');
    });
    
    presetMediumButton.addEventListener('click', function() {
        applyPreset('medium');
    });
    
    presetHardButton.addEventListener('click', function() {
        applyPreset('hard');
    });
    
    presetExtremeButton.addEventListener('click', function() {
        applyPreset('wrath');
    });
    
    startGameButton.addEventListener('click', function() {
        saveSettings();
        window.location.href = '../in game/custom_h.html';
    });
    
    initializeSettings();
}

function initGamePage() {
    const currentDifficulty = document.body.getAttribute('data-difficulty') || 'easy';
    const settings = DIFFICULTY_SETTINGS[currentDifficulty] || DIFFICULTY_SETTINGS.easy;

    let grid = [];
    let playerPosition = { row: 0, col: 0 };
    let saplingPosition = { row: 0, col: 0 };
    let initialSaplingPosition = { row: 0, col: 0 }; 
    let hasSapling = false;
    let gameStatus = "starting"; 
    let burnTimer = null;
    let countdownTimer = null;
    let countdown = 5;
    let healthyTreesCount = 0;
    let burningTreesCount = 0;
    let keyPressCount = 0; 
    let emptyCells = [];
    let obstaclesCount = 0;

    const CELL_TYPES = {
        EMPTY: "empty",
        TREE: "tree",
        BURNING: "burning",
        PLAYER: "player", 
        SAPLING: "sapling",
        OBSTACLE: "obstacle"
    };

    const gameGridElement = document.getElementById("gameGrid");
    const countdownOverlay = document.getElementById("countdownOverlay");
    const countdownTimerElement = document.getElementById("countdownTimer");
    const treesCountElement = document.getElementById("treesCount");
    const burningCountElement = document.getElementById("burningCount");
    const saplingStatusElement = document.getElementById("saplingStatus");
    const gameMessageElement = document.getElementById("gameMessage");
    const gameOverModal = document.getElementById("gameOverModal");
    const gameOverTitle = document.getElementById("gameOverTitle");
    const gameOverMessage = document.getElementById("gameOverMessage");
    const restartButton = document.getElementById("restartButton");
    const playAgainButton = document.getElementById("playAgainButton");
    const readyButton = document.getElementById("readyButton");
    const obstaclesCountElement = document.getElementById("obstaclesCount");
    
    document.title = `Save the Forest! - ${settings.name} Mode`;
    
    function positionOverlay() {
        const gameGrid = document.getElementById('gameGrid');
        const overlay = document.getElementById('countdownOverlay');
        if (gameGrid && overlay) {
            const gridRect = gameGrid.getBoundingClientRect();
            overlay.style.top = gridRect.top + window.scrollY + 'px';
            overlay.style.left = gridRect.left + window.scrollX + 'px';
            overlay.style.width = gridRect.width + 'px';
            overlay.style.height = gridRect.height + 'px';
        }
    }

    function initGame() {
        if (burnTimer) clearInterval(burnTimer);
        if (countdownTimer) clearInterval(countdownTimer);
        
        const gridSize = settings.gridSize;
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(CELL_TYPES.EMPTY));
        gameGridElement.innerHTML = "";
        gameGridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gameGridElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        
        emptyCells = [];
        obstaclesCount = 0;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.createElement("div");
                cell.id = `cell-${row}-${col}`;
                cell.className = "grid-cell cell-empty";
                gameGridElement.appendChild(cell);
                
                emptyCells.push({ row, col });
            }
        }
        
        hasSapling = false;
        gameStatus = "starting";
        keyPressCount = 0;
        healthyTreesCount = 0;
        burningTreesCount = 0;
        
        if (settings.obstacles > 0) {
            placeObstacles();
        }
        placeInitialTrees();
        placePlayer();
        placeSapling();
        updateUI();
        showReadyScreen();
    }

    window.startGameFunction = function() {
        gameStatus = "playing";
        
        if (burnTimer) clearInterval(burnTimer);
        
        burnTimer = setInterval(() => {
            if (gameStatus === "playing") {
                burnRandomTree();
            }
        }, settings.burnInterval);
        
        showMessage(`${settings.name} Mode: Save the forest!`);
    };
    
    function startGame() {
        window.startGameFunction();
    }

    function removeFromEmptyCells(row, col) {
        const index = emptyCells.findIndex(cell => cell.row === row && cell.col === col);
        if (index !== -1) {
            emptyCells.splice(index, 1);
        }
    }

    function getRandomEmptyCell() {
        if (emptyCells.length === 0) return null;
        const index = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[index];
    }

    function placeObstacles() {
        let placedObstacles = 0;
        const maxAttempts = settings.obstacles * 2;
        let attempts = 0;
        
        while (placedObstacles < settings.obstacles && attempts < maxAttempts && emptyCells.length > 0) {
            attempts++;
            const randomCell = getRandomEmptyCell();
            if (!randomCell) break;
            
            const { row, col } = randomCell;
            grid[row][col] = CELL_TYPES.OBSTACLE;
            removeFromEmptyCells(row, col);
            placedObstacles++;
        }
        
        obstaclesCount = placedObstacles;
        if (obstaclesCountElement) {
            obstaclesCountElement.textContent = obstaclesCount;
        }
    }

    function placeInitialTrees() {
        const availableCells = emptyCells.length;
        let treesToPlace = Math.floor(availableCells * settings.treePercentage);
        let placedTrees = 0;
        
        const maxAttempts = treesToPlace * 2;
        let attempts = 0;
        
        while (placedTrees < treesToPlace && attempts < maxAttempts && emptyCells.length > 0) {
            attempts++;
            const randomCell = getRandomEmptyCell();
            if (!randomCell) break;
            
            const { row, col } = randomCell;
            grid[row][col] = CELL_TYPES.TREE;
            removeFromEmptyCells(row, col);
            placedTrees++;
        }
        
        healthyTreesCount = placedTrees;
        
        const treePositions = [];
        const gridSize = settings.gridSize;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === CELL_TYPES.TREE) {
                    treePositions.push({ row, col });
                }
            }
        }
        
        let burningToPlace = Math.floor(placedTrees * settings.burningPercentage);
        let placedBurning = 0;
        
        while (placedBurning < burningToPlace && treePositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * treePositions.length);
            const { row, col } = treePositions[randomIndex];
            
            grid[row][col] = CELL_TYPES.BURNING;
            healthyTreesCount--;
            placedBurning++;
            
            treePositions.splice(randomIndex, 1);
        }
        
        burningTreesCount = placedBurning;
    }

    function placePlayer() {
        if (emptyCells.length === 0) {
            return;
        }
        
        const randomCell = getRandomEmptyCell();
        playerPosition = { row: randomCell.row, col: randomCell.col };
        removeFromEmptyCells(randomCell.row, randomCell.col);
    }

    function placeSapling() {
        if (emptyCells.length === 0) {
            return;
        }
        
        if (!settings.saplingTeleport && initialSaplingPosition.row !== 0) {
            if (grid[initialSaplingPosition.row][initialSaplingPosition.col] === CELL_TYPES.EMPTY) {
                saplingPosition = { ...initialSaplingPosition };
                return;
            }
        }
        
        const randomCell = getRandomEmptyCell();
        if (!randomCell) {
            return;
        }
        
        saplingPosition = { row: randomCell.row, col: randomCell.col };
        
        if (!settings.saplingTeleport) {
            initialSaplingPosition = { ...saplingPosition };
        }
    }

    function updateUI() {
        const gridSize = settings.gridSize;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                
                cell.className = `grid-cell cell-${grid[row][col]}`;
                
                let emoji = "";
                switch (grid[row][col]) {
                    case CELL_TYPES.TREE:
                        emoji = "🌳";
                        break;
                    case CELL_TYPES.BURNING:
                        emoji = "🔥";
                        break;
                    case CELL_TYPES.OBSTACLE:
                        emoji = "🪨";
                        break;
                    case CELL_TYPES.EMPTY:
                        emoji = "";
                        break;
                }
                cell.textContent = emoji;
            }
        }
        
        const playerCell = document.getElementById(`cell-${playerPosition.row}-${playerPosition.col}`);
        if (playerCell) {
            playerCell.className = "grid-cell cell-player";
            playerCell.textContent = "🧑‍🚒";
        }
        
        if (!hasSapling || !settings.saplingTeleport) {
            const saplingCell = document.getElementById(`cell-${saplingPosition.row}-${saplingPosition.col}`);
            if (saplingCell && 
                (playerPosition.row !== saplingPosition.row || 
                 playerPosition.col !== saplingPosition.col)) {
                saplingCell.className = "grid-cell cell-sapling";
                saplingCell.textContent = "🌱";
            }
        }
        
        treesCountElement.textContent = healthyTreesCount;
        burningCountElement.textContent = burningTreesCount;
        saplingStatusElement.textContent = hasSapling ? "✅" : "❌";
        
        if (obstaclesCountElement) {
            obstaclesCountElement.textContent = obstaclesCount;
        }
    }
    
    function showReadyScreen() {
        gameStatus = "starting";
        
        const readySection = document.getElementById("readySection");
        const countdownSection = document.getElementById("countdownSection");
        const countdownOverlay = document.getElementById("countdownOverlay");
        
        if (!readySection || !countdownSection || !countdownOverlay) {
            console.error("Required overlay elements are missing");
            return;
        }
        
        positionOverlay();
        
        readySection.style.display = "block";
        countdownSection.style.display = "none";
        countdownOverlay.style.display = "flex";
        
        const readyButton = document.getElementById("readyButton");
        if (!readyButton) {
            console.error("Ready button is missing");
            return;
        }
        
        const newReadyButton = readyButton.cloneNode(true);
        readyButton.parentNode.replaceChild(newReadyButton, readyButton);
        
        newReadyButton.addEventListener("click", function() {
            readySection.style.display = "none";
            countdownSection.style.display = "block";
            startCountdown();
        });
    }

    function startCountdown() {
        gameStatus = "starting";
        countdown = 3;
        document.getElementById("countdownTimer").textContent = countdown;
        
        if (countdownTimer) clearInterval(countdownTimer);
        
        countdownTimer = setInterval(() => {
            countdown--;
            document.getElementById("countdownTimer").textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownTimer);
                countdownOverlay.style.display = "none";
                startGame();
            }
        }, 1000);
    }
    
    function startGame() {
        gameStatus = "playing";
        
        if (burnTimer) clearInterval(burnTimer);
        
        burnTimer = setInterval(() => {
            if (gameStatus === "playing") {
                burnRandomTree();
            }
        }, settings.burnInterval);
        
        showMessage(`${settings.name} Mode: Save the forest!`);
    }

    window.startGameFunction = startGame;

    function burnRandomTree() {
        if (gameStatus !== "playing" || healthyTreesCount === 0) return;
        
        const healthyTrees = [];
        const gridSize = settings.gridSize;
        
        let found = 0;
        const maxCheck = Math.min(healthyTreesCount, 10);
        
        while (found < maxCheck && healthyTrees.length < maxCheck) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            
            if (grid[row][col] === CELL_TYPES.TREE) {
                healthyTrees.push({ row, col });
                found++;
            }
        }
        
        if (healthyTrees.length > 0) {
            const randomIndex = Math.floor(Math.random() * healthyTrees.length);
            const { row, col } = healthyTrees[randomIndex];
            grid[row][col] = CELL_TYPES.BURNING;
            healthyTreesCount--;
            burningTreesCount++;
            
            updateUI();
            
            if (healthyTreesCount === 0) {
                endGame(false);
            }
        } else if (healthyTreesCount > 0) {
            const allTrees = [];
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (grid[row][col] === CELL_TYPES.TREE) {
                        allTrees.push({ row, col });
                    }
                }
            }
            
            healthyTreesCount = allTrees.length;
            
            if (allTrees.length > 0) {
                const randomIndex = Math.floor(Math.random() * allTrees.length);
                const { row, col } = allTrees[randomIndex];
                grid[row][col] = CELL_TYPES.BURNING;
                healthyTreesCount--;
                burningTreesCount++;
                
                updateUI();
            }
            
            if (healthyTreesCount === 0) {
                endGame(false);
            }
        }
    }

    function movePlayer(direction) {
        if (gameStatus !== "playing") return;
        const gridSize = settings.gridSize;
        let newRow = playerPosition.row;
        let newCol = playerPosition.col;
        
        switch (direction) {
            case 'w': 
                newRow = Math.max(0, newRow - 1);
                break;
            case 'a': 
                newCol = Math.max(0, newCol - 1);
                break;
            case 's': 
                newRow = Math.min(gridSize - 1, newRow + 1);
                break;
            case 'd': 
                newCol = Math.min(gridSize - 1, newCol + 1);
                break;
        }
        
        if (grid[newRow][newCol] === CELL_TYPES.OBSTACLE) {
            showMessage("Can't move there!");
            return;
        }
        
        if (newRow !== playerPosition.row || newCol !== playerPosition.col) {
            playerPosition = { row: newRow, col: newCol };
            updateUI();
        }
    }
    
    function pickupSapling() {
        if (gameStatus !== "playing" || hasSapling) return;
        if (settings.keyPressRequirement > 1) {
            keyPressCount++;
            if (keyPressCount < settings.keyPressRequirement) {
                showMessage(`Press Q ${settings.keyPressRequirement - keyPressCount} more times to pick up`);
                return;
            }
            keyPressCount = 0;
        }
        
        if (playerPosition.row === saplingPosition.row && playerPosition.col === saplingPosition.col) {
            hasSapling = true;
            showMessage("Sapling collected!");
            
            if (settings.saplingTeleport) {
                if (grid[saplingPosition.row][saplingPosition.col] === CELL_TYPES.EMPTY) {
                    removeFromEmptyCells(saplingPosition.row, saplingPosition.col);
                }
                
                grid[saplingPosition.row][saplingPosition.col] = CELL_TYPES.TREE;
                healthyTreesCount++;
                placeSapling();
            }
            
            updateUI();
        } else {
            showMessage("No sapling here!");
        }
    }
    
    function plantSapling() {
        if (gameStatus !== "playing" || !hasSapling) return;
        
        if (grid[playerPosition.row][playerPosition.col] === CELL_TYPES.BURNING) {
            grid[playerPosition.row][playerPosition.col] = CELL_TYPES.TREE;
            hasSapling = false;
            healthyTreesCount++;
            burningTreesCount--;
            
            if (!settings.saplingTeleport) {
                placeSapling();
            }
            showMessage("Tree saved!");
            updateUI();
            
            if (burningTreesCount === 0) {
                endGame(true);
            }
        } else if (grid[playerPosition.row][playerPosition.col] === CELL_TYPES.EMPTY) {
            grid[playerPosition.row][playerPosition.col] = CELL_TYPES.TREE;
            hasSapling = false;
            healthyTreesCount++;
            
            removeFromEmptyCells(playerPosition.row, playerPosition.col);
    
            if (!settings.saplingTeleport) {
                placeSapling();
            }
            showMessage("New tree planted!");
            updateUI();
        } else {
            showMessage("Can't plant here!");
        }
    }
    
    function showMessage(message) {
        gameMessageElement.textContent = message;
        setTimeout(() => {
            if (gameMessageElement.textContent === message) {
                gameMessageElement.textContent = "";
            }
        }, 3000);
    }
    
    function endGame(isWin) {
        gameStatus = isWin ? "won" : "lost";
        
        if (burnTimer) {
            clearInterval(burnTimer);
            burnTimer = null;
        }
        
        gameOverTitle.textContent = isWin ? "Forest Saved!" : "Forest Lost!";
        gameOverMessage.textContent = isWin 
            ? "You've successfully saved all the trees from burning!" 
            : "All the trees have burned down!";
        gameOverModal.style.display = "flex";
    }

    function resetGame() {
        if (burnTimer) {
            clearInterval(burnTimer);
            burnTimer = null;
        }
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
        
        gameOverModal.style.display = "none";
        
        const overlay = document.getElementById("countdownOverlay");
        const overlayParent = overlay ? overlay.parentNode : null;
        
        initGame();
        
        if (overlay && !document.getElementById("countdownOverlay") && overlayParent) {
            overlayParent.appendChild(overlay);
            if (typeof window.setupOverlay === 'function') {
                window.setupOverlay();
            }
        }
        
        setTimeout(() => {
            const newOverlay = document.getElementById("countdownOverlay");
            if (newOverlay) {
                newOverlay.style.display = "flex";
                const readySection = document.getElementById("readySection");
                const countdownSection = document.getElementById("countdownSection");
                if (readySection && countdownSection) {
                    readySection.style.display = "block";
                    countdownSection.style.display = "none";
                }
            }
        }, 0);
    }
    
    if (restartButton) {
        restartButton.addEventListener('click', resetGame);
    }
    
    if (playAgainButton) {
        playAgainButton.onclick = null;
        playAgainButton.addEventListener('click', resetGame);
    }

    document.addEventListener('keydown', handleKeyPress);
    
    function handleKeyPress(event) {
        const key = event.key.toLowerCase();
        
        if (gameStatus !== "playing") return;
        
        switch (key) {
            case 'w':
            case 'arrowup':
                movePlayer('w');
                break;
            case 'a':
            case 'arrowleft':
                movePlayer('a');
                break;
            case 's':
            case 'arrowdown':
                movePlayer('s');
                break;
            case 'd':
            case 'arrowright':
                movePlayer('d');
                break;
            case 'q':
            case 'o':
                pickupSapling();
                break;
            case 'e':
            case 'p':
                plantSapling();
                break;
        }
    }

    function cleanup() {
        if (burnTimer) {
            clearInterval(burnTimer);
            burnTimer = null;
        }
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
        document.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('resize', positionOverlay);
        window.removeEventListener('load', positionOverlay);
        window.removeEventListener('scroll', positionOverlay);
    }

    window.addEventListener('beforeunload', cleanup);

    restartButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', resetGame);

    initGame();
}
