import { Queue, type ConnectionOptions } from "bullmq";
import type { ExecutionTask } from "@tessera/shared-types";

const REDIS_HOST = process.env["REDIS_HOST"] ?? "127.0.0.1";
const REDIS_PORT = Number(process.env["REDIS_PORT"] ?? 6379);

export const QUEUE_NAME = "code-execution" as const;

export function createRedisConnectionOptions(): ConnectionOptions {
  return { host: REDIS_HOST, port: REDIS_PORT, maxRetriesPerRequest: null };
}

export function createExecutionQueue(connection?: ConnectionOptions): Queue<ExecutionTask> {
  const conn = connection ?? createRedisConnectionOptions();
  return new Queue(QUEUE_NAME, { connection: conn });
}
