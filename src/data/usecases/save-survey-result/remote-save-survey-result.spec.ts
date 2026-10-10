import { HttpClientSpy } from "@/data/test";
import { faker } from "@faker-js/faker";
import { RemoteSaveSurveyResult } from "./remote-save-survey-result";
import { mockSaveSurveyResultParams } from "@/domain/test";

type SutTypes = {
  sut: RemoteSaveSurveyResult;
  httpClientSpy: HttpClientSpy<unknown, unknown>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteSaveSurveyResult(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteSaveSurveyResult', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    const params = mockSaveSurveyResultParams();

    await sut.save(params);

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("PUT");
    expect(httpClientSpy.body).toEqual(params);
  });
});