import { HttpGetClientSpy } from "@/data/test";
import { RemoteLoadSurveyResult } from "./remote-load-survey-result";
import { HttpStatusCode } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";
import { mockSurveyResult } from "@/domain/test";
import type { SurveyResultModel } from "@/domain/models";
import { faker } from "@faker-js/faker";

type SutTypes = {
  sut: RemoteLoadSurveyResult;
  httpGetClientSpy: HttpGetClientSpy<SurveyResultModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyResultModel>();
  const sut = new RemoteLoadSurveyResult(url, httpGetClientSpy);

  return {
    sut,
    httpGetClientSpy
  };
};

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url();
    const { sut, httpGetClientSpy } = makeSut(url);
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockSurveyResult()
    };

    await sut.load();
    expect(httpGetClientSpy.url).toBe(url);
  });

  test("Should throw AccessDeniedError if HttpGetClient returns 403", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };

    const promise = sut.load();
    expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test("Should throw UnexpectedError if HttpGetClient returns 404", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };

    const promise = sut.load();
    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should return a SurveyResultModel if HttpGetClient returns 200", async () => {
    const surveyResult = mockSurveyResult();

    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: surveyResult
    };

    const httpResponse = await sut.load();
    expect(httpResponse).toEqual(surveyResult);
  });
});