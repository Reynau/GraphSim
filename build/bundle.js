/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!**********************!*\
  !*** ./src/graph.js ***!
  \**********************/
/***/ (function(module, exports, __webpack_require__) {

eval("var paintutil = __webpack_require__(/*! ./paintutil */ 1)\n\nfunction Graph(canvas) {\n\n  this.nodes = []\n  this.NODE_R = 20\n  this.NODE_SINK_R = this.NODE_R * 0.85\n  this.NODE_COLOR = \"#000000\"\n  this.NODE_COLOR_ACTIVE = \"#0000ff\"\n  this.BACKGROUND_COLOR = \"#ffffff\"\n\n  this.canvas = canvas\n  // allow to receive keypress:\n  canvas.tabIndex = 1337\n  canvas.style.outline = \"none\"\n  this.ctx = canvas.getContext('2d')\n\n  // the node currently being dragged or {}\n  this.selectedNode = {}\n\n  // the starting edge has no source node\n  // x, y, node\n  this.startingEdge = undefined\n\n\n  // the currently dragged edge or {}\n  this.currentEdge = {}\n\n  // whether or not the shift key is currently pressed\n  this.shift = false\n\n  // The current interaction\n  // either \"movenode\", \"newedge\" or \"moveedge\"\n  this.interaction = undefined\n\n  this.mouseX = 0\n  this.mouseY = 0\n\n  // Event listeners\n  this.canvas.addEventListener('dblclick', this.doubleClickListener.bind(this))\n  this.canvas.addEventListener('mousedown', this.mouseDownListener.bind(this))\n  this.canvas.addEventListener('mousemove', this.mouseMoveListener.bind(this))\n  this.canvas.addEventListener('mouseup', this.mouseUpListener.bind(this))\n  this.canvas.addEventListener('keydown', this.keyDownListener.bind(this))\n  this.canvas.addEventListener('keyup', this.keyUpListener.bind(this))\n\n\n}\n\nGraph.prototype.removeNode = function removeNode(n) {\n  var i = this.nodes.indexOf(n)\n  if (i != -1) {\n    this.nodes.splice(i, 1)\n  }\n}\n\n\n// returns the clicked node or undefined\nGraph.prototype.intersectsNode = function intersectsNode(x, y) {\n  for (var i = 0; i < this.nodes.length; i++) {\n    var n = this.nodes[i]\n    if (paintutil.dst(n.x, n.y, x, y) < this.NODE_R) return n\n  }\n  return undefined\n}\n\nGraph.prototype.paint = function paint() {\n  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)\n\n  // draw nodes\n  this.nodes.forEach(function(n) {\n    var c = this.NODE_COLOR\n    if (this.activeNode == n) c = this.NODE_COLOR_ACTIVE\n\n    paintutil.drawCircle(this.ctx, n.x, n.y, this.NODE_R, c)\n    if (n.sink) paintutil.drawCircle(this.ctx, n.x, n.y, this.NODE_SINK_R, c)\n    paintutil.drawText(this.ctx, n.x, n.y, n.text, c)\n    n.edges.forEach(function (e) {\n      paintutil.drawLine(this.ctx, n.x, n.y, e.dst.x, e.dst.y, this.NODE_R, this.NODE_R, c)\n    }.bind(this))\n  }.bind(this))\n\n  // current edge (dragged one)\n  if (this.interaction == \"newedge\") {\n    // starting point\n    var spX = 0\n    var spY = 0\n    var o1 = 0\n    var o2 = 0\n    if (this.currentEdge.node !== undefined) {\n      spX = this.currentEdge.node.x\n      spY = this.currentEdge.node.y\n      o1 = this.NODE_R\n    } else {\n      spX = this.currentEdge.x\n      spY = this.currentEdge.y\n    }\n    paintutil.drawLine(this.ctx, spX, spY, this.mouseX, this.mouseY, o1, o2)\n  }\n}\n\nGraph.prototype.mouseUpListener = function onMouseUp(e) {\n  var x = e.pageX - this.canvas.offsetLeft\n  var y = e.pageY - this.canvas.offsetTop\n  var n = this.intersectsNode(x, y)\n\n\n  if (this.interaction == \"newedge\") {\n    if (n == undefined) {\n      this.currentEdge = {}\n      paint()\n      return\n    }\n\n    if (this.currentEdge.node == undefined) {\n      //this is the starting edge\n    } else {\n      // edge from node to node\n      var index = this.nodes.indexOf(n)\n      var edge = new Edge(n)\n      this.currentEdge.node.edges.push(edge)\n    }\n  }\n\n  this.interaction = undefined\n  this.selectedNode = {}\n  this.paint()\n}\nGraph.prototype.keyUpListener = function onKeyUp(e) {\n  this.shift = e.shiftKey\n}\n\nGraph.prototype.keyDownListener = function onKeyDown(e) {\n  this.shift = e.shiftKey\n  if (this.activeNode === undefined) {\n    return\n  }\n\n  if (e.key == 'Backspace') {\n    if (this.activeNode.text) {\n      this.activeNode.text = this.activeNode.text.slice(0, -1)\n    }\n  } else if (e.key == 'Delete') {\n    this.removeNode(activeNode)\n  } else if (e.key.length == 1) {\n    this.activeNode.text += e.key\n  }\n\n  this.paint()\n}\n\n\nGraph.prototype.doubleClickListener = function onDoubleClick(e) {\n  var x = e.pageX - this.canvas.offsetLeft\n  var y = e.pageY - this.canvas.offsetTop\n\n  var cn = this.intersectsNode(x, y)\n  if (cn !== undefined) {\n    cn.sink = !cn.sink\n    this.activeNode = cn\n  } else {\n    var n = new Node(x, y, false)\n    this.nodes.push(n)\n    this.activeNode = n\n  }\n\n  this.paint();\n}\n\nGraph.prototype.mouseMoveListener = function onMouseMove(e) {\n  var x = e.pageX - this.canvas.offsetLeft\n  var y = e.pageY - this.canvas.offsetTop\n  this.mouseX = x\n  this.mouseY = y\n\n  if (this.interaction == \"movenode\") {\n    if (this.selectedNode.node == undefined) {\n      return\n    }\n\n    var n = this.selectedNode.node\n    n.x = this.selectedNode.origX + x - this.selectedNode.mouseX\n    n.y = this.selectedNode.origY + y - this.selectedNode.mouseY\n\n  } else if (this.interaction == \"newedge\") {\n    // TODO\n  }\n  this.paint()\n}\n\nGraph.prototype.mouseDownListener = function onMouseDown(e) {\n  var x = e.pageX - this.canvas.offsetLeft\n  var y = e.pageY - this.canvas.offsetTop\n\n  var n = this.intersectsNode(x, y)\n\n  if (this.shift) {\n    this.interaction = \"newedge\"\n    // we create an edge\n    var index = this.nodes.indexOf(n)\n    if (index != -1) {\n      // we start from a node\n      this.currentEdge.node = n\n      this.currentEdge.x = this.currentEdge.y = -1\n    } else {\n      this.currentEdge.node = undefined\n      this.currentEdge.x = x\n      this.currentEdge.y = y\n    }\n\n\n    this.paint()\n    return\n  }\n\n\n  this.interaction = \"movenode\"\n\n  if (n !== undefined) {\n    this.selectedNode.origX = n.x\n    this.selectedNode.origY = n.y\n    this.selectedNode.mouseX = x\n    this.selectedNode.mouseY = y\n    this.selectedNode.node = n\n    this.activeNode = n\n  } else {\n    this.selectedNode = {}\n    this.activeNode = undefined\n  }\n\n  this.paint();\n\n}\n\n\n\n\n// Node\n// x: x coordinate in pixels\n// y: y coordinate in pixels\n// sink: true if this node is a sink\nfunction Node(x, y, sink, text) {\n  this.sink = sink || false\n  this.text = text || \"\"\n\n  this.x = x\n  this.y = y\n  this.edges = []\n}\n\n// Edge\n// dst: destination node\n//      can be empty while dragging\n// text: the text for the edge\n// r: the radius (for drawing)\nfunction Edge(dst, text, r) {\n  this.text = text || \"\"\n  this.r = r || 0\n\n  this.dst = dst\n  this.text = text\n  this.r = r\n}\n\n// Adds an edge from this to n\nNode.prototype.addEdge = function addEdge(e) {\n  this.edges.push(e)\n}\n\nmodule.exports = {\n  Graph: Graph,\n  Node: Node,\n  Edge: Edge,\n}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9ncmFwaC5qcz9lZjk2Il0sInNvdXJjZXNDb250ZW50IjpbInZhciBwYWludHV0aWwgPSByZXF1aXJlKFwiLi9wYWludHV0aWxcIilcblxuZnVuY3Rpb24gR3JhcGgoY2FudmFzKSB7XG5cbiAgdGhpcy5ub2RlcyA9IFtdXG4gIHRoaXMuTk9ERV9SID0gMjBcbiAgdGhpcy5OT0RFX1NJTktfUiA9IHRoaXMuTk9ERV9SICogMC44NVxuICB0aGlzLk5PREVfQ09MT1IgPSBcIiMwMDAwMDBcIlxuICB0aGlzLk5PREVfQ09MT1JfQUNUSVZFID0gXCIjMDAwMGZmXCJcbiAgdGhpcy5CQUNLR1JPVU5EX0NPTE9SID0gXCIjZmZmZmZmXCJcblxuICB0aGlzLmNhbnZhcyA9IGNhbnZhc1xuICAvLyBhbGxvdyB0byByZWNlaXZlIGtleXByZXNzOlxuICBjYW52YXMudGFiSW5kZXggPSAxMzM3XG4gIGNhbnZhcy5zdHlsZS5vdXRsaW5lID0gXCJub25lXCJcbiAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG4gIC8vIHRoZSBub2RlIGN1cnJlbnRseSBiZWluZyBkcmFnZ2VkIG9yIHt9XG4gIHRoaXMuc2VsZWN0ZWROb2RlID0ge31cblxuICAvLyB0aGUgc3RhcnRpbmcgZWRnZSBoYXMgbm8gc291cmNlIG5vZGVcbiAgLy8geCwgeSwgbm9kZVxuICB0aGlzLnN0YXJ0aW5nRWRnZSA9IHVuZGVmaW5lZFxuXG5cbiAgLy8gdGhlIGN1cnJlbnRseSBkcmFnZ2VkIGVkZ2Ugb3Ige31cbiAgdGhpcy5jdXJyZW50RWRnZSA9IHt9XG5cbiAgLy8gd2hldGhlciBvciBub3QgdGhlIHNoaWZ0IGtleSBpcyBjdXJyZW50bHkgcHJlc3NlZFxuICB0aGlzLnNoaWZ0ID0gZmFsc2VcblxuICAvLyBUaGUgY3VycmVudCBpbnRlcmFjdGlvblxuICAvLyBlaXRoZXIgXCJtb3Zlbm9kZVwiLCBcIm5ld2VkZ2VcIiBvciBcIm1vdmVlZGdlXCJcbiAgdGhpcy5pbnRlcmFjdGlvbiA9IHVuZGVmaW5lZFxuXG4gIHRoaXMubW91c2VYID0gMFxuICB0aGlzLm1vdXNlWSA9IDBcblxuICAvLyBFdmVudCBsaXN0ZW5lcnNcbiAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCB0aGlzLmRvdWJsZUNsaWNrTGlzdGVuZXIuYmluZCh0aGlzKSlcbiAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5tb3VzZURvd25MaXN0ZW5lci5iaW5kKHRoaXMpKVxuICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlTW92ZUxpc3RlbmVyLmJpbmQodGhpcykpXG4gIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXBMaXN0ZW5lci5iaW5kKHRoaXMpKVxuICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlEb3duTGlzdGVuZXIuYmluZCh0aGlzKSlcbiAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleVVwTGlzdGVuZXIuYmluZCh0aGlzKSlcblxuXG59XG5cbkdyYXBoLnByb3RvdHlwZS5yZW1vdmVOb2RlID0gZnVuY3Rpb24gcmVtb3ZlTm9kZShuKSB7XG4gIHZhciBpID0gdGhpcy5ub2Rlcy5pbmRleE9mKG4pXG4gIGlmIChpICE9IC0xKSB7XG4gICAgdGhpcy5ub2Rlcy5zcGxpY2UoaSwgMSlcbiAgfVxufVxuXG5cbi8vIHJldHVybnMgdGhlIGNsaWNrZWQgbm9kZSBvciB1bmRlZmluZWRcbkdyYXBoLnByb3RvdHlwZS5pbnRlcnNlY3RzTm9kZSA9IGZ1bmN0aW9uIGludGVyc2VjdHNOb2RlKHgsIHkpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG4gPSB0aGlzLm5vZGVzW2ldXG4gICAgaWYgKHBhaW50dXRpbC5kc3Qobi54LCBuLnksIHgsIHkpIDwgdGhpcy5OT0RFX1IpIHJldHVybiBuXG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZFxufVxuXG5HcmFwaC5wcm90b3R5cGUucGFpbnQgPSBmdW5jdGlvbiBwYWludCgpIHtcbiAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpXG5cbiAgLy8gZHJhdyBub2Rlc1xuICB0aGlzLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgIHZhciBjID0gdGhpcy5OT0RFX0NPTE9SXG4gICAgaWYgKHRoaXMuYWN0aXZlTm9kZSA9PSBuKSBjID0gdGhpcy5OT0RFX0NPTE9SX0FDVElWRVxuXG4gICAgcGFpbnR1dGlsLmRyYXdDaXJjbGUodGhpcy5jdHgsIG4ueCwgbi55LCB0aGlzLk5PREVfUiwgYylcbiAgICBpZiAobi5zaW5rKSBwYWludHV0aWwuZHJhd0NpcmNsZSh0aGlzLmN0eCwgbi54LCBuLnksIHRoaXMuTk9ERV9TSU5LX1IsIGMpXG4gICAgcGFpbnR1dGlsLmRyYXdUZXh0KHRoaXMuY3R4LCBuLngsIG4ueSwgbi50ZXh0LCBjKVxuICAgIG4uZWRnZXMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgcGFpbnR1dGlsLmRyYXdMaW5lKHRoaXMuY3R4LCBuLngsIG4ueSwgZS5kc3QueCwgZS5kc3QueSwgdGhpcy5OT0RFX1IsIHRoaXMuTk9ERV9SLCBjKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfS5iaW5kKHRoaXMpKVxuXG4gIC8vIGN1cnJlbnQgZWRnZSAoZHJhZ2dlZCBvbmUpXG4gIGlmICh0aGlzLmludGVyYWN0aW9uID09IFwibmV3ZWRnZVwiKSB7XG4gICAgLy8gc3RhcnRpbmcgcG9pbnRcbiAgICB2YXIgc3BYID0gMFxuICAgIHZhciBzcFkgPSAwXG4gICAgdmFyIG8xID0gMFxuICAgIHZhciBvMiA9IDBcbiAgICBpZiAodGhpcy5jdXJyZW50RWRnZS5ub2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNwWCA9IHRoaXMuY3VycmVudEVkZ2Uubm9kZS54XG4gICAgICBzcFkgPSB0aGlzLmN1cnJlbnRFZGdlLm5vZGUueVxuICAgICAgbzEgPSB0aGlzLk5PREVfUlxuICAgIH0gZWxzZSB7XG4gICAgICBzcFggPSB0aGlzLmN1cnJlbnRFZGdlLnhcbiAgICAgIHNwWSA9IHRoaXMuY3VycmVudEVkZ2UueVxuICAgIH1cbiAgICBwYWludHV0aWwuZHJhd0xpbmUodGhpcy5jdHgsIHNwWCwgc3BZLCB0aGlzLm1vdXNlWCwgdGhpcy5tb3VzZVksIG8xLCBvMilcbiAgfVxufVxuXG5HcmFwaC5wcm90b3R5cGUubW91c2VVcExpc3RlbmVyID0gZnVuY3Rpb24gb25Nb3VzZVVwKGUpIHtcbiAgdmFyIHggPSBlLnBhZ2VYIC0gdGhpcy5jYW52YXMub2Zmc2V0TGVmdFxuICB2YXIgeSA9IGUucGFnZVkgLSB0aGlzLmNhbnZhcy5vZmZzZXRUb3BcbiAgdmFyIG4gPSB0aGlzLmludGVyc2VjdHNOb2RlKHgsIHkpXG5cblxuICBpZiAodGhpcy5pbnRlcmFjdGlvbiA9PSBcIm5ld2VkZ2VcIikge1xuICAgIGlmIChuID09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jdXJyZW50RWRnZSA9IHt9XG4gICAgICBwYWludCgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50RWRnZS5ub2RlID09IHVuZGVmaW5lZCkge1xuICAgICAgLy90aGlzIGlzIHRoZSBzdGFydGluZyBlZGdlXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVkZ2UgZnJvbSBub2RlIHRvIG5vZGVcbiAgICAgIHZhciBpbmRleCA9IHRoaXMubm9kZXMuaW5kZXhPZihuKVxuICAgICAgdmFyIGVkZ2UgPSBuZXcgRWRnZShuKVxuICAgICAgdGhpcy5jdXJyZW50RWRnZS5ub2RlLmVkZ2VzLnB1c2goZWRnZSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmludGVyYWN0aW9uID0gdW5kZWZpbmVkXG4gIHRoaXMuc2VsZWN0ZWROb2RlID0ge31cbiAgdGhpcy5wYWludCgpXG59XG5HcmFwaC5wcm90b3R5cGUua2V5VXBMaXN0ZW5lciA9IGZ1bmN0aW9uIG9uS2V5VXAoZSkge1xuICB0aGlzLnNoaWZ0ID0gZS5zaGlmdEtleVxufVxuXG5HcmFwaC5wcm90b3R5cGUua2V5RG93bkxpc3RlbmVyID0gZnVuY3Rpb24gb25LZXlEb3duKGUpIHtcbiAgdGhpcy5zaGlmdCA9IGUuc2hpZnRLZXlcbiAgaWYgKHRoaXMuYWN0aXZlTm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoZS5rZXkgPT0gJ0JhY2tzcGFjZScpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVOb2RlLnRleHQpIHtcbiAgICAgIHRoaXMuYWN0aXZlTm9kZS50ZXh0ID0gdGhpcy5hY3RpdmVOb2RlLnRleHQuc2xpY2UoMCwgLTEpXG4gICAgfVxuICB9IGVsc2UgaWYgKGUua2V5ID09ICdEZWxldGUnKSB7XG4gICAgdGhpcy5yZW1vdmVOb2RlKGFjdGl2ZU5vZGUpXG4gIH0gZWxzZSBpZiAoZS5rZXkubGVuZ3RoID09IDEpIHtcbiAgICB0aGlzLmFjdGl2ZU5vZGUudGV4dCArPSBlLmtleVxuICB9XG5cbiAgdGhpcy5wYWludCgpXG59XG5cblxuR3JhcGgucHJvdG90eXBlLmRvdWJsZUNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbiBvbkRvdWJsZUNsaWNrKGUpIHtcbiAgdmFyIHggPSBlLnBhZ2VYIC0gdGhpcy5jYW52YXMub2Zmc2V0TGVmdFxuICB2YXIgeSA9IGUucGFnZVkgLSB0aGlzLmNhbnZhcy5vZmZzZXRUb3BcblxuICB2YXIgY24gPSB0aGlzLmludGVyc2VjdHNOb2RlKHgsIHkpXG4gIGlmIChjbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY24uc2luayA9ICFjbi5zaW5rXG4gICAgdGhpcy5hY3RpdmVOb2RlID0gY25cbiAgfSBlbHNlIHtcbiAgICB2YXIgbiA9IG5ldyBOb2RlKHgsIHksIGZhbHNlKVxuICAgIHRoaXMubm9kZXMucHVzaChuKVxuICAgIHRoaXMuYWN0aXZlTm9kZSA9IG5cbiAgfVxuXG4gIHRoaXMucGFpbnQoKTtcbn1cblxuR3JhcGgucHJvdG90eXBlLm1vdXNlTW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xuICB2YXIgeCA9IGUucGFnZVggLSB0aGlzLmNhbnZhcy5vZmZzZXRMZWZ0XG4gIHZhciB5ID0gZS5wYWdlWSAtIHRoaXMuY2FudmFzLm9mZnNldFRvcFxuICB0aGlzLm1vdXNlWCA9IHhcbiAgdGhpcy5tb3VzZVkgPSB5XG5cbiAgaWYgKHRoaXMuaW50ZXJhY3Rpb24gPT0gXCJtb3Zlbm9kZVwiKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlLm5vZGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgbiA9IHRoaXMuc2VsZWN0ZWROb2RlLm5vZGVcbiAgICBuLnggPSB0aGlzLnNlbGVjdGVkTm9kZS5vcmlnWCArIHggLSB0aGlzLnNlbGVjdGVkTm9kZS5tb3VzZVhcbiAgICBuLnkgPSB0aGlzLnNlbGVjdGVkTm9kZS5vcmlnWSArIHkgLSB0aGlzLnNlbGVjdGVkTm9kZS5tb3VzZVlcblxuICB9IGVsc2UgaWYgKHRoaXMuaW50ZXJhY3Rpb24gPT0gXCJuZXdlZGdlXCIpIHtcbiAgICAvLyBUT0RPXG4gIH1cbiAgdGhpcy5wYWludCgpXG59XG5cbkdyYXBoLnByb3RvdHlwZS5tb3VzZURvd25MaXN0ZW5lciA9IGZ1bmN0aW9uIG9uTW91c2VEb3duKGUpIHtcbiAgdmFyIHggPSBlLnBhZ2VYIC0gdGhpcy5jYW52YXMub2Zmc2V0TGVmdFxuICB2YXIgeSA9IGUucGFnZVkgLSB0aGlzLmNhbnZhcy5vZmZzZXRUb3BcblxuICB2YXIgbiA9IHRoaXMuaW50ZXJzZWN0c05vZGUoeCwgeSlcblxuICBpZiAodGhpcy5zaGlmdCkge1xuICAgIHRoaXMuaW50ZXJhY3Rpb24gPSBcIm5ld2VkZ2VcIlxuICAgIC8vIHdlIGNyZWF0ZSBhbiBlZGdlXG4gICAgdmFyIGluZGV4ID0gdGhpcy5ub2Rlcy5pbmRleE9mKG4pXG4gICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICAvLyB3ZSBzdGFydCBmcm9tIGEgbm9kZVxuICAgICAgdGhpcy5jdXJyZW50RWRnZS5ub2RlID0gblxuICAgICAgdGhpcy5jdXJyZW50RWRnZS54ID0gdGhpcy5jdXJyZW50RWRnZS55ID0gLTFcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50RWRnZS5ub2RlID0gdW5kZWZpbmVkXG4gICAgICB0aGlzLmN1cnJlbnRFZGdlLnggPSB4XG4gICAgICB0aGlzLmN1cnJlbnRFZGdlLnkgPSB5XG4gICAgfVxuXG5cbiAgICB0aGlzLnBhaW50KClcbiAgICByZXR1cm5cbiAgfVxuXG5cbiAgdGhpcy5pbnRlcmFjdGlvbiA9IFwibW92ZW5vZGVcIlxuXG4gIGlmIChuICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnNlbGVjdGVkTm9kZS5vcmlnWCA9IG4ueFxuICAgIHRoaXMuc2VsZWN0ZWROb2RlLm9yaWdZID0gbi55XG4gICAgdGhpcy5zZWxlY3RlZE5vZGUubW91c2VYID0geFxuICAgIHRoaXMuc2VsZWN0ZWROb2RlLm1vdXNlWSA9IHlcbiAgICB0aGlzLnNlbGVjdGVkTm9kZS5ub2RlID0gblxuICAgIHRoaXMuYWN0aXZlTm9kZSA9IG5cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHt9XG4gICAgdGhpcy5hY3RpdmVOb2RlID0gdW5kZWZpbmVkXG4gIH1cblxuICB0aGlzLnBhaW50KCk7XG5cbn1cblxuXG5cblxuLy8gTm9kZVxuLy8geDogeCBjb29yZGluYXRlIGluIHBpeGVsc1xuLy8geTogeSBjb29yZGluYXRlIGluIHBpeGVsc1xuLy8gc2luazogdHJ1ZSBpZiB0aGlzIG5vZGUgaXMgYSBzaW5rXG5mdW5jdGlvbiBOb2RlKHgsIHksIHNpbmssIHRleHQpIHtcbiAgdGhpcy5zaW5rID0gc2luayB8fCBmYWxzZVxuICB0aGlzLnRleHQgPSB0ZXh0IHx8IFwiXCJcblxuICB0aGlzLnggPSB4XG4gIHRoaXMueSA9IHlcbiAgdGhpcy5lZGdlcyA9IFtdXG59XG5cbi8vIEVkZ2Vcbi8vIGRzdDogZGVzdGluYXRpb24gbm9kZVxuLy8gICAgICBjYW4gYmUgZW1wdHkgd2hpbGUgZHJhZ2dpbmdcbi8vIHRleHQ6IHRoZSB0ZXh0IGZvciB0aGUgZWRnZVxuLy8gcjogdGhlIHJhZGl1cyAoZm9yIGRyYXdpbmcpXG5mdW5jdGlvbiBFZGdlKGRzdCwgdGV4dCwgcikge1xuICB0aGlzLnRleHQgPSB0ZXh0IHx8IFwiXCJcbiAgdGhpcy5yID0gciB8fCAwXG5cbiAgdGhpcy5kc3QgPSBkc3RcbiAgdGhpcy50ZXh0ID0gdGV4dFxuICB0aGlzLnIgPSByXG59XG5cbi8vIEFkZHMgYW4gZWRnZSBmcm9tIHRoaXMgdG8gblxuTm9kZS5wcm90b3R5cGUuYWRkRWRnZSA9IGZ1bmN0aW9uIGFkZEVkZ2UoZSkge1xuICB0aGlzLmVkZ2VzLnB1c2goZSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEdyYXBoOiBHcmFwaCxcbiAgTm9kZTogTm9kZSxcbiAgRWRnZTogRWRnZSxcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2dyYXBoLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!**************************!*\
  !*** ./src/paintutil.js ***!
  \**************************/
/***/ (function(module, exports) {

eval("\nfunction drawCircle(ctx, x, y, r, c) {\n  ctx.beginPath()\n  ctx.arc(x, y, r, 0, 2 * Math.PI, false)\n  //ctx.fillStyle = BACKGROUND_COLOR;\n  //ctx.fill();\n  ctx.lineWidth = 1\n  ctx.strokeStyle = c\n  ctx.stroke()\n}\n\nfunction drawText(ctx, x, y, text, c) {\n  ctx.fillStyle = c\n  ctx.textAlign = \"center\"\n  ctx.textBaseline = \"middle\"\n  ctx.fillText(text, x, y)\n}\n\n// Draw a line from 1 to 2 with possible offsets\nfunction drawLine(ctx, x1, y1, x2, y2, offset1, offset2, c) {\n  var dx = x2 - x1;\n  var dy = y2 - y1;\n  var h = Math.sqrt(dx*dx+dy*dy)\n\n  if (offset1+offset2 >= h) {\n    offset1 = offset2 = h/2\n  }\n\n  var o1x =  dx/h * offset1;\n  var o1y =  dy/h * offset1;\n  var o2x =  -dx/h * offset2;\n  var o2y =  -dy/h * offset2;\n\n  ctx.beginPath()\n  ctx.strokeStyle = c\n  ctx.moveTo(x1+o1x, y1+o1y)\n  ctx.lineTo(x2+o2x, y2+o2y)\n  ctx.stroke()\n}\n\n\n\nfunction dst(x1, y1, x2, y2) {\n  var dx = x2 - x1,\n    dy = y2 - y1\n  return Math.sqrt(dx * dx + dy * dy)\n}\n\nmodule.exports = {\n  drawCircle: drawCircle,\n  drawText: drawText,\n  drawLine: drawLine,\n  dst:dst,\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9wYWludHV0aWwuanM/YWM1NSJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmZ1bmN0aW9uIGRyYXdDaXJjbGUoY3R4LCB4LCB5LCByLCBjKSB7XG4gIGN0eC5iZWdpblBhdGgoKVxuICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgLy9jdHguZmlsbFN0eWxlID0gQkFDS0dST1VORF9DT0xPUjtcbiAgLy9jdHguZmlsbCgpO1xuICBjdHgubGluZVdpZHRoID0gMVxuICBjdHguc3Ryb2tlU3R5bGUgPSBjXG4gIGN0eC5zdHJva2UoKVxufVxuXG5mdW5jdGlvbiBkcmF3VGV4dChjdHgsIHgsIHksIHRleHQsIGMpIHtcbiAgY3R4LmZpbGxTdHlsZSA9IGNcbiAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcbiAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCJcbiAgY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpXG59XG5cbi8vIERyYXcgYSBsaW5lIGZyb20gMSB0byAyIHdpdGggcG9zc2libGUgb2Zmc2V0c1xuZnVuY3Rpb24gZHJhd0xpbmUoY3R4LCB4MSwgeTEsIHgyLCB5Miwgb2Zmc2V0MSwgb2Zmc2V0MiwgYykge1xuICB2YXIgZHggPSB4MiAtIHgxO1xuICB2YXIgZHkgPSB5MiAtIHkxO1xuICB2YXIgaCA9IE1hdGguc3FydChkeCpkeCtkeSpkeSlcblxuICBpZiAob2Zmc2V0MStvZmZzZXQyID49IGgpIHtcbiAgICBvZmZzZXQxID0gb2Zmc2V0MiA9IGgvMlxuICB9XG5cbiAgdmFyIG8xeCA9ICBkeC9oICogb2Zmc2V0MTtcbiAgdmFyIG8xeSA9ICBkeS9oICogb2Zmc2V0MTtcbiAgdmFyIG8yeCA9ICAtZHgvaCAqIG9mZnNldDI7XG4gIHZhciBvMnkgPSAgLWR5L2ggKiBvZmZzZXQyO1xuXG4gIGN0eC5iZWdpblBhdGgoKVxuICBjdHguc3Ryb2tlU3R5bGUgPSBjXG4gIGN0eC5tb3ZlVG8oeDErbzF4LCB5MStvMXkpXG4gIGN0eC5saW5lVG8oeDIrbzJ4LCB5MitvMnkpXG4gIGN0eC5zdHJva2UoKVxufVxuXG5cblxuZnVuY3Rpb24gZHN0KHgxLCB5MSwgeDIsIHkyKSB7XG4gIHZhciBkeCA9IHgyIC0geDEsXG4gICAgZHkgPSB5MiAtIHkxXG4gIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkcmF3Q2lyY2xlOiBkcmF3Q2lyY2xlLFxuICBkcmF3VGV4dDogZHJhd1RleHQsXG4gIGRyYXdMaW5lOiBkcmF3TGluZSxcbiAgZHN0OmRzdCxcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYWludHV0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 2 */
/* unknown exports provided */
/* all exports used */
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ (function(module, exports, __webpack_require__) {

eval("var graph = __webpack_require__(/*! ./graph */ 0)\n\nvar canvas = document.getElementById('canvas')\nvar g = new graph.Graph(canvas)\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9tYWluLmpzPzM0NzkiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGdyYXBoID0gcmVxdWlyZSgnLi9ncmFwaCcpXG5cbnZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJylcbnZhciBnID0gbmV3IGdyYXBoLkdyYXBoKGNhbnZhcylcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=");

/***/ })
/******/ ]);