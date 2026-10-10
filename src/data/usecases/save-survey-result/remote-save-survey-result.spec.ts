import { HttpClientSpy } from "@/data/test";
import { faker } from "@faker-js/faker";
import { RemoteSaveSurveyResult } from "./remote-save-survey-result";
import { mockSaveSurveyResultParams } from "@/domain/test";
import { HttpStatusCode } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";

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

describe("RemoteSaveSurveyResult", () => {
  test("Should call HttpClient with correct values", async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

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
});