/**
 * minimax.js
 * Implementation of standard Minimax algorithm without pruning.
 */

class Minimax {
    constructor(maxDepth) {
        this.maxDepth = maxDepth;
        this.nodesEvaluated = 0;
    }

    /**
     * Entry point for the algorithm.
     * @param {Board} board Current game board
     * @returns {Object} { bestMove, score, tree, nodesEvaluated }
     */
    getBestMove(board) {
        this.nodesEvaluated = 0;
        const treeRoot = { move: null, score: 0, children: [], player: 2, depth: 0 };
        
        let bestScore = -Infinity;
        let bestMove = null;

        const legalMoves = board.getLegalMoves(2);
        
        // If no moves, return null
        if (legalMoves.length === 0) return { bestMove: null, score: -1000, tree: treeRoot, nodesEvaluated: this.nodesEvaluated };

        for (const move of legalMoves) {
            board.placeMove(2, move);
            
            const childNode = { move: move, score: 0, children: [], player: 1, depth: 1 };
            treeRoot.children.push(childNode);
            
            const score = this.minimax(board, this.maxDepth - 1, false, childNode, 2);
            childNode.score = score;

            board.undoMove(2, move);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        treeRoot.score = bestScore;
        treeRoot.bestMove = bestMove;
        
        return {
            bestMove,
            score: bestScore,
            tree: treeRoot,
            nodesEvaluated: this.nodesEvaluated
        };
    }

    /**
     * Minimax recursive function.
     * @param {Board} board 
     * @param {number} depth 
     * @param {boolean} isMaximizing True for AI (Player 2), False for Human (Player 1)
     * @param {Object} treeNode Reference to the current node in the visualization tree
     * @param {number} currentDepth Current depth in the tree for UI limits
     */
    minimax(board, depth, isMaximizing, treeNode, currentDepth) {
        this.nodesEvaluated++;

        // Terminal states or max depth reached
        const playerTurn = isMaximizing ? 2 : 1;
        const legalMoves = board.getLegalMoves(playerTurn);
        
        if (depth === 0 || legalMoves.length === 0) {
            return board.evaluate();
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of legalMoves) {
                board.placeMove(2, move);
                
                // Only build full tree for first 3 levels to avoid memory/DOM explosion
                let childNode = null;
                if (currentDepth < 3) {
                    childNode = { move: move, score: 0, children: [], player: 1, depth: currentDepth + 1 };
                    treeNode.children.push(childNode);
                }

                const evalScore = this.minimax(board, depth - 1, false, childNode || {}, currentDepth + 1);
                
                if (childNode) childNode.score = evalScore;

                maxEval = Math.max(maxEval, evalScore);
                board.undoMove(2, move);
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of legalMoves) {
                board.placeMove(1, move);
                
                let childNode = null;
                if (currentDepth < 3) {
                    childNode = { move: move, score: 0, children: [], player: 2, depth: currentDepth + 1 };
                    treeNode.children.push(childNode);
                }

                const evalScore = this.minimax(board, depth - 1, true, childNode || {}, currentDepth + 1);
                
                if (childNode) childNode.score = evalScore;

                minEval = Math.min(minEval, evalScore);
                board.undoMove(1, move);
            }
            return minEval;
        }
    }
}
