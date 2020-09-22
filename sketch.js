let cols; //number of columns
let rows; //number of rows
let w; //width of a box
let h; //height of a box
let grid; //grid containing all nodes (a 2D array)
let open;
let inOpen;
let closed = [];
let inClosed;
let start, end; //start and end nodes

//constructor 
function setup() {
  // frameRate(1000);
  createCanvas(750, 750);
  background(220);
  cols = 100;
  rows = 100;
  w = width/cols;
  h = height/rows;
  grid = new Array(rows);
  inOpen = new Array(rows);
  inClosed = new Array(rows);
  
  
  for(let i = 0; i < rows; i++){
    grid[i] = new Array(cols);
    inOpen[i] = new Array(cols);
    inClosed[i] = new Array(cols);
    
  }
  
  //initializing the grid with rows*cols number of Nodes
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
      grid[i][j] = new Node();
      grid[i][j].i = i;
      grid[i][j].j = j;
      grid[i][j].x = i*w;
      grid[i][j].y = j*h;
      //
      inOpen[i][j] = false;
      inClosed[i][j] = false;
    }
  }
  
  //adding neighbours
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
      grid[i][j].addNeighbours();
    }
  }
  // console.log(grid[10][10].neighbours); 
  // start = grid[0][0];
  start = grid[floor(random(0, rows-1))][floor(random(0, rows-1))];
  start.start = true;
  // end = grid[11][11];
  end = grid[floor(random(0, rows-1))][floor(random(0, rows-1))];
  end.goal = true;
  
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      if(random()<0.3 && grid[i][j]!=start && grid[i][j]!=end){
        grid[i][j].block = true;
      }
      grid[i][j].draw();
    }
  }
  
  start.g = 0;
  start.h = heuristic(start, end);
  start.f = start.g + start.h;
  
  open = new Queue();//priority queue with lowest f-cost as the priority
  open.push(start);
  inOpen[start.i][start.j] = true;
}

function draw() {
  if(!open.isEmpty()){
    let current = open.pop();
    inOpen[current.i][current.j] = false;
    closed.push(current);
    inClosed[current.i][current.j] = true;
    // console.log("Explored: " + current.i + ", " + current.j);
    
    if(current == end){
      console.log("FOUND!");
      noLoop();
    }
    else{
      for(let i = 0; i<current.neighbours.length; i++){
        let neighbour = current.neighbours[i];
        if(!neighbour.block && !inClosed[neighbour.i][neighbour.j]){
          let tentative_f = heuristic(end, neighbour) + current.g + heuristic(current, neighbour);
          // let tentative_f = heuristic(end, neighbour) + current.g + 1;
          if(!inOpen[neighbour.i][neighbour.j] || tentative_f<neighbour.f){
            // neighbour.g = current.g + 1;
            neighbour.g = current.g + heuristic(current, neighbour);
            neighbour.h = heuristic(end, neighbour);
            neighbour.f = tentative_f;
            neighbour.parent = current;
            if(inOpen[neighbour.i][neighbour.j]){
              open.remove(neighbour);
            }
            open.push(neighbour);
            inOpen[neighbour.i][neighbour.j] = true;
          }
        }
      }
    }
    for(let i = 0; i < closed.length; i++){
      // visited[i].draw(color(179, 255, 179));
      closed[i].draw(color(249, 227, 249));
    }
    
    for(let i = 0; i < open.a.length; i++){
      open.a[i].draw(color(169, 86, 166));
      // closed[i].draw(color(180, 230, 255));
    }
    
    let path = [];
    let p = current;
    while(p){
      // p.draw(color(148,0,211));
      // p = p.parent;
      path.push(p);
      p = p.parent;
    }
      
  noFill();
  // stroke(0, 77, 0);
  stroke(141, 51, 138);
  strokeWeight(w / 4);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
  endShape();
  }
  if(open.isEmpty()){
    console.log(open.a);
    console.log(closed); 
    noLoop();}
}

function heuristic(node1, node2){
  //euclidean
  let h = dist(node1.i, node1.j, node2.i, node2.j);
  return h;
}