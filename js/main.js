var scene, camera, renderer, spheres, verts;
spheres = [];
  const audioCtx = new AudioContext();
  //Create audio source
  //Here, we use an audio file, but this could also be e.g. microphone input
  const audioEle = new Audio();
  audioEle.crossOrigin = "anonymous";
  audioEle.src = 'audio/electricfeel.mp3';//insert file name here
  audioEle.autoplay = true;
  audioEle.preload = 'auto';
  const audioSourceNode = audioCtx.createMediaElementSource(audioEle);

  //Create analyser node
  const analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 256;
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);

  audioSourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);
function rgb(r,g,b){
  return decimalColorToHTMLcolor(rgbtoDecimal(r,g,b));
}
function rgbtoDecimal(r,g,b) {
  return r * 65536 + g * 256 + b;
}

function decimalColorToHTMLcolor(number) {
    //converts to a integer
    var intnumber = number - 0;

    // isolate the colors - really not necessary
    var red, green, blue;

    // needed since toString does not zero fill on left
    var template = "#000000";

    // in the MS Windows world RGB colors
    // are 0xBBGGRR because of the way Intel chips store bytes
    red = (intnumber&0x0000ff) << 16;
    green = intnumber&0x00ff00;
    blue = (intnumber&0xff0000) >>> 16;

    // mask out each color and reverse the order
    intnumber = red|green|blue;

    // toString converts a number to a hexstring
    var HTMLcolor = intnumber.toString(16);

    //template adds # for standard HTML #RRGGBB
    HTMLcolor = template.substring(0,7 - HTMLcolor.length) + HTMLcolor;

    return HTMLcolor;
}
  function init() {

    scene = new THREE.Scene();
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 0.1, 2000);
    camera.position.set(-93,25,-111);
    scene.add(camera);

    window.addEventListener('resize', function() {
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });

    renderer.setClearColor(0x222222, 1);

    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);


    var xDistance = 8;
    var zDistance = 16;
    var geometry = new THREE.BoxGeometry(4,1,4);


    //initial offset so does not start in middle.
    var xOffset = -10;

    for(var i = 1; i <= 16; i++){
        for(var j = 1; j <= 8; j++){

                var material = new THREE.MeshBasicMaterial({color:decimalColorToHTMLcolor(i*j*10000000 + 3078712)});
                var mesh  = new THREE.Mesh(geometry, material);
                mesh.position.x = (xDistance * i) + xOffset;
                mesh.position.z = (zDistance * j);
                spheres.push(mesh);
                scene.add(mesh);
        }
};


 	controls = new THREE.OrbitControls(camera, renderer.domElement);

  }

  function animate() {
    requestAnimationFrame(animate);
    analyserNode.getFloatFrequencyData(dataArray);
    for (var i = 0; i < dataArray.length & i < spheres.length; i++) {
      var obj = spheres[i];
      var pos = dataArray[i]/-5;
      obj.scale.y = pos;
    }



    console.log(camera.position.x + ", " + camera.position.y + ", " + camera.position.z);
    renderer.render(scene, camera);
    controls.update();
  }
  init();
  animate();
