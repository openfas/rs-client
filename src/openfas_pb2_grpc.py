# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc

import openfas_pb2 as openfas__pb2


class OpenFasStub(object):
  """Interface exported by the server.
  """

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.PCRoute = channel.stream_unary(
        '/openfas.OpenFas/PCRoute',
        request_serializer=openfas__pb2.Frame.SerializeToString,
        response_deserializer=openfas__pb2.FrameSummary.FromString,
        )


class OpenFasServicer(object):
  """Interface exported by the server.
  """

  def PCRoute(self, request_iterator, context):
    """A client-to-server streaming RPC.

    Accepts a stream of point cloud frames , returning a
    frame summary when stream is completed.
    """
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_OpenFasServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'PCRoute': grpc.stream_unary_rpc_method_handler(
          servicer.PCRoute,
          request_deserializer=openfas__pb2.Frame.FromString,
          response_serializer=openfas__pb2.FrameSummary.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'openfas.OpenFas', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))