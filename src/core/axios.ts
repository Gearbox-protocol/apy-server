import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { AXIOS_CACHE_TTL } from "./config";

const instance = Axios.create();

export const cachedAxios = setupCache(instance, {
  location: "server",
  interpretHeader: false,
  ttl: AXIOS_CACHE_TTL,
});
