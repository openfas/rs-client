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

    function pointSender(frameId, depth_data, depth_width, depth_height, color_data, color_width, color_height) {
        return function(callback) {
          console.log("Starting to send frameId: ", frameId);
          var frame = {}
          frame.frameId = frameId;

          var depth_frame = {}
          depth_frame.height = depth_height
          depth_frame.width = depth_width
          depth_frame.points = []
  
          
  
          for (var i = 0; i < depth_data.length; i++) {
              depth_frame.points.push(depth_data[i]);
          }
  
          
  
          var rgb_frame = {}
          rgb_frame.height = color_height
          rgb_frame.width = color_width
          rgb_frame.points = []
  
          for (var i = 0; i < color_data.length; i++) {
              rgb_frame.points.push(color_data[i]);
          }

          frame.depth = depth_frame
          frame.color = rgb_frame



          call.write(frame);

          _.delay(callback, _.random(10, 15));
        };
    }

    var num_frames = 10;
    var point_senders = [];
    for (var i = 0; i < num_frames; i++) {
        const frameset = pipeline.waitForFrames();  // Get a set of frames
        const depth = frameset.depthFrame;  // Get depth data
        const color = frameset.colorFrame;  // Get RGB image
        depth_data = depth.getData();
        color_data = color.getData();
        point_senders[i] = pointSender(i, depth_data, depth.width, depth.height, color_data, color.width, color.height);
    }

    async.series(point_senders, function() {
      call.end();
      // Before exiting, do cleanup.
      rs2.cleanup();
    });

    
}

exports.runPCRoute = runPCRoute;