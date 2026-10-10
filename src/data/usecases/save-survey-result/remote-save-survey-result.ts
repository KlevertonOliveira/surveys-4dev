import { HttpStatusCode, type HttpClient } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";
import type { SurveyResultModel } from "@/domain/models";
import type { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/usecases";

export class RemoteSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<SaveSurveyResultParams, SurveyResultModel>,
  ) { }

  async save(params: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "PUT",
      body: params
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return {
        ...httpResponse.body!,
        date: new Date(httpResponse.body!.date)
      };
      case HttpStatusCode.forbidden: throw new AccessDeniedError();
      default: throw new UnexpectedError();
    }
  };
}