
const DIFFICULTY_SETTINGS = {
    easy: {
        name: "Eco-Friendly",
        gridSize: 5,
        burnInterval: 4500, 
        saplingTeleport: false,
        obstacles: 0,
        keyPressRequirement: 1, 
        treePercentage: 0.6,
        burningPercentage: 0.15
    },
    medium: {
        name: "Sustainable",
        gridSize: 6,
        burnInterval: 4500, 
        saplingTeleport: true,
        obstacles: 0,
        keyPressRequirement: 1,
        treePercentage: 0.65,
        burningPercentage: 0.15
    },
    hard: {
        name: "Drought",
        gridSize: 8,
        burnInterval: 2000, 
        saplingTeleport: true,
        obstacles: 5,
        keyPressRequirement: 1,
        treePercentage: 0.7,
        burningPercentage: 0.2
    },
    wrath: {
        name: "Polluted",
        gridSize: 12,
        burnInterval: 2000, 
        saplingTeleport: true,
        obstacles: 20,
        keyPressRequirement: 3, 
        treePercentage: 0.75,
        burningPercentage: 0.25
    }
};

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

const CELL_TYPES = {
    EMPTY: "empty",
    TREE: "tree",
    BURNING: "burning",
    PLAYER: "player", 
    SAPLING: "sapling",
    OBSTACLE: "obstacle"
};

document.addEventListener('DOMContentLoaded', function() {
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
        
        const gridSize = settings.gridSize;
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(CELL_TYPES.EMPTY));
        gameGridElement.innerHTML = "";
        gameGridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gameGridElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                
                const cell = document.createElement("div");
                cell.id = `cell-${row}-${col}`;
                cell.className = "grid-cell cell-empty";
                gameGridElement.appendChild(cell);
            }
        }
        
        hasSapling = false;
        gameStatus = "starting";
        keyPressCount = 0;
        
        if (settings.obstacles > 0) {
            placeObstacles();
        }
        placeInitialTrees();
        placePlayer();
        placeSapling();
        updateUI();
        showReadyScreen();
    }

    function placeObstacles() {
        const gridSize = settings.gridSize;
        let placedObstacles = 0;
        while (placedObstacles < settings.obstacles) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            if (grid[row][col] === CELL_TYPES.EMPTY) {
                grid[row][col] = CELL_TYPES.OBSTACLE;
                placedObstacles++;
            }
        }
    }

    function placeInitialTrees() {
        const gridSize = settings.gridSize;
        const totalCells = gridSize * gridSize;
        const obstacleCount = settings.obstacles;
        const availableCells = totalCells - obstacleCount;
        const treesCount = Math.floor(availableCells * settings.treePercentage);
        let placedTrees = 0;
        while (placedTrees < treesCount) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            if (grid[row][col] === CELL_TYPES.EMPTY) {
                grid[row][col] = CELL_TYPES.TREE;
                placedTrees++;
            }
        }
        
        const burningCount = Math.floor(treesCount * settings.burningPercentage);
        let placedBurning = 0;
        while (placedBurning < burningCount) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            if (grid[row][col] === CELL_TYPES.TREE) {
                grid[row][col] = CELL_TYPES.BURNING;
                placedBurning++;
            }
        }
        healthyTreesCount = placedTrees - placedBurning;
        burningTreesCount = placedBurning;
    }

    function placePlayer() {
        const gridSize = settings.gridSize;
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            if (grid[row][col] === CELL_TYPES.EMPTY) {
                playerPosition = { row, col };
                placed = true;
            }
        }
    }

    function placeSapling() {
        const gridSize = settings.gridSize;
        if (!settings.saplingTeleport && initialSaplingPosition.row !== 0) {
            saplingPosition = { ...initialSaplingPosition };
            return;
        }
        let placed = false;
        
        while (!placed) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            
            if (grid[row][col] === CELL_TYPES.EMPTY && 
                (row !== playerPosition.row || col !== playerPosition.col)) {
                saplingPosition = { row, col };
                
                if (!settings.saplingTeleport) {
                    initialSaplingPosition = { ...saplingPosition };
                }
                placed = true;
            }
        }
    }

    function updateUI() {
        const gridSize = settings.gridSize;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                cell.classList.remove("cell-empty", "cell-tree", "cell-burning", "cell-player", "cell-sapling", "cell-obstacle");
                cell.classList.add(`cell-${grid[row][col]}`);
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
        playerCell.classList.add("cell-player");
        playerCell.textContent = "🧑‍🚒";
        
        if (!hasSapling || !settings.saplingTeleport) {
            const saplingCell = document.getElementById(`cell-${saplingPosition.row}-${saplingPosition.col}`);
            if (saplingCell && !saplingCell.classList.contains("cell-player")) {
                saplingCell.classList.add("cell-sapling");
                saplingCell.textContent = "🌱";
            }
        }
        treesCountElement.textContent = healthyTreesCount;
        burningCountElement.textContent = burningTreesCount;
        saplingStatusElement.textContent = hasSapling ? "✅" : "❌";
    }
    
    function showReadyScreen() {
        gameStatus = "starting";
        const readySection = document.getElementById("readySection");
        const countdownSection = document.getElementById("countdownSection");
        positionOverlay();
        readySection.style.display = "block";
        countdownSection.style.display = "none";
        countdownOverlay.style.display = "flex";
        
        document.getElementById("readyButton").addEventListener("click", function() {
            readySection.style.display = "none";
            countdownSection.style.display = "block";
            startCountdown();
        }, { once: true }); 
    }

    function startCountdown() {
        gameStatus = "starting";
        countdown = 3;
        document.getElementById("countdownTimer").textContent = countdown;
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
        burnTimer = setInterval(() => {
            burnRandomTree();
        }, settings.burnInterval);
        showMessage(`${settings.name} Mode: Save the forest!`);
    }

    
    function burnRandomTree() {
        if (gameStatus !== "playing" || healthyTreesCount === 0) return;
        const healthyTrees = [];
        const gridSize = settings.gridSize;

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === CELL_TYPES.TREE) {
                    healthyTrees.push({ row, col });
                }
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
            // Chicanery
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
        clearInterval(burnTimer);
        gameOverTitle.textContent = isWin ? "Forest Saved!" : "Forest Lost!";
        gameOverMessage.textContent = isWin 
            ? "You've successfully saved all the trees from burning!" 
            : "All the trees have burned down!";
        gameOverModal.style.display = "flex";
    }

    function resetGame() {
        clearInterval(burnTimer);
        clearInterval(countdownTimer);
        gameOverModal.style.display = "none";
        initGame();
    }

    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        switch (key) {
            case 'w':
            case 'a':
            case 's':
            case 'd':
                movePlayer(key);
                break;
            case 'q':
                pickupSapling();
                break;
            case 'e':
                plantSapling();
                break;
        }
    });

    restartButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', resetGame);

    window.addEventListener('resize', positionOverlay);
    window.addEventListener('load', positionOverlay);
    window.addEventListener('scroll', positionOverlay);

    initGame();
});