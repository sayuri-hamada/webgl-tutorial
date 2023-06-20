function initBuffers(gl) {
  const buffer = initPositionBuffer(gl);

  return {
    position: buffer.position,
    color: buffer.color,
    indices: buffer.indices
  };



}

function initPositionBuffer(gl) {
   // 正方形の位置を保存するためのバッファーを作成する
  const positionBuffer = gl.createBuffer();

  // positionBuffer をバッファー操作の適用対象として
  // 選択する
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 正方形の頂点座標の配列を作成する
  const positions = [
     // Front face
     -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
];

  // 形を作るために頂点座標のリストを WebGL に渡す。
  // JavaScript の配列から Float32Array に変換したもので
  // バッファーを埋める。
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // 前面: 白
    [1.0,  0.0,  0.0,  1.0],    // 背面: 赤
    [0.0,  1.0,  0.0,  1.0],    // 上面: 緑
    [0.0,  0.0,  1.0,  1.0],    // 底面: 青
    [1.0,  1.0,  0.0,  1.0],    // 右側面: 黄
    [1.0,  0.0,  1.0,  1.0]     // 左側面: 紫
  ];

  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }


  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };


}

export { initBuffers };
