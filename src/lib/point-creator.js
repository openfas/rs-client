const rs2 = require('node-librealsense');
var async = require('async');
var _ = require('lodash');
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

function runPCRoute(client, proto, callback) {
    const colorizer = new rs2.Colorizer();  // This will make depth image pretty
    const pipeline = new rs2.Pipeline();  // Main work pipeline of RealSense camera
    const config = new rs2.Config()
    config.enableDeviceFromFile('/home/oliverdolk/rs-client/src/sample.bag')
    pipeline.start(config);  // Start camera

    var call = client.PCRoute(function(error, stats) {
        if (error) {
          callback(error);
          return;
        }
        console.log('Point cloud count:', stats.point_cloud_count, 'points');
        console.log('Last id:', stats.last_id);
        console.log('Elapsed time:', stats.elapsed_time);
        callback();
    });

    function pointSender(frameId, height, width, time, points) {
        return function(callback) {
          console.log("Starting to send frameId: ", frameId);
          var pc = {}
          pc.frameId = frameId;
          pc.height = height;
          pc.width = width;
          pc.time = time;
          pc.points = [];
          
          for (var i = 0; i < points.length; i++) {
            pc.points.push(points[i]);
          }

          call.write(pc);

          _.delay(callback, _.random(10, 15));
        };
    }

    var num_frames = 10;
    var point_senders = [];
    for (var i = 0; i < num_frames; i++) {
        const frameset = pipeline.waitForFrames();  // Get a set of frames
        const depth = frameset.depthFrame;  // Get depth data
        //const depthRGB = colorizer.colorize(depth);  // Make depth image pretty
        const color = frameset.colorFrame;  // Get RGB image
    
        depth_data = depth.getData();
        color_data = color.getData();
        point_senders[i] = pointSender(i, depth.height, depth.width, i, depth_data);
    }

    async.series(point_senders, function() {
      call.end();
      // Before exiting, do cleanup.
      rs2.cleanup();
    });

    
}

exports.runPCRoute = runPCRoute;