import { HttpStatusCode, type HttpGetClient } from "@/data/protocols/http";
import { AccessDeniedError } from "@/domain/errors";

export class RemoteLoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<unknown>
  ) { }

  async load(): Promise<void> {
    const httpResponse = await this.httpGetClient.get({ url: this.url });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.forbidden: throw new AccessDeniedError();
      default: break;
    }
  }
}