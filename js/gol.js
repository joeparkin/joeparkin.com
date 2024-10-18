$(document).ready(function() {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    var cs = 10; 			// cell size
    var cellshigh = h/cs; 	// how many cells high the canvas is
    var cellswide = w/cs;	// how many cells wide the canvas is
    var delay = 100;		// time in ms between iterations
    var iteration = 0;		// number of iterations computed
    var matrix = createArray( h/cs , w/cs );	// array to store cell state
    var matrix2 = createArray( h/cs , w/cs );	// array for calculated future state
    var run = true;

    clearArrays();		// populate all cells as empty (0)
    matrix[10][1] = 1;	// drawing a glider on screen initially
    matrix[11][2] = 1;
    matrix[9][3] = 1;
    matrix[10][3] = 1;
    matrix[11][3] = 1;
    matrix[20][1] = 1;	// drawing a glider on screen initially
    matrix[22][2] = 1;
    matrix[23][3] = 1;
    matrix[24][3] = 1;
    matrix[25][3] = 1;
    matrix[26][1] = 1;	// drawing a glider on screen initially
    matrix[27][2] = 1;
    matrix[28][3] = 1;
    matrix[29][3] = 1;
    matrix[36][1] = 1;	// drawing a glider on screen initially
    matrix[37][2] = 1;
    matrix[38][3] = 1;
    matrix[39][3] = 1;
    matrix[46][1] = 1;	// drawing a glider on screen initially
    matrix[47][2] = 1;
    matrix[48][3] = 1;
    matrix[49][3] = 1;
    matrix[41][6] = 1;	// drawing a glider on screen initially
    matrix[42][6] = 1;
    matrix[43][6] = 1;
    matrix[44][6] = 1;

    canvas.addEventListener( "mousedown", toggleCell, true );
    
    
    function createArray( length ) { // create X dimensional arrays
        var arr = new Array(length || 0),
            i = length;
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(this, args);
        }
        return arr;
    }
    
    function clearArrays() { // populate all cells as empty
        for ( var j = 0; j < cellshigh; j++ ) {
            for ( var i = 0; i < cellswide; i++ ) {
                matrix[i][j] = 0;
                matrix2[i][j] = 0;
            }
        }
    }
    
    // I have to include this because javascript thinks it's okay to redefine mathematics.
    function mod( n, m ) {
        return (( m % n ) + n ) % n;
    }
    
    function copyArray() {
        for ( var j = 0; j < cellshigh; j++ ) {
            for ( var i = 0; i < cellswide; i++ ) {
                matrix[i][j] = matrix2[i][j];
            }
        }
    }
    
    function printArray() {
        for ( var j = 0; j < cellshigh; j++ ) {
            for ( var i = 0; i < cellswide; i++ ) {
                if ( matrix[i][j] == 1 ) {
                    paintCell( i, j );
                }
            }
        }
    }
    
    function nextGeneration() {
        for ( var j = 0; j < cellshigh;  j++ ) {
            for ( var i = 0; i < cellswide; i++ ) {
                var u = mod( cellshigh , (j - 1) ); // up
                var d = mod( cellshigh , (j + 1) ); // down
                var l = mod( cellswide , (i - 1) ); // left
                var r = mod( cellswide , (i + 1) ); // right
                var totalNeighbours = matrix[l][u] + matrix[i][u] + matrix[r][u] + matrix[l][j] + matrix[r][j] + matrix[l][d] + matrix[i][d] + matrix[r][d];
                if ( matrix[i][j] == 1 ) {
                    if ( totalNeighbours < 2 | totalNeighbours > 3 ) {
                        matrix2[i][j] = 0;
                    } else {
                        matrix2[i][j] = 1;
                    }
                } else {
                    if ( totalNeighbours == 3 ) {
                        matrix2[i][j] = 1;
                    } else {
                        matrix2[i][j] = 0;
                    }
                }
            }
        }
    }
    
    function init() {
        if( typeof game_loop != "undefined" ) clearInterval( game_loop );
        game_loop = setInterval( paint, delay ); // run paint function every delay ms
    }
    init();
    
    function paint() {
        if ( run ) {
            ctx.fillStyle = "white";
            ctx.fillRect( 0, 0, w, h );
            ctx.strokeStyle = "black";
            ctx.strokeRect( 0, 0, w, h );
            
            printArray();
            nextGeneration();
            iteration++;
            copyArray();
        }
    }
    
    function paintCell( x, y ) {
        ctx.fillStyle = "black";
        ctx.fillRect( x*cs, y*cs, cs, cs );
        ctx.strokeStyle = "white";
        ctx.strokeRect( x*cs, y*cs, cs, cs );
    }

    function unpaintCell( x, y ) {	// used when toggling a single cell at once
        ctx.fillStyle = "white";
        ctx.fillRect ( x*cs, y*cs, cs, cs );
    }

    function toggleCell( event ) {
        var x = event.x;
        var y = event.y;
        var canvas = document.getElementById( "canvas" );
        x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
        cellx = ( ( x - x % cs ) / cs );
        celly = ( ( y - y % cs ) / cs );
        if ( matrix[cellx][celly] == 1 ) {	// if clicked cell is alive, unpaint and set it to dead (0)
            matrix[cellx][celly] = 0;
            unpaintCell( cellx, celly );
        } else {
            matrix[cellx][celly] = 1;		// gives life to and paints a dead cell
            paintCell(cellx, celly );
        }
    }

    $(document).keydown( function( e ) {	// spacebar to pause
        var key = e.which;
        if ( key == "32" ) {
            if ( run ) {
                run = false;
            } else {
                run = true;
            }
        }
    });
});