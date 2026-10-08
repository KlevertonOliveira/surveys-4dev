import { HttpStatusCode, type HttpClient } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";
import type { SurveyModel } from "@/domain/models";
import type { LoadSurveyList } from "@/domain/usecases";

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<unknown, SurveyModel[]>
  ) { }

  async loadAll(): Promise<SurveyModel[]> {
    const httpResponse = await this.httpClient.request({ url: this.url, method: "GET" });

    const remoteSurveys = httpResponse.body || [];

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return (
        remoteSurveys?.map(survey => ({ ...survey, date: new Date(survey.date) }))
      );
      case HttpStatusCode.noContent: return [];
      case HttpStatusCode.forbidden: throw new AccessDeniedError();
      default: throw new UnexpectedError();
    }
  }
}