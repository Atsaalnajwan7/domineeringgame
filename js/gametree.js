/**
 * gametree.js
 * Visualizes the Minimax/Alpha-Beta search tree in the UI.
 */

class GameTreeVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    /**
     * Renders the tree data structure to the DOM.
     * @param {Object} treeRoot 
     * @param {Object} bestMove 
     */
    render(treeRoot, bestMove) {
        this.container.innerHTML = '';
        
        if (!treeRoot || !treeRoot.children || treeRoot.children.length === 0) {
            this.container.innerHTML = '<div class="tree-placeholder">No moves evaluated.</div>';
            return;
        }

        const ul = this.buildNodeElement(treeRoot, bestMove);
        ul.classList.add('tree-ul');
        this.container.appendChild(ul);
    }

    /**
     * Recursively builds HTML elements for the tree.
     */
    buildNodeElement(nodeData, bestMove) {
        const ul = document.createElement('ul');
        
        // Root or current node
        const li = document.createElement('li');
        li.classList.add('tree-li');

        const div = document.createElement('div');
        div.classList.add('tree-node');
        
        if (nodeData.isPruned) {
            div.classList.add('pruned');
            div.innerHTML = `<span class="score">PRUNED</span><br><small>${nodeData.note}</small>`;
        } else {
            // Check if this node is part of the best path (at depth 1)
            if (nodeData.depth === 1 && bestMove && nodeData.move.r === bestMove.r && nodeData.move.c === bestMove.c) {
                div.classList.add('best-path');
            }

            const moveText = nodeData.move ? `(${nodeData.move.r},${nodeData.move.c})` : 'ROOT';
            const playerText = nodeData.player === 1 ? 'Human' : 'AI';
            
            div.innerHTML = `
                ${moveText}<br>
                Score: <span class="score">${nodeData.score}</span>
            `;
        }
        
        li.appendChild(div);

        // Children
        if (nodeData.children && nodeData.children.length > 0) {
            const childrenUl = document.createElement('ul');
            childrenUl.classList.add('tree-ul');
            
            nodeData.children.forEach(child => {
                const childLi = this.buildNodeElement(child, bestMove);
                // The returned element is a UL with one LI, so we extract the LI
                childrenUl.appendChild(childLi.firstChild);
            });
            
            li.appendChild(childrenUl);
        }

        ul.appendChild(li);
        return ul;
    }
}
