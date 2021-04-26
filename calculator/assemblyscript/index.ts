import { Request, Response, ResponseBuilder, Handlers as HTTPHandlers } from "@wasmcloud/actor-http-server/assembly/index";
import { HealthCheckResponse, HealthCheckRequest, Handlers as CoreHandlers, HealthCheckResponseBuilder } from "@wasmcloud/actor-core/assembly/index";
import { JSONEncoder } from "assemblyscript-json";

export function wapc_init(): void {
  CoreHandlers.registerHealthRequest(HealthCheck);
  HTTPHandlers.registerHandleRequest(HandleRequest);
}

function HealthCheck(request: HealthCheckRequest): HealthCheckResponse {
  return new HealthCheckResponseBuilder().withHealthy(true).withMessage("AssemblyScript Calculator Healthy").build();
}

function HandleRequest(request: Request): Response {
  
  const nums = request.queryString.split(",")
  const numOne = parseInt(nums[0])
  const numTwo = parseInt(nums[1])
  let result = ""
  
  switch(request.path) {
    case "/add":
      result = `add: ${numOne} + ${numTwo} = ${numOne + numTwo}`
      break;
    case "/sub":
      result = `subtract: ${numOne} + ${numTwo} = ${numOne - numTwo}`
      break;
    case "/div":
      if (numTwo === 0) {
        result = "Can not divide by zero!"
      } else {
        result = `divide: ${numOne} / ${numTwo} = ${numOne / numTwo}`
      }
  }
  
  let encoder = new JSONEncoder();
  
  // Construct output JSON
  encoder.pushObject("");
  encoder.setString("result", result);
  encoder.popObject();
  
  // Get serialized data
  let json: Uint8Array = encoder.serialize();
  
  return new ResponseBuilder()
    .withStatusCode(200)
    .withStatus("OK")
    .withBody(json.buffer)
    .build();
}

// Boilerplate code for waPC.  Do not remove.
import { handleCall, handleAbort } from "@wapc/as-guest";

export function __guest_call(operation_size: usize, payload_size: usize): bool {
  return handleCall(operation_size, payload_size);
}

// Abort function
function abort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void {
  handleAbort(message, fileName, lineNumber, columnNumber);
}