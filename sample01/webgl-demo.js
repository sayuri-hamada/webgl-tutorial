import { initBuffers } from './init-buffers.js'
import { drawScene } from './draw-scene.js';

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
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // ここでは、これから描画するすべてのオブジェクトを
  // 構築するルーチンを呼び出しています。
  const buffers = initBuffers(gl);

  // シーンを描画
  drawScene(gl, programInfo, buffers);

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

