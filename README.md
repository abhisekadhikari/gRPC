# 🚀 gRPC with Node.js + TypeScript (Awesome Demo)

A complete **gRPC server–client** example built with **Node.js**, **TypeScript**, and **@grpc/grpc-js**.
It shows how to:

* Define a `.proto` service contract
* Generate TypeScript types
* Implement gRPC server and client
* Test everything via code or Postman

---

## 📁 Project Structure

```
awesome/
├── proto/
│   ├── awesome.proto                # gRPC service definition
│   └── generated/                   # auto-generated TypeScript types
├── src/
│   ├── server.ts                    # gRPC server implementation
│   └── client.ts                    # gRPC client implementation
├── package.json
└── tsconfig.json
```

---

## ⚙️ Prerequisites

* Node.js 18+
* npm (or yarn / pnpm)
* Optional: [Postman Desktop](https://www.postman.com/downloads/) (v10+) for gRPC testing

---

## 📦 Installation

```bash
git clone https://github.com/<your-username>/awesome-grpc-ts.git
cd awesome-grpc-ts
npm install
```

---

## 🧱 Packages Used

| Package                                      | Purpose                                       |
| -------------------------------------------- | --------------------------------------------- |
| **@grpc/grpc-js**                            | gRPC core library for Node.js                 |
| **@grpc/proto-loader**                       | Loads `.proto` files dynamically              |
| **proto-loader-gen-types**                   | Generates TypeScript definitions              |
| **typescript**, **ts-node**, **ts-node-dev** | TypeScript compiler & runtime tools           |
| **shx**                                      | Cross-platform shell commands for npm scripts |

---

## 🧾 package.json Scripts

| Script               | Description                             |
| -------------------- | --------------------------------------- |
| `npm run gen`        | Generate TypeScript types from `.proto` |
| `npm run dev:server` | Start gRPC server                       |
| `npm run dev:client` | Run gRPC client                         |

---

## 🧩 Proto Definition (`proto/awesome.proto`)

```proto
syntax = "proto3";
package awesome;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply);
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

Defines one RPC: **SayHello**, which accepts a `HelloRequest` and returns a `HelloReply`.

---

## 🖥️ Server Implementation (`src/server.ts`)

```ts
import path from "node:path";
import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import { ProtoGrpcType } from "../proto/generated/awesome";
import { HelloReply } from "../proto/generated/awesome/HelloReply";
import { HelloRequest } from "../proto/generated/awesome/HelloRequest";

const PROTO_PATH = path.resolve("proto", "awesome.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObj = grpc.loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;
const Greeter = grpcObj.awesome.Greeter;

const sayHello = (
  call: grpc.ServerUnaryCall<HelloRequest, HelloReply>,
  cb: grpc.sendUnaryData<HelloReply>
) => {
  const name = call.request?.name ?? "gRPC";
  cb(null, { message: `Hello, ${name}` });
};

const server = new grpc.Server();
server.addService(Greeter.service, { sayHello });

const addr = "0.0.0.0:50051";
server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error("Failed to bind:", err);
  console.log(`✅ gRPC server ready on ${addr}`);
});
```

---

## 💻 Client Implementation (`src/client.ts`)

```ts
import path from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "../proto/generated/awesome";
import { HelloRequest } from "../proto/generated/awesome/HelloRequest";
import { HelloReply } from "../proto/generated/awesome/HelloReply";

const PROTO = path.resolve("proto", "awesome.proto");

const pkgDef = protoLoader.loadSync(PROTO, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObj = grpc.loadPackageDefinition(pkgDef) as unknown as ProtoGrpcType;
const Greeter = grpcObj.awesome.Greeter;

const client = new Greeter("localhost:50051", grpc.credentials.createInsecure());

client.sayHello({ name: "Abhisek" } as HelloRequest, (err, res) => {
  if (err) return console.error("sayHello error:", err);
  console.log("Unary response:", res);
});
```

---

## 🧮 Generate Type Definitions

```bash
npm run gen
```

This generates `proto/generated/awesome.ts` and message files.
Re-run it after every `.proto` change.

---

## ▶️ Run the Project

Start the server:

```bash
npm run dev:server
```

Run the client:

```bash
npm run dev:client
```

✅ Expected Output:

```
Unary response: { message: 'Hello, Abhisek' }
```

---

## 🧪 Test in Postman

1. Open **Postman Desktop**
2. New → gRPC Request
3. Address: `localhost:50051`
4. Import `proto/awesome.proto`
5. Service: `awesome.Greeter`
6. Method: `SayHello`
7. Message (Raw JSON):

   ```json
   {"name": "Abhisek"}
   ```
8. Click **Invoke** → Response `{ "message": "Hello, Abhisek" }`

---

## 🧠 How It Works

* The `.proto` defines your API contract.
* `proto-loader` parses it into a JavaScript-friendly structure.
* `@grpc/grpc-js` implements the gRPC transport and serialization.
* The server listens for HTTP/2 requests and invokes your handlers.
* The client sends requests and automatically deserializes responses.

---

## 🧰 Common Issues

| Problem                          | Solution                                                   |
| -------------------------------- | ---------------------------------------------------------- |
| `UNAVAILABLE: connection closed` | Server not running or wrong port                           |
| `UNIMPLEMENTED`                  | Method name mismatch (use `sayHello` if `keepCase: false`) |
| Port in use                      | Stop old process or change port                            |
| Proto change not reflected       | Re-run `npm run gen`                                       |

---

## 🌱 Next Steps

* Add streaming RPCs (server, client, bidi)
* Implement TLS (SSL)
* Use metadata for authentication
* Add deadlines (timeouts)
* Deploy behind Envoy or NGINX with HTTP/2

---

## 🏷️ License

MIT © 2025 — Built for learning and demonstration.
---
