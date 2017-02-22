var paintutil = require("./paintutil")

function Graph(canvas) {

  this.nodes = []
  this.NODE_R = 20
  this.NODE_SINK_R = this.NODE_R * 0.85
  this.NODE_COLOR = "#000000"
  this.NODE_COLOR_ACTIVE = "#0000ff"
  this.BACKGROUND_COLOR = "#ffffff"

  this.canvas = canvas
  // allow to receive keypress:
  canvas.tabIndex = 1337
  canvas.style.outline = "none"
  this.ctx = canvas.getContext('2d')

  // the node currently being dragged or {}
  this.selectedNode = {}

  // edges without a src node but x and y properties
  this.initEdges = []


  // the currently dragged edge or {}
  this.currentEdge = {}

  // whether or not the shift key is currently pressed
  this.shift = false

  // The current interaction
  // either "movenode", "newedge" or "moveedge"
  this.interaction = undefined

  this.mouseX = 0
  this.mouseY = 0

  // Event listeners
  this.canvas.addEventListener('dblclick', this.doubleClickListener.bind(this))
  this.canvas.addEventListener('mousedown', this.mouseDownListener.bind(this))
  this.canvas.addEventListener('mousemove', this.mouseMoveListener.bind(this))
  this.canvas.addEventListener('mouseup', this.mouseUpListener.bind(this))
  this.canvas.addEventListener('keydown', this.keyDownListener.bind(this))
  this.canvas.addEventListener('keyup', this.keyUpListener.bind(this))
}

Graph.prototype.removeNode = function removeNode(n) {
  var i = this.nodes.indexOf(n)
  // remove incoming init edges
  this.initEdges = this.initEdges.filter(function(e) {
    return e.dst !== n
  })

  if (i != -1) {
    this.nodes.splice(i, 1)
  }
}


// returns the clicked node or undefined
Graph.prototype.intersectsNode = function intersectsNode(x, y) {
  for (var i = 0; i < this.nodes.length; i++) {
    var n = this.nodes[i]
    if (paintutil.dst(n.x, n.y, x, y) < this.NODE_R) return n
  }
  return undefined
}

Graph.prototype.paint = function paint() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

  // draw nodes
  this.nodes.forEach(function(n) {
    var c = this.NODE_COLOR
    if (this.activeNode == n) c = this.NODE_COLOR_ACTIVE

    paintutil.drawCircle(this.ctx, n.x, n.y, this.NODE_R, c)
    if (n.sink) paintutil.drawCircle(this.ctx, n.x, n.y, this.NODE_SINK_R, c)
    paintutil.drawText(this.ctx, n.x, n.y, n.text, c)
    n.edges.forEach(function (e) {
      paintutil.drawLine(this.ctx, n.x, n.y, e.dst.x, e.dst.y, this.NODE_R, this.NODE_R, c)
    }.bind(this))
  }.bind(this))

  this.initEdges.forEach(function (e) {
    var c = this.NODE_COLOR
    if (this.activeEdge == e) c = this.NODE_COLOR_ACTIVE
    paintutil.drawLine(this.ctx, e.x, e.y, e.dst.x, e.dst.y, 0, this.NODE_R, c)
  }.bind(this))

  // current edge (dragged one)
  if (this.interaction == "newedge") {
    // starting point
    var spX = 0
    var spY = 0
    var o1 = 0
    var o2 = 0
    if (this.currentEdge.node !== undefined) {
      spX = this.currentEdge.node.x
      spY = this.currentEdge.node.y
      o1 = this.NODE_R
    } else {
      spX = this.currentEdge.x
      spY = this.currentEdge.y
    }
    paintutil.drawLine(this.ctx, spX, spY, this.mouseX, this.mouseY, o1, o2)
  }
}

Graph.prototype.mouseUpListener = function onMouseUp(e) {
  var x = e.pageX - this.canvas.offsetLeft
  var y = e.pageY - this.canvas.offsetTop
  var n = this.intersectsNode(x, y)


  if (this.interaction == "newedge") {
    if (n == undefined) {
      this.currentEdge = {}
      paint()
      return
    }

    if (this.currentEdge.node == undefined) {
      // new init edge
      this.currentEdge.dst = n
      this.initEdges.push(this.currentEdge)
      this.currentEdge = {}
    } else {
      // edge from node to node
      var index = this.nodes.indexOf(n)
      var edge = new Edge(n)
      this.currentEdge.node.edges.push(edge)
    }
  }

  this.interaction = undefined
  this.selectedNode = {}
  this.paint()
}
Graph.prototype.keyUpListener = function onKeyUp(e) {
  this.shift = e.shiftKey
}

Graph.prototype.keyDownListener = function onKeyDown(e) {
  this.shift = e.shiftKey
  if (this.activeNode === undefined) {
    return
  }

  if (e.key == 'Backspace') {
    if (this.activeNode.text) {
      this.activeNode.text = this.activeNode.text.slice(0, -1)
    }
  } else if (e.key == 'Delete') {
    this.removeNode(this.activeNode)
  } else if (e.key.length == 1) {
    this.activeNode.text += e.key
  }

  this.paint()
}


Graph.prototype.doubleClickListener = function onDoubleClick(e) {
  var x = e.pageX - this.canvas.offsetLeft
  var y = e.pageY - this.canvas.offsetTop

  var cn = this.intersectsNode(x, y)
  if (cn !== undefined) {
    cn.sink = !cn.sink
    this.activeNode = cn
  } else {
    var n = new Node(x, y, false)
    this.nodes.push(n)
    this.activeNode = n
  }

  this.paint();
}

Graph.prototype.mouseMoveListener = function onMouseMove(e) {
  var x = e.pageX - this.canvas.offsetLeft
  var y = e.pageY - this.canvas.offsetTop
  this.mouseX = x
  this.mouseY = y

  if (this.interaction == "movenode") {
    if (this.selectedNode.node == undefined) {
      return
    }

    var n = this.selectedNode.node
    n.x = this.selectedNode.origX + x - this.selectedNode.mouseX
    n.y = this.selectedNode.origY + y - this.selectedNode.mouseY

  } else if (this.interaction == "newedge") {
    // TODO
  }
  this.paint()
}

Graph.prototype.mouseDownListener = function onMouseDown(e) {
  var x = e.pageX - this.canvas.offsetLeft
  var y = e.pageY - this.canvas.offsetTop

  var n = this.intersectsNode(x, y)

  if (this.shift) {
    this.interaction = "newedge"
    // we create an edge
    var index = this.nodes.indexOf(n)
    if (index != -1) {
      // we start from a node
      this.currentEdge.node = n
      this.currentEdge.x = this.currentEdge.y = -1
    } else {
      this.currentEdge.node = undefined
      this.currentEdge.x = x
      this.currentEdge.y = y
    }
    this.paint()
    return
  }


  this.interaction = "movenode"

  if (n !== undefined) {
    this.selectedNode.origX = n.x
    this.selectedNode.origY = n.y
    this.selectedNode.mouseX = x
    this.selectedNode.mouseY = y
    this.selectedNode.node = n
    this.activeNode = n
  } else {
    this.selectedNode = {}
    this.activeNode = undefined
  }

  this.paint();

}




// Node
// x: x coordinate in pixels
// y: y coordinate in pixels
// sink: true if this node is a sink
function Node(x, y, sink, text) {
  this.sink = sink || false
  this.text = text || ""

  this.x = x
  this.y = y
  this.edges = []
}

// Edge
// dst: destination node
//      can be empty while dragging
// text: the text for the edge
// r: the radius (for drawing)
function Edge(dst, text, r) {
  this.text = text || ""
  this.r = r || 0

  this.dst = dst
  this.text = text
  this.r = r
}

// Adds an edge from this to n
Node.prototype.addEdge = function addEdge(e) {
  this.edges.push(e)
}

module.exports = {
  Graph: Graph,
  Node: Node,
  Edge: Edge,
}
