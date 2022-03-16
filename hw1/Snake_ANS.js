var canvas;
var gl;
var posManLoc, posMan = vec2(  0,  -0.9 );
var seconds, saved_sec;

//Enemy
var posManLoc1, posMan1 = [vec2(  0.8,  0.9  ),vec2(  0.7,  0.9  ),vec2(  0.6,  0.9  ),vec2(  0.5,  0.9  ),vec2(  0.4,  0.9  ),vec2(  0.3,  0.9  ),vec2(  0.2,  0.9  ),vec2(  0.1,  0.9  ),
vec2(  -0.8,  0.9  ),vec2(  -0.7,  0.9  ),vec2(  -0.6,  0.9  ),vec2(  -0.5,  0.9  ),vec2(  -0.4,  0.9  ),vec2(  -0.3,  0.9  ),vec2(  -0.2,  0.9  ),vec2(  -0.1,  0.9  ),
vec2(  0.8,  0.75  ),vec2(  0.7,  0.75 ),vec2(  0.6,  0.75 ),vec2(  0.5,  0.75 ),vec2(  0.4,  0.75 ),vec2(  0.3,  0.75 ),vec2(  0.2,  0.75 ),vec2(  0.1,  0.75 ),
vec2(  -0.8,  0.75 ),vec2(  -0.7,  0.75 ),vec2(  -0.6,  0.75 ),vec2(  -0.5,  0.75 ),vec2(  -0.4,  0.75 ),vec2(  -0.3,  0.75 ),vec2(  -0.2,  0.75 ),vec2(  -0.1,  0.75 )]

var posManAtk = vec2( 2, 2 ); 




var pre_directLoc, pre_direct = vec2(  0,  0 );

var colors = [
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var colors2 = [
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 0.0, 1.0, 1.0 )   // cyan
];

var colors3 = [
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // cyan
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // magenta
    vec4( 1.0, 0.0, 0.0, 1.0 )   // cyan
];

var vertices = [
    vec2( -0.05, -0.05 ),
    vec2( -0.05,  0.05 ),
    vec2(  0.05,  0.05 ),
    vec2(  0.05, -0.05 )
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColor );
    
    posManLoc = gl.getUniformLocation( program, "posMan" );


    window.onkeydown = function( event ) {
        switch(event.keyCode) {
            case 38:
              if (posMan[1] > 0.89) break;
              posMan[1] += 0.1;
              direct = vec2(  0,  1 );
              break;

            case 37:
              if (posMan[0] < -0.89) break;
              posMan[0] -= 0.1;
              direct = vec2(  -1,  0 );
              break;

            case 40:
              if (posMan[1] < -0.89) break;
              posMan[1] -= 0.1;
              direct = vec2(  0,  -1 );
              break;

            case 39:
              if (posMan[0] > 0.89) break;
              posMan[0] += 0.1;
              direct = vec2(  1,  0 );
              break;

      case 32:
        if (posManAtk[1] == 2) {
          posManAtk[0] = posMan[0];
          posManAtk[1] = posMan[1] + 0.1;
          var timer = setInterval(function() {
             posManAtk[1] += 0.05;
             var i;
             for(i = 0; i < 32; ++i){
                if(posManAtk[0] < posMan1[i][0] + 0.05 && posManAtk[0] > posMan1[i][0] - 0.05 && posManAtk[1] < posMan1[i][1] + 0.05 && posManAtk[1] > posMan1[i][1] - 0.05){
                  posManAtk[1] = 2;
                  posMan1[i][1] = 2;
                }
             }
             if(posManAtk[1] > 1.1){
                posManAtk[1] = 2;
                clearInterval(timer);
             }
             var check = true;
             for(i = 0; i < 32; ++i){
              if(posMan1[i][1] != 2){
                check = false;
                break;
              }
             }
             if(check == true)
             {
               alert( "The game is END" );
                  

             }
          }, 20);
        }
              break;

        }
    };
    render();
};



function render() {    
    gl.clear( gl.COLOR_BUFFER_BIT );

  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.uniform2fv( posManLoc, posMan );
    // gl.uniform2fv( directLoc, vec2(  0,  0 ) );
    //gl.uniform2fv( pre_directLoc, vec2(  0,  0 ) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW);
  var i;
  for(i = 0; i < 32; ++i){
      gl.uniform2fv( posManLoc, posMan1[i] );
      gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    }

  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors3), gl.STATIC_DRAW);
    gl.uniform2fv( posManLoc, posManAtk );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    window.requestAnimFrame(render);
}