function initBuffers(gl) {
  const buffer = initPositionBuffer(gl);

  return {
    position: buffer.position,
    color: buffer.color,
  };

}

function initPositionBuffer(gl) {
   // 正方形の位置を保存するためのバッファーを作成する
  const positionBuffer = gl.createBuffer();

  // positionBuffer をバッファー操作の適用対象として
  // 選択する
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 正方形の頂点座標の配列を作成する
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  // 形を作るために頂点座標のリストを WebGL に渡す。
  // JavaScript の配列から Float32Array に変換したもので
  // バッファーを埋める。
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var colors = [
    1.0,  1.0,  1.0,  1.0,    // 白
    1.0,  0.0,  0.0,  1.0,    // 赤
    0.0,  1.0,  0.0,  1.0,    // 緑
    0.0,  0.0,  1.0,  1.0     // 青
  ];
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

export { initBuffers };
