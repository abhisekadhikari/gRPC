// -------------------------------
// STEP 1: Import required modules
// -------------------------------

// `path` from Node core for resolving file paths
import path from "node:path";

// `@grpc/proto-loader` dynamically loads your .proto file
// and converts it into a JS object usable by gRPC.
import * as protoLoader from "@grpc/proto-loader";

// `@grpc/grpc-js` is the main gRPC implementation for Node.js (pure JS, no native bindings)
import * as grpc from "@grpc/grpc-js";

// -------------------------------------
// STEP 2: Import generated TypeScript types
// -------------------------------------
// These come from running `npm run gen` (proto-loader-gen-types)
// They provide strong typings for services and messages.

import { ProtoGrpcType } from "../proto/generated/awesome"; // Root type for your entire proto package
import { HelloReply } from "../proto/generated/awesome/HelloReply"; // Response message type
import { HelloRequest } from "../proto/generated/awesome/HelloRequest"; // Request message type

// -------------------------------------
// STEP 3: Define where your proto file lives
// -------------------------------------
// We build an absolute path so it works no matter where you run from.
const PROTO_PATH = path.resolve("proto", "awesome.proto");

// ----------------------------------------------------
// STEP 4: Load and parse the proto definition at runtime
// ----------------------------------------------------
// proto-loader converts the .proto into a JS definition that gRPC can consume.
// These options control how the proto is interpreted.
const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false, // Converts field and method names to camelCase (SayHello -> sayHello)
    longs: String, // Represent long integers as strings
    enums: String, // Represent enums as strings
    defaults: true, // Populate default values for omitted fields
    oneofs: true, // Support for oneof fields
});

// ----------------------------------------------------
// STEP 5: Create a gRPC package object from definition
// ----------------------------------------------------
// We load the parsed definition into the grpc library.
// Casting with ProtoGrpcType gives full TypeScript intellisense.
const grpcObj = grpc.loadPackageDefinition(
    packageDef
) as unknown as ProtoGrpcType;

// Access the Greeter service from the `awesome` package namespace
const Greeter = grpcObj.awesome.Greeter;

// ----------------------------------------------------
// STEP 6: Implement your RPC methods (business logic)
// ----------------------------------------------------
// Each RPC in the proto must have a matching function name here.
// Since keepCase=false, "SayHello" becomes "sayHello".
const sayHello = (
    call: grpc.ServerUnaryCall<HelloRequest, HelloReply>, // Incoming request wrapper
    cb: grpc.sendUnaryData<HelloReply> // Callback for sending response
) => {
    // Extract the name field from the incoming HelloRequest message.
    // If it's missing, default to "gRPC".
    const name = call.request?.name ?? "gRPC";

    // Build and send the HelloReply message.
    // The first argument (null) indicates "no error".
    cb(null, { message: `Hello, ${name}` });
};

// ----------------------------------------------------
// STEP 7: Create a new gRPC server instance
// ----------------------------------------------------
const server = new grpc.Server();

// ----------------------------------------------------
// STEP 8: Register the service and its implementation
// ----------------------------------------------------
// This connects the proto's Greeter service definition
// to our TypeScript implementation object.
server.addService(Greeter.service, { sayHello }); // Handler key must match camelCase name

// ----------------------------------------------------
// STEP 9: Bind the server to a TCP address and start
// ----------------------------------------------------
// 0.0.0.0:50051 = listen on all network interfaces, port 50051
const addr = "0.0.0.0:50051";

// `bindAsync` starts listening and automatically calls server.start()
// (no need to call start() manually in grpc-js >= 1.10)
server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) {
        // If the port is in use or unavailable, print the error and stop startup.
        console.error("Failed to bind:", err);
        return;
    }

    // If successful, server is live and ready to accept connections.
    console.log(`✅ gRPC server is ready on ${addr}`);
});
