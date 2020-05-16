// Tree Object, will act as wrapper for root node -- required:
// root initially set to node

//add node method on tree object
//check against root node, if not set, set as root, otherwise,
//if less, go left -- parent.left is the node
//if higher, go right -- parent.right is the node

const grid = document.querySelector(".grid");
let tester = [];

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    // this.positionX = null;
    // this.positionY = null;
    this.rowCell = null;
    this.colCell = null;
    // this.arrayOfNodes = [];
  }
  createDom() {
    let nodeEl = document.createElement("inline-block");
    // nodeEl.style.left = this.positionX;
    // nodeEl.style.top = this.positionY;
    nodeEl.style.gridColumnStart = `${this.colCell}`;
    nodeEl.style.gridRowStart = `${this.rowCell}`;
    nodeEl.innerText = `${this.value}`;
    nodeEl.id = this.value;
    nodeEl.classList.add("node");
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
      curNode.colCell = 4;
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
    const nodeDom = document.getElementById(`${nodeToRemove.value}`);

    if (!nodeToRemove) {
      console.log("Node not found");
    } else if (value === this.root.value) {
      this.root = removedNodeChildren;
      this.root = null;
    } else {
      if (parent.right) {
        if (parent.right.value === nodeToRemove.value) {
          parent.right = removedNodeChildren;
          // this.adjustPosition("right", removedNodeChildren);
        }
      } else {
        parent.left = removedNodeChildren;
        // this.adjustPosition("left", removedNodeChildren);
      }
    }

    grid.removeChild(nodeDom);
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
    if (node.right) {
      let leftestNode = this.mostLeft(node.right);
      leftestNode.left = node.left;
      leftestNode.left.colCell = leftestNode.colCell - 1;
      leftestNode.left.rowCell = leftestNode.rowCell + 1;
      //coming from right side
      this.adjustPosition("right", node.right);
      return node.right;
    } else {
      this.adjustPosition("left", node.left);
      return node.left;
      //coming from left side
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
    this.arrayNodes(subBranch);
    let nodeArr = tester;
    if (dir === "right") {
      nodeArr.forEach((node) => {
        console.log(node);
        node.colCell -= 1;
        node.rowCell -= 1;
      });
    } else {
      nodeArr.forEach((node) => {
        console.log(node);
        node.colCell += 1;
        node.rowCell -= 1;
      });
    }
  }
  //tester array not having correct node list
  arrayNodes(branch) {
    let firstNode = branch;
    if (!firstNode.right && !firstNode.left) {
      return;
    } else if (firstNode.left && firstNode.right) {
      tester.push(firstNode);
      this.arrayNodes(firstNode.right);
      this.arrayNodes(firstNode.left);
    } else if (firstNode.right) {
      tester.push(firstNode);
      this.arrayNodes(firstNode.right);
    } else if (firstNode.left) {
      tester.push(firstNode);
      this.arrayNodes(firstNode.left);
    }
    console.log(this.arrayOfNodes);
    //need someway of clearing array
  }
}

let tree = new Tree();
// setInterval(render(), 1000);
