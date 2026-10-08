export const httpMethods = ["POST", "GET", "PUT", "DELETE"] as const;

export type HttpMethod = typeof httpMethods[number];

export type HttpRequest<RequestBody> = {
  url: string;
  method: HttpMethod;
  headers?: any;
  body?: RequestBody;
};

export interface HttpClient<RequestBody, ResponseBody> {
  request(data: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>>;
}

export enum HttpStatusCode {
  ok = 200,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500,
}

export type HttpResponse<ResponseBody> = {
  statusCode: number;
  body?: ResponseBody;
};