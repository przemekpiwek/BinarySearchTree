const grid = document.querySelector(".grid");
const addButt = document.querySelector("#addButton");
const remButt = document.querySelector("#removeButton");
const addInput = document.querySelector("#addNodeInput");
const remInput = document.querySelector("#removeNodeInput");
const svgBox = document.querySelector(".svgbox");
let arrayOfNodesPlaceholder = [];

addButt.addEventListener("click", addNodeHandler);
remButt.addEventListener("click", remNodeHandler);
addInput.addEventListener("keypress", addNodeHandler);
remInput.addEventListener("keypress", remNodeHandler);

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.rowCell = null;
    this.colCell = null;

    this.positionX = null;
    this.positionY = null;
  }
  createDom() {
    let nodeEl = document.createElement("inline-block");
    let nodeText = document.createElement("p");
    nodeEl.style.gridColumnStart = `${this.colCell}`;
    nodeEl.style.gridRowStart = `${this.rowCell}`;
    nodeText.innerText = `${this.value}`;
    nodeEl.id = this.value;
    nodeEl.classList.add("node");
    nodeEl.appendChild(nodeText);
    grid.appendChild(nodeEl);
  }
}
let nodeObj;

class Tree {
  constructor() {
    this.root = null;
  }
  addNode(value) {
    let newNode = new Node(value);
    let curNode;
    nodeObj = newNode;

    if (this.root === null) {
      this.root = newNode;
      curNode = newNode;
      curNode.rowCell = 1;
      curNode.colCell = 6;
    } else {
      curNode = this.searchForNode(value)["curNode"];
      if (curNode.value > newNode.value) {
        curNode.left = newNode;
        newNode.rowCell = curNode.rowCell + 1;
        newNode.colCell = curNode.colCell - 1;
      } else {
        curNode.right = newNode;
        newNode.rowCell = curNode.rowCell + 1;
        newNode.colCell = curNode.colCell + 1;
      }
    }
    newNode.createDom();
    this.clearLines();
    this.createLines(this.root);
  }
  removeNode(value) {
    const { curNode: nodeToRemove, parent } = this.searchForNode(value);
    console.log(nodeToRemove);
    if (!nodeToRemove) {
      console.log("Node not found");
    } else {
      const removedNodeChildren = this.mergeSubBranch(nodeToRemove);
      const removedNodeDom = document.getElementById(`${nodeToRemove.value}`);
      if (value === this.root.value) {
        this.root = null;
        this.root = removedNodeChildren;
        //need to adjust position
      } else if (parent.right && parent.right.value === nodeToRemove.value) {
        parent.right = removedNodeChildren;
      } else {
        parent.left = removedNodeChildren;
      }
      grid.removeChild(removedNodeDom);
    }
    this.clearLines();
    this.createLines(this.root);
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
    if (!node) {
      return;
    } else if (node.right) {
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
      let nodeArr = arrayOfNodesPlaceholder;
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
      arrayOfNodesPlaceholder = [];
    }
  }
  arrayNodes(node) {
    arrayOfNodesPlaceholder.push(node);
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

  createLines(node) {
    //pass in new node
    let nodeObj = $(`#${node.value}`);
    let nodePos = nodeObj.position();
    let svg = document.querySelector("svg");

    if (node.left) {
      let nodeLeft = $(`#${node.left.value}`);
      let leftPos = nodeLeft.position();
      let newLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      newLine.setAttribute("id", "line");
      newLine.setAttribute("x1", `${nodePos.left + 80}`);
      newLine.setAttribute("y1", `${nodePos.top - 80}`);
      newLine.setAttribute("x2", `${leftPos.left + 80}`);
      newLine.setAttribute("y2", `${leftPos.top - 80}`);
      newLine.setAttribute("stroke", "white");
      newLine.setAttribute("stroke-width", "3");
      svg.appendChild(newLine);
      this.createLines(node.left);
    }
    if (node.right) {
      let nodeRight = $(`#${node.right.value}`);
      let rightPos = nodeRight.position();
      let newLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      newLine.setAttribute("id", "line");
      newLine.setAttribute("x1", `${nodePos.left + 80}`);
      newLine.setAttribute("y1", `${nodePos.top - 80}`);
      newLine.setAttribute("x2", `${rightPos.left + 80}`);
      newLine.setAttribute("y2", `${rightPos.top - 80}`);
      newLine.setAttribute("stroke", "white");
      newLine.setAttribute("stroke-width", "3");
      svg.appendChild(newLine);
      this.createLines(node.right);
    }
  }

  clearLines() {
    let svg = document.querySelector("svg");
    let lines = document.querySelectorAll("line");
    lines.forEach((child) => svg.removeChild(child));
  }
}

function addNodeHandler(e) {
  console.log(e);
  if (e.keyCode == 13 || e.type == "click") {
    if (addInput.value) {
      tree.addNode(Number(addInput.value));
      addInput.value = null;
    }
  }
}
function remNodeHandler(e) {
  if (e.keyCode == 13 || e.type == "click") {
    if (remInput.value) {
      tree.removeNode(Number(remInput.value));
      remInput.value = null;
    }
  }
}

let tree = new Tree();
