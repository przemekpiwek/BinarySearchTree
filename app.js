const grid = document.querySelector(".grid");
const addButt = document.querySelector("#addButton");
const remButt = document.querySelector("#removeButton");
const addInput = document.querySelector("#addNodeInput");
const remInput = document.querySelector("#removeNodeInput");
let arrayOfNodesPlaceholder = [];

addButt.addEventListener("click", addNodeHandler);
remButt.addEventListener("click", remNodeHandler);
addInput.addEventListener("keypress", addNodeHandler);
remInput.addEventListener("keypress", remNodeHandler);
window.addEventListener("resize", windowHandler);

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
    if (!value) {
      alert("please add value");
    } else {
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
  }
  removeNode(value) {
    //fix so that if given value is not found, return alert
    const { curNode: nodeToRemove, parent } = this.searchForNode(value);
    if (!nodeToRemove || nodeToRemove.value !== value) {
      alert("Node not found");
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
    let svg = document.querySelector("svg");
    const nodePos = document
      .getElementById(`${node.value}`)
      .getBoundingClientRect();
    if (node.left) {
      const leftPos = document
        .getElementById(`${node.left.value}`)
        .getBoundingClientRect();
      let newLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      // console.log(leftPos);

      newLine.setAttribute("id", "line");
      newLine.setAttribute("position", "absolute");
      newLine.setAttribute("z-index", "-1");
      newLine.setAttribute("x1", `${nodePos.x + 90 - (6 - node.colCell) * 10}`);
      newLine.setAttribute(
        "y1",
        `${nodePos.top + 22.5 - 100 + (node.rowCell - 1) * 10}`
      );
      newLine.setAttribute(
        "x2",
        `${leftPos.x + 90 - (6 - node.left.colCell) * 10}`
      );
      newLine.setAttribute(
        "y2",
        `${leftPos.top + 22.5 - 110 + node.left.rowCell * 10}`
      );
      newLine.setAttribute("stroke", "white");
      newLine.setAttribute("stroke-width", "3");
      svg.prepend(newLine);
      this.createLines(node.left);
    }
    if (node.right) {
      const rightPos = document
        .getElementById(`${node.right.value}`)
        .getBoundingClientRect();
      let newLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      newLine.setAttribute("position", "absolute");
      newLine.setAttribute("z-index", "-1");
      // console.log(rightPos);

      newLine.setAttribute("id", "line");
      newLine.setAttribute("x1", `${nodePos.x + 90 + (node.colCell - 6) * 10}`);
      newLine.setAttribute(
        "y1",
        `${nodePos.y + 22.5 - 100 + (node.rowCell - 1) * 10}`
      );
      newLine.setAttribute(
        "x2",
        `${rightPos.x + 90 + (node.right.colCell - 6) * 10}`
      );
      newLine.setAttribute(
        "y2",
        `${rightPos.y + 22.5 - 110 + node.right.rowCell * 10}`
      );
      newLine.setAttribute("stroke", "white");
      newLine.setAttribute("stroke-width", "3");
      svg.prepend(newLine);
      this.createLines(node.right);
    }
  }

  clearLines() {
    let svg = document.querySelector("svg");
    let lines = document.querySelectorAll("line");
    lines.forEach((child) => svg.removeChild(child));
  }

  // renderNodes() {
  //   let nodes = document.querySelectorAll(".node");
  //   nodes.forEach((node) => {
  //     grid.removeChild(node);
  //   });
  //   nodes.forEach((node) => {
  //     grid.appendChild(node);
  //   });
  //   console.log(nodes);
  // }
}

function addNodeHandler(e) {
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
function windowHandler() {
  tree.clearLines();
  tree.createLines(tree.root);
}

let tree = new Tree();
