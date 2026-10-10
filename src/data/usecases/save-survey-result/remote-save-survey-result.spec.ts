import { HttpClientSpy } from "@/data/test";
import { faker } from "@faker-js/faker";
import { RemoteSaveSurveyResult } from "./remote-save-survey-result";
import { mockSaveSurveyResultParams } from "@/domain/test";

describe('RemoteSaveSurveyResult', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const params = mockSaveSurveyResultParams();

    const httpClientSpy = new HttpClientSpy();
    const sut = new RemoteSaveSurveyResult(url, httpClientSpy);

    await sut.save(params);

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("PUT");
    expect(httpClientSpy.body).toEqual(params);
  });
});