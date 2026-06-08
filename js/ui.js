/**
 * ui.js
 * Handles DOM manipulation and user events for the board and page navigation.
 */

class UI {
    constructor(gameInstance) {
        this.game = gameInstance;
        
        // Pages
        this.landingPage = document.getElementById('landing-page');
        this.selectionPage = document.getElementById('selection-page');
        this.gamePage = document.getElementById('game-page');
        this.body = document.getElementById('app-body');
        
        // Nav Links
        this.navHome = document.getElementById('nav-home');
        this.btnNewGame = document.getElementById('btn-new-game');
        this.btnResetGame = document.getElementById('btn-reset-game');
        this.btnNavBack = document.getElementById('btn-nav-back');
        this.currentPage = 'landing';

        // Game Elements
        this.boardEl = document.getElementById('game-board');
        this.turnIndicator = document.getElementById('turn-indicator');
        this.statusEl = document.getElementById('game-status');
        this.statusText = document.getElementById('status-text');
        
        // Settings
        this.algoSelect = document.getElementById('algorithm-select');
        this.depthSlider = document.getElementById('depth-slider');
        this.depthValue = document.getElementById('depth-value');

        this.setupEventListeners();
        this.initBoard();
    }

    setupEventListeners() {
        // Page Navigation
        document.getElementById('btn-play-now').addEventListener('click', () => {
            this.playCyberSound();
            const btn = document.getElementById('btn-play-now');
            btn.classList.add('play-anim');
            setTimeout(() => {
                btn.classList.remove('play-anim');
                this.showPage('selection');
            }, 600);
        });

        document.getElementById('card-vertical').addEventListener('click', () => {
            this.playCyberSound();
            this.game.setHumanOrientation('vertical');
            this.showPage('game');
            this.game.reset(); // starts the game
        });

        document.getElementById('card-horizontal').addEventListener('click', () => {
            this.playCyberSound();
            this.game.setHumanOrientation('horizontal');
            this.showPage('game');
            this.game.reset();
        });

        this.navHome.addEventListener('click', (e) => {
            e.preventDefault();
            this.playCyberSound();
            this.showPage('landing');
        });

        document.getElementById('btn-back-landing').addEventListener('click', () => {
            this.playCyberSound();
            this.showPage('landing');
        });

        this.btnNavBack.addEventListener('click', (e) => {
            e.preventDefault();
            this.playCyberSound();
            if (this.currentPage === 'game') {
                this.showPage('selection');
            } else if (this.currentPage === 'selection') {
                this.showPage('landing');
            }
        });

        this.btnNewGame.addEventListener('click', (e) => {
            e.preventDefault();
            this.playCyberSound();
            this.showPage('selection');
        });

        this.btnResetGame.addEventListener('click', (e) => {
            e.preventDefault();
            this.playCyberSound();
            this.game.reset();
        });

        // Settings Listeners
        this.algoSelect.addEventListener('change', (e) => {
            this.game.setAlgorithm(e.target.value);
        });
        
        this.depthSlider.addEventListener('input', (e) => {
            this.depthValue.textContent = e.target.value;
            this.game.setDepth(parseInt(e.target.value));
        });
    }

    showPage(pageName) {
        // Hide all
        this.landingPage.classList.remove('active-page');
        this.selectionPage.classList.remove('active-page');
        this.gamePage.classList.remove('active-page');
        
        // Timeout to allow fade out before hiding completely
        setTimeout(() => {
            this.landingPage.classList.add('hidden');
            this.selectionPage.classList.add('hidden');
            this.gamePage.classList.add('hidden');
            
            // Show target
            this.currentPage = pageName;

            if (pageName === 'landing') {
                this.landingPage.classList.remove('hidden');
                setTimeout(() => this.landingPage.classList.add('active-page'), 50);
                this.body.className = 'bg-landing';
                this.btnNewGame.style.display = 'none';
                this.btnResetGame.style.display = 'none';
                this.btnNavBack.style.display = 'none';
            } else if (pageName === 'selection') {
                this.selectionPage.classList.remove('hidden');
                setTimeout(() => this.selectionPage.classList.add('active-page'), 50);
                this.body.className = 'bg-selection';
                this.btnNewGame.style.display = 'none';
                this.btnResetGame.style.display = 'none';
                this.btnNavBack.style.display = 'inline-block';
            } else if (pageName === 'game') {
                this.gamePage.classList.remove('hidden');
                setTimeout(() => this.gamePage.classList.add('active-page'), 50);
                this.body.className = 'bg-game';
                this.btnNewGame.style.display = 'inline-block';
                this.btnResetGame.style.display = 'inline-block';
                this.btnNavBack.style.display = 'inline-block';
            }
        }, 700); // 700ms matches transition time
    }

    initBoard() {
        this.boardEl.innerHTML = '';
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.r = r;
                cell.dataset.c = c;
                
                cell.addEventListener('mouseenter', () => this.handleHover(r, c));
                cell.addEventListener('mouseleave', () => this.clearHover());
                cell.addEventListener('click', () => this.handleClick(r, c));

                this.boardEl.appendChild(cell);
            }
        }
    }

    renderBoard(board) {
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                const cell = this.getCell(r, c);
                cell.className = 'cell'; // reset classes
                
                if (board.grid[r][c] === 1) { // Player 1 (Human)
                    cell.classList.add(this.game.humanOrientation === 'vertical' ? 'cyan' : 'orange');
                } else if (board.grid[r][c] === 2) { // Player 2 (AI)
                    cell.classList.add(this.game.humanOrientation === 'vertical' ? 'orange' : 'cyan');
                }
            }
        }
    }

    getCell(r, c) {
        return this.boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    }

    handleHover(r, c) {
        if (this.game.currentPlayer !== 1 || this.game.isGameOver) return;
        
        const isVertical = this.game.humanOrientation === 'vertical';
        
        if (isVertical) {
            if (r < 5 && this.game.board.grid[r][c] === 0 && this.game.board.grid[r+1][c] === 0) {
                this.getCell(r, c).classList.add('valid-hover-cyan');
                this.getCell(r+1, c).classList.add('valid-hover-cyan');
            }
        } else {
            if (c < 5 && this.game.board.grid[r][c] === 0 && this.game.board.grid[r][c+1] === 0) {
                this.getCell(r, c).classList.add('valid-hover-orange');
                this.getCell(r, c+1).classList.add('valid-hover-orange');
            }
        }
    }

    clearHover() {
        const hoveredCyan = this.boardEl.querySelectorAll('.valid-hover-cyan');
        hoveredCyan.forEach(cell => cell.classList.remove('valid-hover-cyan'));
        const hoveredOrange = this.boardEl.querySelectorAll('.valid-hover-orange');
        hoveredOrange.forEach(cell => cell.classList.remove('valid-hover-orange'));
    }

    handleClick(r, c) {
        if (this.game.currentPlayer !== 1 || this.game.isGameOver) return;

        const isVertical = this.game.humanOrientation === 'vertical';

        if (isVertical) {
            if (r < 5 && this.game.board.grid[r][c] === 0 && this.game.board.grid[r+1][c] === 0) {
                this.clearHover();
                this.game.playHumanMove({r, c});
            }
        } else {
            if (c < 5 && this.game.board.grid[r][c] === 0 && this.game.board.grid[r][c+1] === 0) {
                this.clearHover();
                this.game.playHumanMove({r, c});
            }
        }
    }

    updateTurnIndicator(player) {
        if (player === 1) {
            this.turnIndicator.textContent = `HUMAN'S TURN (${this.game.humanOrientation.toUpperCase()})`;
            this.turnIndicator.className = 'turn-indicator glass-panel human-turn';
        } else {
            const aiOrientation = this.game.humanOrientation === 'vertical' ? 'horizontal' : 'vertical';
            this.turnIndicator.textContent = `AI'S TURN (${aiOrientation.toUpperCase()}) ...`;
            this.turnIndicator.className = 'turn-indicator glass-panel ai-turn';
        }
    }

    showGameOver(winner) {
        this.statusEl.classList.remove('hidden');
        if (winner === 1) {
            this.statusText.textContent = "HUMAN WINS!";
            this.statusEl.className = 'game-status';
            this.playWinSound();
        } else {
            this.statusText.textContent = "YOU LOSE!";
            this.statusEl.className = 'game-status ai-win';
            this.playLoseSound();
        }
    }

    hideGameOver() {
        this.statusEl.classList.add('hidden');
    }

    playCyberSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            // Retro 8-bit sound style
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) {
            console.log("Audio not supported or blocked");
        }
    }

    playWinSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // Arpeggio kemenangan yang ceria
            const playNote = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
                
                gainNode.gain.setValueAtTime(0, ctx.currentTime + startTime);
                gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + startTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(ctx.currentTime + startTime);
                osc.stop(ctx.currentTime + startTime + duration);
            };
            
            playNote(440, 0, 0.2);     // A4
            playNote(554.37, 0.1, 0.2); // C#5
            playNote(659.25, 0.2, 0.4); // E5
            playNote(880, 0.3, 0.6);   // A5
            
        } catch (e) {
            console.log("Audio not supported or blocked");
        }
    }

    playLoseSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            const playTone = (freq1, freq2, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();
                osc.type = 'sawtooth'; // Gelombang agak kasar (harsh)
                
                // Efek nada turun perlahan (sedih)
                osc.frequency.setValueAtTime(freq1, ctx.currentTime + startTime);
                osc.frequency.linearRampToValueAtTime(freq2, ctx.currentTime + startTime + duration);
                
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(ctx.currentTime + startTime);
                osc.stop(ctx.currentTime + startTime + duration);
            };
            
            // "Teeee..." (nada pertama turun sedikit)
            playTone(300, 280, 0, 0.4);
            // "...Tooottt" (nada kedua turun drastis ke bawah)
            playTone(200, 100, 0.45, 0.8);
            
        } catch (e) {
            console.log("Audio not supported or blocked");
        }
    }
}
