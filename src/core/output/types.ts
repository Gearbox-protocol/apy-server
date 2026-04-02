import type { Output as OutputSDK } from "@gearbox-protocol/sdk/rewards";
import type { PointsType } from "../../tokens/points";

export type Output = OutputSDK<PointsType, PointsType>;

export interface IOutputWriter {
  write: (data: unknown) => Promise<void>;
}
