import { createApi } from "unsplash-js";
import nodeFetch from "node-fetch";

const unsplash = createApi({
  accessKey: "ueDFSSoOm5uf5CsnMye6Vszg-0xNZjBjsfN_34Pt14I",
  fetch: nodeFetch,
});
