/**
 * board.js
 * Manages the Domineering game board state (6x6).
 */

class Board {
    constructor(humanOrientation = 'vertical') {
        this.size = 6;
        this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
        // 0 = empty, 1 = player 1 (Human), 2 = player 2 (AI)
        this.humanOrientation = humanOrientation;
    }

    /**
     * Get all legal moves for a given player.
     */
    getLegalMoves(player) {
        const moves = [];
        const isHuman = player === 1;
        
        // If human is vertical, AI is horizontal. If human is horizontal, AI is vertical.
        const isVertical = (isHuman && this.humanOrientation === 'vertical') || 
                           (!isHuman && this.humanOrientation === 'horizontal');

        if (isVertical) {
            for (let r = 0; r < this.size - 1; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (this.grid[r][c] === 0 && this.grid[r + 1][c] === 0) {
                        moves.push({ r, c });
                    }
                }
            }
        } else {
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size - 1; c++) {
                    if (this.grid[r][c] === 0 && this.grid[r][c + 1] === 0) {
                        moves.push({ r, c });
                    }
                }
            }
        }
        return moves;
    }

    /**
     * Place a domino on the board.
     */
    placeMove(player, move) {
        const { r, c } = move;
        const isHuman = player === 1;
        const isVertical = (isHuman && this.humanOrientation === 'vertical') || 
                           (!isHuman && this.humanOrientation === 'horizontal');

        if (isVertical) {
            this.grid[r][c] = player;
            this.grid[r + 1][c] = player;
        } else {
            this.grid[r][c] = player;
            this.grid[r][c + 1] = player;
        }
    }

    /**
     * Undo a move.
     */
    undoMove(player, move) {
        const { r, c } = move;
        const isHuman = player === 1;
        const isVertical = (isHuman && this.humanOrientation === 'vertical') || 
                           (!isHuman && this.humanOrientation === 'horizontal');

        if (isVertical) {
            this.grid[r][c] = 0;
            this.grid[r + 1][c] = 0;
        } else {
            this.grid[r][c] = 0;
            this.grid[r][c + 1] = 0;
        }
    }

    /**
     * Heuristic Evaluation Function.
     * Score = (Number of legal moves for AI) - (Number of legal moves for Human)
     */
    evaluate() {
        const aiMoves = this.getLegalMoves(2).length;
        const humanMoves = this.getLegalMoves(1).length;
        return aiMoves - humanMoves;
    }

    /**
     * Checks if the given player has any moves left.
     */
    hasLegalMoves(player) {
        return this.getLegalMoves(player).length > 0;
    }

    /**
     * Create a deep copy of the board.
     */
    clone() {
        const newBoard = new Board(this.humanOrientation);
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                newBoard.grid[r][c] = this.grid[r][c];
            }
        }
        return newBoard;
    }
}
