import { faker } from '@faker-js/faker';
import {
  type HttpClient,
  httpMethods,
  type HttpRequest,
  type HttpResponse,
  HttpStatusCode,
} from '@/data/protocols/http';

export const mockHttpRequest = (): HttpRequest<unknown> => ({
  url: faker.internet.url(),
  body: {
    email: faker.internet.exampleEmail(),
    password: faker.internet.password(),
  },
  headers: { data: faker.string.alphanumeric() },
  method: faker.helpers.arrayElement(httpMethods)
});

export class HttpClientSpy<RequestBody, ResponseBody>
  implements HttpClient<RequestBody, ResponseBody> {
  url?: string;
  method?: string;
  body?: RequestBody;
  headers?: any;
  response: HttpResponse<ResponseBody> = {
    statusCode: HttpStatusCode.ok
  };

  async request(data: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>> {
    this.url = data.url;
    this.method = data.method;
    this.headers = data.headers;
    this.body = data.body;

    return Promise.resolve(this.response);
  }
}