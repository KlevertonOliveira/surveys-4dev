import type { GetStorage } from "@/data/protocols/cache";
import type { HttpClient, HttpResponse, HttpRequest } from "@/data/protocols/http";

export class AuthorizeHttpClientDecorator<Request, Response> implements HttpClient<Request, Response> {
  constructor(
    private readonly getStorage: GetStorage,
    private readonly httpClient: HttpClient<Request, Response>
  ) { }

  async request(data: HttpRequest<Request>): Promise<HttpResponse<Response>> {
    const account = this.getStorage.get("account");

    if (account?.accessToken) {
      data.headers = {
        ...data.headers,
        "x-access-token": account.accessToken
      };
    }

    const httpResponse = await this.httpClient.request(data);
    return httpResponse;
  }
}