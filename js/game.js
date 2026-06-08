/**
 * game.js
 * Main Game Loop controller.
 */

class Game {
    constructor() {
        this.humanOrientation = 'vertical'; // default
        this.board = new Board(this.humanOrientation);
        this.currentPlayer = 1; // 1 = Human, 2 = AI
        this.isGameOver = false;
        
        this.algorithm = 'alphabeta';
        this.searchDepth = 3;

        this.statsUI = new StatisticsUI();
        this.treeVisualizer = new GameTreeVisualizer('tree-visualizer');
        this.ui = new UI(this);

        // Start on landing page
        this.ui.showPage('landing');
    }

    setHumanOrientation(orientation) {
        this.humanOrientation = orientation;
    }

    setAlgorithm(algo) {
        this.algorithm = algo;
    }

    setDepth(depth) {
        this.searchDepth = depth;
    }

    reset() {
        this.board = new Board(this.humanOrientation);
        this.currentPlayer = 1;
        this.isGameOver = false;
        this.statsUI.reset();
        document.getElementById('tree-visualizer').innerHTML = '<div class="tree-placeholder">Menunggu langkah AI...</div>';
        this.ui.hideGameOver();
        this.ui.renderBoard(this.board);
        this.ui.updateTurnIndicator(this.currentPlayer);
        this.checkTerminalState();
    }

    playHumanMove(move) {
        if (this.currentPlayer !== 1 || this.isGameOver) return;

        this.board.placeMove(1, move);
        this.ui.renderBoard(this.board);
        
        if (!this.checkTerminalState()) {
            this.currentPlayer = 2;
            this.ui.updateTurnIndicator(this.currentPlayer);
            
            // Allow UI to update before AI starts heavy computation
            setTimeout(() => this.playAIMove(), 50);
        }
    }

    playAIMove() {
        if (this.currentPlayer !== 2 || this.isGameOver) return;

        let ai;
        if (this.algorithm === 'alphabeta') {
            ai = new AlphaBeta(this.searchDepth);
        } else {
            ai = new Minimax(this.searchDepth);
        }

        const startTime = performance.now();
        const result = ai.getBestMove(this.board);
        const endTime = performance.now();

        // Update stats
        this.statsUI.update({
            nodesEvaluated: result.nodesEvaluated,
            prunedNodes: result.prunedNodes || 0,
            executionTime: endTime - startTime,
            bestScore: result.score
        });

        // Render Tree
        this.treeVisualizer.render(result.tree, result.bestMove);

        if (result.bestMove) {
            this.board.placeMove(2, result.bestMove);
            this.ui.renderBoard(this.board);
            
            if (!this.checkTerminalState()) {
                this.currentPlayer = 1;
                this.ui.updateTurnIndicator(this.currentPlayer);
                this.checkTerminalState(); // Check if human can move
            }
        } else {
            this.checkTerminalState();
        }
    }

    checkTerminalState() {
        // Current player loses if they have no legal moves
        if (!this.board.hasLegalMoves(this.currentPlayer)) {
            this.isGameOver = true;
            const winner = this.currentPlayer === 1 ? 2 : 1;
            this.ui.showGameOver(winner);
            return true;
        }
        return false;
    }
}

// Initialize Game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.domineeringGame = new Game();
});
