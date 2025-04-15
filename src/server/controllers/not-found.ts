import type { Handler } from "../../core/server";

export const notFound: Handler = _ => async (__, res) => {
  res.status(404);
  res.send({ message: "Not Found" });
};
