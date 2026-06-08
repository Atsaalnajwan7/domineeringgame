/**
 * statistics.js
 * Handles updating the statistics UI.
 */

class StatisticsUI {
    constructor() {
        this.nodesEl = document.getElementById('stat-nodes');
        this.prunedEl = document.getElementById('stat-pruned');
        this.timeEl = document.getElementById('stat-time');
        this.scoreEl = document.getElementById('stat-score');
    }

    update(stats) {
        if (stats.nodesEvaluated !== undefined) {
            this.nodesEl.textContent = stats.nodesEvaluated.toLocaleString();
        }
        if (stats.prunedNodes !== undefined) {
            this.prunedEl.textContent = stats.prunedNodes.toLocaleString();
        }
        if (stats.executionTime !== undefined) {
            this.timeEl.textContent = `${stats.executionTime.toFixed(2)} ms`;
        }
        if (stats.bestScore !== undefined) {
            this.scoreEl.textContent = stats.bestScore;
        }
    }

    reset() {
        this.nodesEl.textContent = '0';
        this.prunedEl.textContent = '0';
        this.timeEl.textContent = '0 ms';
        this.scoreEl.textContent = '0';
    }
}
