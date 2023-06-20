function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);

  return {
    position: positionBuffer,
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

  return positionBuffer;
}

export { initBuffers };
