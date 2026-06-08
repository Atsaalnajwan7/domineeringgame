/**
 * alphabeta.js
 * Implementation of Minimax algorithm with Alpha-Beta Pruning.
 */

class AlphaBeta {
    constructor(maxDepth) {
        this.maxDepth = maxDepth;
        this.nodesEvaluated = 0;
        this.prunedNodes = 0;
    }

    /**
     * Entry point for the algorithm.
     * @param {Board} board Current game board
     * @returns {Object} { bestMove, score, tree, nodesEvaluated, prunedNodes }
     */
    getBestMove(board) {
        this.nodesEvaluated = 0;
        this.prunedNodes = 0;
        const treeRoot = { move: null, score: 0, children: [], player: 2, depth: 0 };
        
        let bestScore = -Infinity;
        let bestMove = null;
        let alpha = -Infinity;
        let beta = Infinity;

        const legalMoves = board.getLegalMoves(2);
        
        if (legalMoves.length === 0) return { bestMove: null, score: -1000, tree: treeRoot, nodesEvaluated: this.nodesEvaluated, prunedNodes: this.prunedNodes };

        for (let i = 0; i < legalMoves.length; i++) {
            const move = legalMoves[i];
            board.placeMove(2, move);
            
            const childNode = { move: move, score: 0, children: [], player: 1, depth: 1 };
            treeRoot.children.push(childNode);
            
            const score = this.alphabeta(board, this.maxDepth - 1, alpha, beta, false, childNode, 2);
            childNode.score = score;

            board.undoMove(2, move);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }

            alpha = Math.max(alpha, bestScore);

            // Pruning condition at root (rare, but possible if initial moves are somehow bound)
            // Wait, alpha-beta at root doesn't prune standardly unless we had previous best knowns.
            // But we keep the structure just in case.
        }
        
        treeRoot.score = bestScore;
        treeRoot.bestMove = bestMove;
        
        return {
            bestMove,
            score: bestScore,
            tree: treeRoot,
            nodesEvaluated: this.nodesEvaluated,
            prunedNodes: this.prunedNodes
        };
    }

    /**
     * Alpha-Beta recursive function.
     */
    alphabeta(board, depth, alpha, beta, isMaximizing, treeNode, currentDepth) {
        this.nodesEvaluated++;

        const playerTurn = isMaximizing ? 2 : 1;
        const legalMoves = board.getLegalMoves(playerTurn);
        
        if (depth === 0 || legalMoves.length === 0) {
            return board.evaluate();
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < legalMoves.length; i++) {
                const move = legalMoves[i];
                board.placeMove(2, move);
                
                let childNode = null;
                if (currentDepth < 3) {
                    childNode = { move: move, score: 0, children: [], player: 1, depth: currentDepth + 1 };
                    treeNode.children.push(childNode);
                }

                const evalScore = this.alphabeta(board, depth - 1, alpha, beta, false, childNode || {}, currentDepth + 1);
                
                if (childNode) childNode.score = evalScore;

                maxEval = Math.max(maxEval, evalScore);
                board.undoMove(2, move);

                alpha = Math.max(alpha, evalScore);
                
                if (beta <= alpha) {
                    this.prunedNodes += (legalMoves.length - 1 - i); // roughly counting pruned branches
                    if (currentDepth < 3) {
                        treeNode.children.push({ isPruned: true, note: `Pruned ${legalMoves.length - 1 - i} branches` });
                    }
                    break; // Prune
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < legalMoves.length; i++) {
                const move = legalMoves[i];
                board.placeMove(1, move);
                
                let childNode = null;
                if (currentDepth < 3) {
                    childNode = { move: move, score: 0, children: [], player: 2, depth: currentDepth + 1 };
                    treeNode.children.push(childNode);
                }

                const evalScore = this.alphabeta(board, depth - 1, alpha, beta, true, childNode || {}, currentDepth + 1);
                
                if (childNode) childNode.score = evalScore;

                minEval = Math.min(minEval, evalScore);
                board.undoMove(1, move);

                beta = Math.min(beta, evalScore);
                
                if (beta <= alpha) {
                    this.prunedNodes += (legalMoves.length - 1 - i);
                    if (currentDepth < 3) {
                        treeNode.children.push({ isPruned: true, note: `Pruned ${legalMoves.length - 1 - i} branches` });
                    }
                    break; // Prune
                }
            }
            return minEval;
        }
    }
}
