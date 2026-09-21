import { HttpStatusCode, type HttpGetClient } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";
import type { SurveyResultModel } from "@/domain/models/survey-result-model";
import type { LoadSurveyResult } from "@/domain/usecases";

export class RemoteLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<SurveyResultModel>
  ) { }

  async load(): Promise<SurveyResultModel> {
    const httpResponse = await this.httpGetClient.get({ url: this.url });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();

      case HttpStatusCode.notFound:
      case HttpStatusCode.serverError:
        throw new UnexpectedError();

      default: return {
        ...httpResponse.body!,
        date: new Date(httpResponse.body!.date)
      };
    }
  }
}