import { HttpStatusCode, type HttpClient } from "@/data/protocols/http";
import { AccessDeniedError } from "@/domain/errors";
import type { SaveSurveyResultParams } from "@/domain/usecases";

export class RemoteSaveSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<unknown, unknown>,
  ) { }

  async save(params: SaveSurveyResultParams): Promise<void> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "PUT",
      body: params
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.forbidden: throw new AccessDeniedError();
      default: break;
    }
  };
}