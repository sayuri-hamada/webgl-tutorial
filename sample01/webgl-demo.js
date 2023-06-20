import { initBuffers } from './init-buffers.js'

let squareRotation = 0.0;


main();

function main() {

  const canvas = document.querySelector('#glcanvas');


  // GL コンテキストを初期化する
  const gl = canvas.getContext('webgl');

  // WebGL が使用可能で動作している場合にのみ続行します
  if(gl === null) {
    alert('WebGL を初期化できません。ブラウザーまたはマシンが対応していない可能性があります。');
    return;
  }

  // クリアカラーを黒に設定し、完全に不透明にします
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 指定されたクリアカラーでカラーバッファーをクリアします
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 頂点シェーダーのプログラム
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  // シェーダープログラムを初期化します。ここで頂点への
  // ライティングなどがすべて確立されます。
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // シェーダープログラムを使用するために必要な情報をすべて収集する。
  // シェーダープログラムが aVertexPosition に使用している属性を調べ、
  // ユニフォームの位置を調べます。
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),

    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // ここでは、これから描画するすべてのオブジェクトを
  // 構築するルーチンを呼び出しています。
  const buffers = initBuffers(gl);

  let then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);


}

//
// シェーダープログラムを初期化し、WebGL にデータの描画方法を教える
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // シェーダープログラムの作成
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // シェーダープログラムの作成に失敗した場合、アラートを出す
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `シェーダープログラムを初期化できません: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }
  return shaderProgram;
}

//
// 指定された種類のシェーダーを作成し、ソースをアップロード、
// そしてコンパイル。
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // シェーダーオブジェクトにソースを送信
  gl.shaderSource(shader, source);

  // シェーダープログラムをコンパイル
  gl.compileShader(shader);

  // コンパイルが成功したか確認する
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `シェーダーのコンパイル時にエラーが発生しました: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function drawScene(gl, programInfo, buffers, deltaTime) {
  gl.clearColor = (0.0, 0.0, 0.0, 1.0); // 黒でクリア、完全に不透明
  gl.clearDepth(1.0); //全てをクリア
  gl.enable(gl.DEPTH_TEST); //深度テストを有効化
  gl.depthFunc(gl.LEQUAL); //奥にあるものは隠れるようにする

  // 描写を行う前にキャンバスをクリアする
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // カメラで遠近感を再現するために使用される特殊な行列、
  // パースペクティブマトリクスを作成します。視野角は45度、
  // 幅と高さの比率はキャンバスの表示サイズに合わせ、
  // カメラから 0.1 単位から 100 単位までのオブジェクトのみを
  // 表示するようにします。

  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // メモ: glmatrix.js は常に第一引数として結果の
  // 受け取り先を取る
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 描写位置をシーンの中央である "identity" ポイントにセットする
  const modelViewMatrix = mat4.create();

  // そして描写位置を正方形を描写し始めたい位置に少しだけ動かす
  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    [-0.0, 0.0, -6.0]
  );

  mat4.rotate(modelViewMatrix,
    modelViewMatrix,
    squareRotation,
    [0, 0, 1]
  );

  // WebGL にどのように座標バッファーから vertexPosition 属性に
  // 座標を引き出すか伝える

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }


  // setPositionAttribute(gl, buffers, programInfo)

  // WebGLに、描写するのに我々のプログラムを用いるように伝える
  gl.useProgram(programInfo.program);

  // シェーダーユニフォームをセット
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }

  // 次の描画のためにローテーションを更新します
  squareRotation += deltaTime;

}
