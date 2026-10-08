import type { HttpClient } from "@/data/protocols/http";
import { AuthorizeHttpClientDecorator } from "@/main/decorators";
import { makeLocalStorageAdapter } from "@/main/factories/cache";
import { makeAxiosHttpClient } from "@/main/factories/http";

export const makeAuthorizeHttpClientDecorator = <Request = unknown, Response = unknown>(): HttpClient<Request, Response> => {
  return new AuthorizeHttpClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient());
};