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
  createDom(parent) {
    let nodeEl = document.createElement("inline-block");
    nodeEl.style.left = this.positionX;
    nodeEl.style.top = this.positionY;
    nodeEl.innerText = `${this.value}`;
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
    let parent;

    if (this.root === null) {
      this.root = newNode;
      parent = newNode;
      parent.positionX = `${window.innerWidth / 2 - 50}px`;
      parent.positionY = "0px";
    } else {
      let curNode = this.root;

      while (curNode) {
        parent = curNode;
        curNode = curNode.value > newNode.value ? curNode.left : curNode.right;
      }
      if (parent.value > newNode.value) {
        parent.left = newNode;
        newNode.positionX = `${parseInt(parent.positionX, 10) - 100}px`;
        newNode.positionY = `${parseInt(parent.positionY, 10) + 100}px`;
      } else if (parent.value < newNode.value) {
        parent.right = newNode;
        newNode.positionX = `${parseInt(parent.positionX, 10) + 100}px`;
        newNode.positionY = `${parseInt(parent.positionY, 10) + 100}px`;
      }
    }
    newNode.createDom();
    return newNode;
  }
}

let tree = new Tree();
