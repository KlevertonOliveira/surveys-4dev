import { HttpClientSpy } from "@/data/test";
import { RemoteLoadSurveyResult } from "./remote-load-survey-result";
import { HttpStatusCode } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";
import { mockSurveyResult } from "@/domain/test";
import type { SurveyResultModel } from "@/domain/models";
import { faker } from "@faker-js/faker";

type SutTypes = {
  sut: RemoteLoadSurveyResult;
  httpClientSpy: HttpClientSpy<unknown, SurveyResultModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<unknown, SurveyResultModel>();
  const sut = new RemoteLoadSurveyResult(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpClient with correct URL and method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockSurveyResult()
    };

    await sut.load();
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("GET");
  });

  test("Should throw AccessDeniedError if HttpClient returns 403", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };

    const promise = sut.load();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test("Should throw UnexpectedError if HttpClient returns 404", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };

    const promise = sut.load();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should return a SurveyResultModel if HttpClient returns 200", async () => {
    const surveyResult = mockSurveyResult();

    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: surveyResult
    };

    const httpResponse = await sut.load();
    expect(httpResponse).toEqual(surveyResult);
  });
});