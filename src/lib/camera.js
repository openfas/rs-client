const rs2 = require('node-librealsense');

const deviceWrapper = (device) => ({
  realsense: {
    pipeline: new rs2.Pipeline(),
    utils: {
      colorizer: new rs2.Colorizer(),
      pointcloud: new rs2.PointCloud(),
      cleanup: rs2.cleanup,
    }
  }
})[device];

class Camera {
  constructor(camera) {
    const device = deviceWrapper(camera);
    device && Object.assign(this, device);
  }

  /** Camera Initialisers */
  start() {
    this.pipeline.start();
  }

  stop() {
    this.pipeline.stop();
    this.pipeline.destroy();
    this.utils.cleanup();
  }

  /* Camera Utility Wrappers */
  pollFrames() {
    return this.pipeline.waitForFrames();
  }

  colorize(frameset) {
    return this.utils.colorizer.colorize(frameset)
  }

  pointCloudFrame(frameset) {
    const pointsFrame = this.utils.pointcloud.calculate(frameset.depthFrame);
    this.utils.pointcloud.mapTo(frameset.colorFrame);
    return { colouredPointCloudFameset: frameset.colorFrame, pointsFrame };
  }
}

module.exports = Camera;
