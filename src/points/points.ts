import type { Address } from "viem";

import type { PointsHandler, PointsResult } from "../utils";
import { POINTS_INFO_BY_NETWORK } from "./constants";

const getPoints: PointsHandler = async network => {
  const points = POINTS_INFO_BY_NETWORK[network];

  const result = points.reduce<PointsResult>((acc, p) => {
    const address = p.address.toLowerCase() as Address;

    acc[address] = { ...p, address };

    return acc;
  }, {});

  return result;
};

export { getPoints };
