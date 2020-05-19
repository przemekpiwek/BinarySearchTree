// Tree Object, will act as wrapper for root node -- required:
// root initially set to node

//add node method on tree object
//check against root node, if not set, set as root, otherwise,
//if less, go left -- parent.left is the node
//if higher, go right -- parent.right is the node

const grid = document.querySelector(".grid");
const addButt = document.querySelector("#addButton");
const remButt = document.querySelector("#removeButton");
const addInput = document.querySelector("#addNodeInput");
const remInput = document.querySelector("#removeNodeInput");
let tester = [];

addButt.addEventListener("click", addNodeHandler);
remButt.addEventListener("click", remNodeHandler);

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    // this.positionX = null;
    // this.positionY = null;
    this.rowCell = null;
    this.colCell = null;
  }
  createDom() {
    let nodeEl = document.createElement("inline-block");
    let nodeText = document.createElement("p");
    // nodeEl.style.left = this.positionX;
    // nodeEl.style.top = this.positionY;
    nodeEl.style.gridColumnStart = `${this.colCell}`;
    nodeEl.style.gridRowStart = `${this.rowCell}`;
    nodeText.innerText = `${this.value}`;
    nodeEl.id = this.value;
    nodeEl.classList.add("node");
    nodeEl.appendChild(nodeText);
    grid.appendChild(nodeEl);
  }
}

class Tree {
  constructor() {
    this.root = null;
  }
  addNode(value) {
    let newNode = new Node(value);
    let curNode;

    if (this.root === null) {
      this.root = newNode;
      curNode = newNode;
      curNode.rowCell = 1;
      curNode.colCell = 6;
      // curNode.positionX = `${window.innerWidth / 2 - 50}px`;
      // curNode.positionY = "0px";
    } else {
      curNode = this.searchForNode(value)["curNode"];
      if (curNode.value > newNode.value) {
        curNode.left = newNode;
        newNode.rowCell = curNode.rowCell + 1;
        newNode.colCell = curNode.colCell - 1;
        // newNode.positionX = `${parseInt(curNode.positionX, 10) - 100}px`;
        // newNode.positionY = `${parseInt(curNode.positionY, 10) + 100}px`;
      } else {
        curNode.right = newNode;
        newNode.rowCell = curNode.rowCell + 1;
        newNode.colCell = curNode.colCell + 1;
        // newNode.positionX = `${parseInt(curNode.positionX, 10) + 100}px`;
        // newNode.positionY = `${parseInt(curNode.positionY, 10) + 100}px`;
      }
    }
    newNode.createDom();
  }
  removeNode(value) {
    const { curNode, parent } = this.searchForNode(value);
    const nodeToRemove = curNode;
    const removedNodeChildren = this.mergeSubBranch(nodeToRemove);
    const removedNodeDom = document.getElementById(`${nodeToRemove.value}`);
    console.log(`removing node ${nodeToRemove}`);
    console.log(`removing node children ${removedNodeChildren}`);
    if (!nodeToRemove) {
      console.log("Node not found");
    } else if (value === this.root.value) {
      this.root = removedNodeChildren;
      this.root = null;
    } else {
      if (parent.right) {
        if (parent.right.value === nodeToRemove.value) {
          parent.right = removedNodeChildren;
        }
      } else {
        parent.left = removedNodeChildren;
      }
    }

    grid.removeChild(removedNodeDom);
  }
  searchForNode(value) {
    let testNode = this.root;
    let curNode;
    let parent;

    while (testNode) {
      parent = curNode;
      curNode = testNode;
      if (curNode.value === value) {
        break;
      }
      testNode = testNode.value > value ? curNode.left : curNode.right;
    }
    return { curNode, parent };
  }
  mergeSubBranch(node) {
    //does not include the node in argument
    if (node.right) {
      if (node.left) {
        let leftestNodeOfRight = this.mostLeft(node.right);
        leftestNodeOfRight.left = node.left;
        this.adjustPosition("move left branch", leftestNodeOfRight.left);
        this.adjustPosition("from right", node.right);
        return node.right;
      } else {
        this.adjustPosition("from left", node.left);
        return node.left;
      }
    }
  }
  mostLeft(node) {
    if (!node.left) {
      return node;
    } else {
      let curNode = node;
      let lastNode;
      while (curNode) {
        lastNode = curNode;
        curNode = lastNode.left;
      }
      return lastNode;
    }
  }
  adjustPosition(dir, subBranch) {
    //adjusting the row and column position of all cells in new branch
    if (!subBranch) {
      return;
    } else {
      this.arrayNodes(subBranch);
      let nodeArr = tester;
      if (dir === "from right") {
        nodeArr.forEach((node) => {
          const nodeDom = document.getElementById(`${node.value}`);
          node.colCell -= 1;
          node.rowCell -= 1;
          nodeDom.style.gridColumnStart = node.colCell;
          nodeDom.style.gridRowStart = node.rowCell;
        });
      } else if (dir === "from left") {
        nodeArr.forEach((node) => {
          const nodeDom = document.getElementById(`${node.value}`);
          node.colCell += 1;
          node.rowCell -= 1;
          nodeDom.style.gridColumnStart = node.colCell;
          nodeDom.style.gridRowStart = node.rowCell;
        });
      } else if (dir === "move left branch") {
        nodeArr.forEach((node) => {
          const nodeDom = document.getElementById(`${node.value}`);
          node.colCell += 1;
          node.rowCell += 1;
          nodeDom.style.gridColumnStart = node.colCell;
          nodeDom.style.gridRowStart = node.rowCell;
        });
      }
      tester = [];
    }
  }
  //tester array not having correct node list
  arrayNodes(node) {
    tester.push(node);
    if (!node.right && !node.left) {
      return;
    } else if (node.left && node.right) {
      this.arrayNodes(node.right);
      this.arrayNodes(node.left);
    } else if (!node.left) {
      this.arrayNodes(node.right);
    } else if (!node.right) {
      this.arrayNodes(node.left);
    }
  }
}

let tree = new Tree();

// function render() {}
function addNodeHandler() {
  if (addInput.value) {
    tree.addNode(addInput.value);
    addInput.value = null;
  }
}
function remNodeHandler() {
  tree.removeNode(remInput.value);
  remInput.value = null;
}
