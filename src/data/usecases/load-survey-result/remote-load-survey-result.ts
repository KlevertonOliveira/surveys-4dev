import { HttpStatusCode, type HttpClient } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";
import type { SurveyResultModel } from "@/domain/models/survey-result-model";
import type { LoadSurveyResult } from "@/domain/usecases";

export class RemoteLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<unknown, SurveyResultModel>
  ) { }

  async load(): Promise<SurveyResultModel> {
    const httpResponse = await this.httpClient.request({ url: this.url, method: "GET" });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return {
        ...httpResponse.body!,
        date: new Date(httpResponse.body!.date)
      };
      case HttpStatusCode.forbidden: throw new AccessDeniedError();
      default: throw new UnexpectedError();
    }
  }
}