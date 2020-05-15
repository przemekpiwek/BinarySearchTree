// Tree Object, will act as wrapper for root node -- required:
// root initially set to node

//add node method on tree object
//check against root node, if not set, set as root, otherwise,
//if less, go left -- parent.left is the node
//if higher, go right -- parent.right is the node

const body = document.querySelector("body");

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.positionX = null;
    this.positionY = null;
  }
  createDom() {
    let nodeEl = document.createElement("inline-block");
    nodeEl.style.left = this.positionX;
    nodeEl.style.top = this.positionY;
    nodeEl.innerText = `${this.value}`;
    nodeEl.id = this.value;
    nodeEl.classList.add("node");
    body.appendChild(nodeEl);
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
      curNode.positionX = `${window.innerWidth / 2 - 50}px`;
      curNode.positionY = "0px";
    } else {
      curNode = this.searchForNode(value)["curNode"];
      if (curNode.value > newNode.value) {
        curNode.left = newNode;
        newNode.positionX = `${parseInt(curNode.positionX, 10) - 100}px`;
        newNode.positionY = `${parseInt(curNode.positionY, 10) + 100}px`;
      } else {
        curNode.right = newNode;
        newNode.positionX = `${parseInt(curNode.positionX, 10) + 100}px`;
        newNode.positionY = `${parseInt(curNode.positionY, 10) + 100}px`;
      }
    }
    newNode.createDom();
  }
  removeNode(value) {
    const { curNode, parent } = this.searchForNode(value);
    const nodeToRemove = curNode;
    const removedNodeChildren = this.mergeSubBranch(nodeToRemove);
    const nodeDom = document.getElementById(`${nodeToRemove.value}`);
    console.log(parent);
    console.log(nodeDom);
    console.log(nodeToRemove);

    if (!nodeToRemove) {
      console.log("Node not found");
    } else if (value === this.root.value) {
      console.log("to be done");
    } else {
      if (parent.right) {
        if (parent.right.value === nodeToRemove.value) {
          parent.right = removedNodeChildren;
        }
      } else {
        parent.left = removedNodeChildren;
      }
    }

    body.removeChild(nodeDom);
  }
  searchForNode(value) {
    let testNode = this.root;
    let curNode;
    let parent;

    while (testNode) {
      parent = curNode;
      curNode = testNode;
      testNode = testNode.value > value ? testNode.left : testNode.right;
    }
    return { curNode, parent };
  }
  mergeSubBranch(node) {
    if (node.right) {
      let leftestNode = this.mostLeft(node.right);
      leftestNode.left = node.left;
      return node.right;
    } else {
      return node.left;
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
  adjustPosition() {}
}

let tree = new Tree();
