import type { HttpClient } from "@/data/protocols/http";
import type { SaveSurveyResultParams } from "@/domain/usecases";

export class RemoteSaveSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<unknown, unknown>,
  ) { }

  async save(params: SaveSurveyResultParams): Promise<void> {
    await this.httpClient.request({
      url: this.url,
      method: "PUT",
      body: params
    });
  };
}