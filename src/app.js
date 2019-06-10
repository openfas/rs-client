const { GLFWWindow, glfw } = require('./lib/glfw-window');
const Camera = require('./lib/camera');

const SHOW_DEPTH = 1
const SHOW_PC = 1

const win = new GLFWWindow(1280, 720, 'OpenFAS - Session');
const camera = new Camera('realsense');

camera.start();
while(!win.shouldWindowClose()) {
  const frameset = camera.pollFrames();
  const depthMap = camera.colorize(frameset.depthFrame);
  const {pointsFrame, colouredPointCloudFameset} = camera.pointCloudFrame(frameset)
  if (SHOW_DEPTH && depthMap) {
    const color = frameset.colorFrame;
    win.beginPaint();
    glfw.draw2x2Streams(win.window, 2,
      depthMap.data, 'rgb8', depthMap.width, depthMap.height,
      color.data, 'rgb8', color.width, color.height);  
    win.endPaint();
  }
  if (SHOW_PC && pointsFrame.vertices && pointsFrame.textureCoordinates) {
    win.beginPaint();
    glfw.drawDepthAndColorAsPointCloud(
      win.window,
      new Uint8Array(pointsFrame.vertices.buffer),
      pointsFrame.size,
      new Uint8Array(pointsFrame.textureCoordinates.buffer),
      colouredPointCloudFameset.data,
      colouredPointCloudFameset.width,
      colouredPointCloudFameset.height,
      'rgb8');
    win.endPaint();
  }
}
camera.stop();
winPCStream.destroy();
