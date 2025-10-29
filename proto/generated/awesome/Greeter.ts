// Original file: proto/awesome.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { HelloReply as _awesome_HelloReply, HelloReply__Output as _awesome_HelloReply__Output } from '../awesome/HelloReply';
import type { HelloRequest as _awesome_HelloRequest, HelloRequest__Output as _awesome_HelloRequest__Output } from '../awesome/HelloRequest';

export interface GreeterClient extends grpc.Client {
  SayHello(argument: _awesome_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_awesome_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _awesome_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_awesome_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _awesome_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_awesome_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _awesome_HelloRequest, callback: grpc.requestCallback<_awesome_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _awesome_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_awesome_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _awesome_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_awesome_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _awesome_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_awesome_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _awesome_HelloRequest, callback: grpc.requestCallback<_awesome_HelloReply__Output>): grpc.ClientUnaryCall;
  
}

export interface GreeterHandlers extends grpc.UntypedServiceImplementation {
  SayHello: grpc.handleUnaryCall<_awesome_HelloRequest__Output, _awesome_HelloReply>;
  
}

export interface GreeterDefinition extends grpc.ServiceDefinition {
  SayHello: MethodDefinition<_awesome_HelloRequest, _awesome_HelloReply, _awesome_HelloRequest__Output, _awesome_HelloReply__Output>
}
