import { HttpClientSpy } from "@/data/test";
import { faker } from "@faker-js/faker";
import { RemoteSaveSurveyResult } from "./remote-save-survey-result";
import { mockSaveSurveyResultParams, mockSurveyResult } from "@/domain/test";
import { HttpStatusCode } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";
import type { SaveSurveyResultParams } from "@/domain/usecases";
import type { SurveyResultModel } from "@/domain/models";

type SutTypes = {
  sut: RemoteSaveSurveyResult;
  httpClientSpy: HttpClientSpy<SaveSurveyResultParams, SurveyResultModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SaveSurveyResultParams, SurveyResultModel>();
  const sut = new RemoteSaveSurveyResult(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe("RemoteSaveSurveyResult", () => {
  test("Should call HttpClient with correct values", async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockSurveyResult(),
    };

    const params = mockSaveSurveyResultParams();

    await sut.save(params);

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("PUT");
    expect(httpClientSpy.body).toEqual(params);
  });

  test("Should throw AccessDeniedError if HttpClient returns 403", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };

    const httpResponsePromise = sut.save(mockSaveSurveyResultParams());
    await expect(httpResponsePromise).rejects.toThrow(new AccessDeniedError());
  });

  test("Should throw UnexpectedError if HttpClient returns 404", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };

    const httpResponsePromise = sut.save(mockSaveSurveyResultParams());
    await expect(httpResponsePromise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw UnexpectedError if HttpClient returns 500", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };

    const httpResponsePromise = sut.save(mockSaveSurveyResultParams());
    await expect(httpResponsePromise).rejects.toThrow(new UnexpectedError());
  });

  test("Should return a SurveyResult if HttpClient returns 200", async () => {
    const { sut, httpClientSpy } = makeSut();

    const surveyResult = mockSurveyResult();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: surveyResult,
    };

    const httpResponseBody = await sut.save(mockSaveSurveyResultParams());
    expect(httpResponseBody).toEqual({
      ...surveyResult,
      date: new Date(surveyResult.date)
    });
  });
});