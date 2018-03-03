const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

var squares;
var graph;
var moves = new Array();

function init(request) {
	squares = new Array(request.body.height);
	for(var i=0;i<request.body.height;i++){
		squares[i] = new Array(request.body.width);
	}
	//initialize square values, set walls

	for(var i = 0; i < squares.length; i++){
		for(var j = 0; j < squares[0].length; j++){
			if(i == 0 || j == 0 || i == squares.length-1 || j == squares[0].length-1){
				squares[i][j] = 1;
			}else{
				squares[i][j] = 1;
			}
		}
	}

}

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game
  init(request);
  // Response data
  const data = {
    color: '#DFF000',
    head_url: 'https://lh3.googleusercontent.com/vUVAL5IZJl_9MsS7PQcWotUqinlSEIW_VllIN32y9zZcKH_XVTS1ZtGPgbFRxE42IsSS=w300', // optional, but encouraged!
    taunt: "SOMEONE IS IN DISA HOUSE", // optional, but encouraged!
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  for(var i = 0; i < squares.length; i++){
		for(var j = 0; j < squares[0].length; j++){
			if(i == 0 || j == 0 || i == squares.length-1 || j == squares[0].length-1){
				squares[i][j] = 1; // Define snake positions with 1
			}else{
				squares[i][j] = 1;
			}
		}
	}

  for(var i=0;i<request.body.you.length;i++){
		squares[request.body.you.body.data[i].x][request.body.you.body.data[i].y] = 0;
    // console.log(squares[request.body.you.body.data[i].x][request.body.you.body.data[i].y]);
	}
  for(var i = 0; i < request.body.snakes.data.length; i++) {
    for (var j = 0; j < request.body.snakes.data[i].body.data.length; j++) {
      squares[request.body.snakes.data[i].body.data[j].x][request.body.snakes.data[i].body.data[j].y] = 0;
    }
  }

  console.log(squares);

  graph = new Graph(squares);
  // console.log(graph.grid);
  var start = graph.grid[request.body.you.body.data[0].x][request.body.you.body.data[0].y];
  // Find closest food
  var end;
  var result;
  end = graph.grid[request.body.food.data[0].x][request.body.food.data[0].y];
  result = astar.search(graph, start, end);
  var shortest = result;
  for (var i = 1; i < request.body.food.data.length; i++) {
    end = graph.grid[request.body.food.data[i].x][request.body.food.data[i].y];
  	result = astar.search(graph, start, end);
    console.log('This path is: ' + result.length);
    if (result.length == 0) {
      continue;
    } else if (result.length < shortest.length) {
      shortest = result;
    }
  }
  end = graph.grid[request.body.food.data[0].x][request.body.food.data[0].y];
  result = astar.search(graph, start, end);
	// var end = graph.grid[request.body.food.data[0].x][request.body.food.data[0].y];
	// var result = astar.search(graph, start, end);
  console.log('Start: ' + start);
  console.log('End: ' + end);
  console.log(result[0]);
  // if result[0] is undefined
  //  move in a random but legal direction
  console.log(result[0].x);

  // var start = graph.grid[request.body.you.body.data[0].x][request.body.you.body.data[0].y]
  //
  // squares[request.body.food.data[0].x][request.body.food.data[0].y] = 2;
  // for(var i=0;i<request.body.you.length;i++){
	// 	squares[request.body.you.body.data[i].x][request.body.you.body.data[i].y] = request.body.you.length+i;
  //   // console.log(squares[request.body.you.body.data[i].x][request.body.you.body.data[i].y]);
	// }
  //
  var myhead_x= request.body.you.body.data[0].x;
  var myhead_y= request.body.you.body.data[0].y;
  // var mylength= request.body.you.length;
  // var myhealth= request.body.you.health-1;
  // var food_x = request.body.food.data[0].x;
  // var food_y = request.body.food.data[0].y;
  // // need cases for when snake dies..
  //
  // var new_head;
  // //moves is a list of moves that the snake is to carry out. IF there are no moves left, then run a search to find more.
	// if(moves.length == 0){
	// 	findpath_bfs(request);
  //   new_head = move(moves.shift(), request);
	// } else {
	// 	//we still have moves left, so move the snake to the next square.
	// 	new_head = move(moves.shift(), request);
	// }
  //
  var moveSide = myhead_x - shortest[0].x;
  var moveUp = myhead_y - shortest[0].y;
  var items = ['SOMEBODY TOUCHA MY SPAGHET!', 'SOMEONE IS IN DISA HOUSE!!','u go HOME to your HOUSE !!!', 'ITS GOTTA FACE BUT NO BODY!!', 'U GO HOME!', 'dont toucha my moms SPAGHETT'];
  var taunt = items[Math.floor(Math.random()*items.length)];

  // Response data
  const data = {
    move: 'up', // one of: ['up','down','left','right']
    taunt: taunt, // optional, but encouraged!
  }
  if (moveSide == 1) {
    data.move = 'left'; // one of: ['up','down','left','right']

  } else if (moveSide == -1) {
    data.move = 'right';
  } else if (moveUp == 1) {
    data.move = 'up';
  } else {
    data.move = 'down';
  }

  return response.json(data)
})

//Point class, used to refer to a specific square on the request.body.height
function Point(pos_x,pos_y){
	this.x = pos_x;
	this.y = pos_y;
}

//Node class, used by searches as nodes in a tree.
function Node(parent,point,children){
	this.parent = parent;
	this.point = point;
	this.children = children;
}

//Breadth First Search
function findpath_bfs(request){
	// Creating our Open and Closed Lists
	var openList = new Array();
	var closedList = new Array(request.body.height);
	for(var i=0;i<request.body.height;i++){
		closedList[i] = new Array(request.body.height);
	}
	//initialize closedList values to 0
	for(var i=0;i<request.body.height;i++){
		for(var j=0;j<request.body.height;j++){
			closedList[i][j] = 0;
		}
	}
	// Adding our starting point to Open List
	openList.push(new Node(null,request.body.you.body.data[0],new Array()));
	// Loop while openList contains some data.
	while (openList.length != 0) {
		var n = openList.shift();
    // console.log(squares[n.point.x][n.point.y]);
		if(closedList[n.point.x][n.point.y] == 1)
			continue;
		// Check if node is food
		if (squares[n.point.x][n.point.y] == 2) {
			//if we have reached food, climb up the tree until the root to obtain path
			while (n.parent != null) {
				moves.unshift(n.point);
				if(squares[n.point.x][n.point.y] == 0)
					squares[n.point.x][n.point.y] = 1;
				n = n.parent;
			}
			break;
		}
		// Add current node to closedList
		closedList[n.point.x][n.point.y] = 1;

    // if (n.point.y == 0) { // Don't look up
    //
    // } else {
    //   if(closedList[n.point.x][n.point.y-1] == 0 && (squares[n.point.x][n.point.y-1] == 0 || squares[n.point.x][n.point.y-1] == 2)) {
  	// 		n.children.unshift(new Node(n,new Point(n.point.x,n.point.y-1),new Array()));
    //   }
    // }
    // if (n.point.y == request.body.height) { // Don't look down
    //
    // } else {
    //   if(closedList[n.point.x][n.point.y+1] == 0 && (squares[n.point.x][n.point.y+1] == 0 || squares[n.point.x][n.point.y+1] == 2)) {
  	// 		n.children.unshift(new Node(n,new Point(n.point.x,n.point.y+1),new Array()));
    //   }
    // }
    // if (n.point.x == request.body.width) { // Don't look right
    //
    // } else {
    //   if(closedList[n.point.x+1][n.point.y] == 0 && (squares[n.point.x+1][n.point.y] == 0 || squares[n.point.x+1][n.point.y] == 2)) {
  	// 		n.children.unshift(new Node(n,new Point(n.point.x+1,n.point.y),new Array()));
    //   }
    // }
    // if (n.point.x == 0) { // Don't look left
    //
    // } else {
    //   if(closedList[n.point.x-1][n.point.y] == 0 && (squares[n.point.x-1][n.point.y] == 0 || squares[n.point.x-1][n.point.y] == 2)) {
  	// 		n.children.unshift(new Node(n,new Point(n.point.x-1,n.point.y),new Array()));
    //   }
    // }
    // Add adjacent nodes to openlist to be processed.
		if(closedList[n.point.x][n.point.y-1] == 0 && (squares[n.point.x][n.point.y-1] == 0 || squares[n.point.x][n.point.y-1] == 2))
			n.children.unshift(new Node(n,new Point(n.point.x,n.point.y-1),new Array()));
		if(closedList[n.point.x+1][n.point.y] == 0 && (squares[n.point.x+1][n.point.y] == 0 || squares[n.point.x+1][n.point.y] == 2))
			n.children.unshift(new Node(n,new Point(n.point.x+1,n.point.y),new Array()));
		if(closedList[n.point.x][n.point.y+1] == 0 && (squares[n.point.x][n.point.y+1] == 0 || squares[n.point.x][n.point.y+1] == 2))
			n.children.unshift(new Node(n,new Point(n.point.x,n.point.y+1),new Array()));
		if(closedList[n.point.x-1][n.point.y] == 0 && (squares[n.point.x-1][n.point.y] == 0 || squares[n.point.x-1][n.point.y] == 2))
			n.children.unshift(new Node(n,new Point(n.point.x-1,n.point.y),new Array()));
		for(var i=0;i<n.children.length;i++){
			openList.push(n.children[i]);
		}
	}
}

//helper function checks if two points are adjacent. Used to check if moves are legal.
function is_adjacent(point1, point2){
	if(point1.x == point2.x && (point1.y == point2.y-1 || point1.y == point2.y+1))
		return true;
	if(point1.y == point2.y && (point1.x == point2.x-1 || point1.x == point2.x+1))
		return true;
	return false;
}

//move the snake to the new Point given
function move(new_head, request){
	//check that this is a legal move. Square must be adjacent and empty (can move to empty, food or path.
	if((!is_adjacent(new_head,request.body.you.body.data[0])) || squares[new_head.x][new_head.y] > 2){
		return false;
	}

	//clear the tail
	squares[request.body.you.body.data[request.body.you.length-1].x][request.body.you.body.data[request.body.you.length-1].y] = 0;

	//move the snake forward
	// for(var i=request.body.you.length-1;i>0;i--){
	// 	request.body.you.body.data[i].x = snake[i-1].x;
	// 	request.body.you.body.data[i].y = snake[i-1].y;
	// }
	// request.body.you.body.data[0].x = new_head.x;
	// request.body.you.body.data[0].y = new_head.y;

  return new_head;
}


// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})





function pathTo(node) {
  var curr = node;
  var path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}

function getHeap() {
  return new BinaryHeap(function(node) {
    return node.f;
  });
}

var astar = {
  /**
  * Perform an A* Search on a graph given a start and end node.
  * @param {Graph} graph
  * @param {GridNode} start
  * @param {GridNode} end
  * @param {Object} [options]
  * @param {bool} [options.closest] Specifies whether to return the
             path to the closest node if the target is unreachable.
  * @param {Function} [options.heuristic] Heuristic function (see
  *          astar.heuristics).
  */
  search: function(graph, start, end, options) {
    graph.cleanDirty();
    options = options || {};
    var heuristic = options.heuristic || astar.heuristics.manhattan;
    var closest = options.closest || false;

    var openHeap = getHeap();
    var closestNode = start; // set the start node to be the closest if required

    start.h = heuristic(start, end);
    graph.markDirty(start);

    openHeap.push(start);

    while (openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (currentNode === end) {
        return pathTo(currentNode);
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node.
      var neighbors = graph.neighbors(currentNode);

      for (var i = 0, il = neighbors.length; i < il; ++i) {
        var neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall()) {
          // Not a valid node to process, skip to next neighbor.
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        var gScore = currentNode.g + neighbor.getCost(currentNode);
        var beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {

          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            // If the neighbour is closer than the current closestNode or if it's equally close but has
            // a cheaper path than the current closest node then it becomes the closest node
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor;
            }
          }

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          } else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    if (closest) {
      return pathTo(closestNode);
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  },
  // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
  heuristics: {
    manhattan: function(pos0, pos1) {
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    },
    diagonal: function(pos0, pos1) {
      var D = 1;
      var D2 = Math.sqrt(2);
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
  },
  cleanNode: function(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
};

/**
 * A graph memory structure
 * @param {Array} gridIn 2D array of input weights
 * @param {Object} [options]
 * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
 */
function Graph(gridIn, options) {
  options = options || {};
  this.nodes = [];
  this.diagonal = !!options.diagonal;
  this.grid = [];
  for (var x = 0; x < gridIn.length; x++) {
    this.grid[x] = [];

    for (var y = 0, row = gridIn[x]; y < row.length; y++) {
      var node = new GridNode(x, y, row[y]);
      this.grid[x][y] = node;
      this.nodes.push(node);
    }
  }
  this.init();
}

Graph.prototype.init = function() {
  this.dirtyNodes = [];
  for (var i = 0; i < this.nodes.length; i++) {
    astar.cleanNode(this.nodes[i]);
  }
};

Graph.prototype.cleanDirty = function() {
  for (var i = 0; i < this.dirtyNodes.length; i++) {
    astar.cleanNode(this.dirtyNodes[i]);
  }
  this.dirtyNodes = [];
};

Graph.prototype.markDirty = function(node) {
  this.dirtyNodes.push(node);
};

Graph.prototype.neighbors = function(node) {
  var ret = [];
  var x = node.x;
  var y = node.y;
  var grid = this.grid;

  // West
  if (grid[x - 1] && grid[x - 1][y]) {
    ret.push(grid[x - 1][y]);
  }

  // East
  if (grid[x + 1] && grid[x + 1][y]) {
    ret.push(grid[x + 1][y]);
  }

  // South
  if (grid[x] && grid[x][y - 1]) {
    ret.push(grid[x][y - 1]);
  }

  // North
  if (grid[x] && grid[x][y + 1]) {
    ret.push(grid[x][y + 1]);
  }

  if (this.diagonal) {
    // Southwest
    if (grid[x - 1] && grid[x - 1][y - 1]) {
      ret.push(grid[x - 1][y - 1]);
    }

    // Southeast
    if (grid[x + 1] && grid[x + 1][y - 1]) {
      ret.push(grid[x + 1][y - 1]);
    }

    // Northwest
    if (grid[x - 1] && grid[x - 1][y + 1]) {
      ret.push(grid[x - 1][y + 1]);
    }

    // Northeast
    if (grid[x + 1] && grid[x + 1][y + 1]) {
      ret.push(grid[x + 1][y + 1]);
    }
  }

  return ret;
};

Graph.prototype.toString = function() {
  var graphString = [];
  var nodes = this.grid;
  for (var x = 0; x < nodes.length; x++) {
    var rowDebug = [];
    var row = nodes[x];
    for (var y = 0; y < row.length; y++) {
      rowDebug.push(row[y].weight);
    }
    graphString.push(rowDebug.join(" "));
  }
  return graphString.join("\n");
};

function GridNode(x, y, weight) {
  this.x = x;
  this.y = y;
  this.weight = weight;
}

GridNode.prototype.toString = function() {
  return "[" + this.x + " " + this.y + "]";
};

GridNode.prototype.getCost = function(fromNeighbor) {
  // Take diagonal weight into consideration.
  if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
    return this.weight * 1.41421;
  }
  return this.weight;
};

GridNode.prototype.isWall = function() {
  return this.weight === 0;
};

function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function(node) {
    var i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    var end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    // Fetch the element that has to be sunk.
    var element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {

      // Compute the parent element's index, and fetch it.
      var parentN = ((n + 1) >> 1) - 1;
      var parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    // Look up the target element and its score.
    var length = this.content.length;
    var element = this.content[n];
    var elemScore = this.scoreFunction(element);

    while (true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) << 1;
      var child1N = child2N - 1;
      // This is used to store the new position of the element, if any.
      var swap = null;
      var child1Score;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N];
        var child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};
