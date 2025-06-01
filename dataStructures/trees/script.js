// Initialize AOS
AOS.init({ duration: 1000 });

// Tree Node class
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree class
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new TreeNode(value);

        if (this.root === null) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (current.left === null) {
                    current.left = newNode;
                    break;
                }
                current = current.left;
            } else {
                if (current.right === null) {
                    current.right = newNode;
                    break;
                }
                current = current.right;
            }
        }
    }

    clear() {
        this.root = null;
    }

    getHeight(node = this.root) {
        if (node === null) return 0;
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    isBalanced(node = this.root) {
        if (node === null) return true;

        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);

        if (Math.abs(leftHeight - rightHeight) <= 1 &&
            this.isBalanced(node.left) &&
            this.isBalanced(node.right)) {
            return true;
        }

        return false;
    }

    toArray(node = this.root, arr = []) {
        if (node !== null) {
            this.toArray(node.left, arr);
            arr.push(node.value);
            this.toArray(node.right, arr);
        }
        return arr;
    }

    fromArray(arr) {
        this.root = null;
        const sortedArr = [...new Set(arr)].sort((a, b) => a - b);
        
        const buildBalanced = (start, end) => {
            if (start > end) return null;
            
            const mid = Math.floor((start + end) / 2);
            const node = new TreeNode(sortedArr[mid]);
            
            node.left = buildBalanced(start, mid - 1);
            node.right = buildBalanced(mid + 1, end);
            
            return node;
        };
        
        this.root = buildBalanced(0, sortedArr.length - 1);
    }
}

// Initialize the tree
const tree = new BinarySearchTree();

// SVG dimensions
const width = 1000;
const height = 600;

// Create the SVG container
const svg = d3.select('#treeCanvas')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${width/2},60)`);

// Helper function to create a tree layout
function createTreeLayout(root) {
    // Create the tree layout
    const treeLayout = d3.tree()
        .size([width * 0.8, height * 0.8])
        .nodeSize([60, 80]);

    // Create hierarchy and calculate layout
    const rootHierarchy = d3.hierarchy(root);
    treeLayout(rootHierarchy);

    // Center the tree horizontally
    let xMin = Infinity;
    let xMax = -Infinity;
    rootHierarchy.each(d => {
        if (d.x < xMin) xMin = d.x;
        if (d.x > xMax) xMax = d.x;
    });
    
    const xOffset = -(xMax + xMin) / 2;
    rootHierarchy.each(d => {
        d.x += xOffset;
    });

    return rootHierarchy;
}

// Update the visualization
function updateVisualization() {
    // Clear the SVG
    svg.selectAll('*').remove();

    if (!tree.root) return;

    // Create the tree layout
    const root = createTreeLayout(tree.root);

    // Create links
    const links = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', 'var(--primary-color)')
        .attr('stroke-opacity', 0.7)
        .attr('stroke-width', 2)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    // Create nodes
    const nodes = svg.append('g')
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.x},${d.y})`);

    // Add circles to nodes
    nodes.append('circle')
        .attr('r', 25)
        .attr('fill', 'var(--primary-color)')
        .attr('stroke', 'var(--text-light)')
        .attr('stroke-width', 2);

    // Add text to nodes
    nodes.append('text')
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--text-light)')
        .style('font-size', '14px')
        .style('font-family', "'Poppins', sans-serif")
        .text(d => d.data.value);

    // Add hover effects
    nodes.on('mouseover', function() {
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', 28)
            .attr('fill', 'var(--secondary-color)');
    }).on('mouseout', function() {
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', 25)
            .attr('fill', 'var(--primary-color)');
    });

    // Update tree information
    document.getElementById('nodeCount').textContent = root.descendants().length;
    document.getElementById('treeHeight').textContent = tree.getHeight();
    document.getElementById('isBalanced').textContent = tree.isBalanced() ? 'Yes' : 'No';
}

// Add node to the tree
function addNode() {
    const input = document.getElementById('nodeValue');
    const value = parseInt(input.value);

    if (!isNaN(value)) {
        tree.insert(value);
        updateVisualization();
        input.value = '';
    }
}

// Clear the tree
function clearTree() {
    tree.clear();
    updateVisualization();
}

// Balance the tree
function balanceTree() {
    const values = tree.toArray();
    tree.fromArray(values);
    updateVisualization();
}

// Handle Enter key press
document.getElementById('nodeValue').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addNode();
    }
}); 