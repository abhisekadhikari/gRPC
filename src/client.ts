// -----------------------------------------
// STEP 1: Import core modules and libraries
// -----------------------------------------

// Node's built-in path module to resolve file paths in a cross-platform way.
import path from "node:path";

// The gRPC core library for Node.js — provides client APIs,
// handles HTTP/2 connections, serialization, and method invocation.
import * as grpc from "@grpc/grpc-js";

// The proto loader reads and parses your .proto files at runtime,
// turning them into JavaScript definitions gRPC can use.
import * as protoLoader from "@grpc/proto-loader";

// ------------------------------------------
// STEP 2: Import TypeScript type definitions
// ------------------------------------------
// These interfaces and types were generated when you ran `npm run gen`
// using proto-loader-gen-types. They give you autocompletion and safety.

import { ProtoGrpcType } from "../proto/generated/awesome"; // Root namespace type
import { HelloRequest } from "../proto/generated/awesome/HelloRequest"; // Request message type
import { HelloReply } from "../proto/generated/awesome/HelloReply"; // Response message type

// ------------------------------------------
// STEP 3: Resolve the .proto file path
// ------------------------------------------
// Use an absolute path so the file loads correctly regardless of CWD.
const PROTO = path.resolve("proto", "awesome.proto");

// ------------------------------------------
// STEP 4: Load the .proto definition at runtime
// ------------------------------------------
// proto-loader reads the .proto file and outputs a structure gRPC understands.
// The same options are used on both client and server to stay consistent.
const pkgDef = protoLoader.loadSync(PROTO, {
    keepCase: false, // Convert field & method names to camelCase in JS (SayHello → sayHello)
    longs: String, // Represent 64-bit integers as strings
    enums: String, // Represent enums as string names
    defaults: true, // Fill in default values for missing fields
    oneofs: true, // Support "oneof" proto fields
});

// ------------------------------------------
// STEP 5: Create a typed gRPC object
// ------------------------------------------
// We cast the loaded package definition to our generated ProtoGrpcType,
// so TypeScript knows the structure (services, messages, methods, etc.)
const grpcObj = grpc.loadPackageDefinition(pkgDef) as unknown as ProtoGrpcType;

// Access the service constructor from the 'awesome' package namespace.
const Greeter = grpcObj.awesome.Greeter; // A client constructor (not an instance yet)

// ------------------------------------------
// STEP 6: Create the client instance
// ------------------------------------------
// This connects to the gRPC server we started earlier.
// grpc.credentials.createInsecure() means plaintext (no TLS).
const client = new Greeter(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

// ------------------------------------------
// STEP 7: Make a unary RPC call (request/response)
// ------------------------------------------
// The client invokes the sayHello method, sending a HelloRequest message.
// Unary = one request → one response.
client.sayHello(
    { name: "Abhisek Adhikari" } as HelloRequest, // The request payload
    (err?: grpc.ServiceError | null, res?: HelloReply) => {
        // This callback runs when the server responds (or on error).
        if (err) {
            console.error("sayHello error:", err);
            return;
        }

        // On success, log the HelloReply message from the server.
        console.log("Unary response:", res);
    }
);
