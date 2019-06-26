"""The Python implementation of the GRPC helloworld.Greeter server."""

from concurrent import futures
import time
import logging

import grpc

import openfas_pb2
import openfas_pb2_grpc

_ONE_DAY_IN_SECONDS = 60 * 60 * 24


class Acknowledger(openfas_pb2_grpc.OpenFasServicer):

    def PCRoute(self, request_iterator, context):
        count = 0
        lastid = -1
        for r in request_iterator:
            count += 1
            lastid = r.frameId
        return openfas_pb2.FrameSummary(point_cloud_count=count, last_id=lastid, elapsed_time=2)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    openfas_pb2_grpc.add_OpenFasServicer_to_server(Acknowledger(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    with open('server_times.txt', 'w') as f:
        f.write("Server Times\n")
    logging.basicConfig()
    serve()