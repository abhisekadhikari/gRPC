import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GreeterClient as _awesome_GreeterClient, GreeterDefinition as _awesome_GreeterDefinition } from './awesome/Greeter';
import type { HelloReply as _awesome_HelloReply, HelloReply__Output as _awesome_HelloReply__Output } from './awesome/HelloReply';
import type { HelloRequest as _awesome_HelloRequest, HelloRequest__Output as _awesome_HelloRequest__Output } from './awesome/HelloRequest';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  awesome: {
    Greeter: SubtypeConstructor<typeof grpc.Client, _awesome_GreeterClient> & { service: _awesome_GreeterDefinition }
    HelloReply: MessageTypeDefinition<_awesome_HelloReply, _awesome_HelloReply__Output>
    HelloRequest: MessageTypeDefinition<_awesome_HelloRequest, _awesome_HelloRequest__Output>
  }
}

