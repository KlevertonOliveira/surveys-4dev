import { HttpStatusCode } from "@/data/protocols/http";
import { HttpClientSpy } from "@/data/test";
import { RemoteLoadSurveyList } from "./remote-load-survey-list";
import { AccessDeniedError, UnexpectedError } from "@/domain/errors";
import type { SurveyModel } from "@/domain/models";
import { mockSurveyList } from "@/domain/test";
import { faker } from "@faker-js/faker";

type SutTypes = {
  httpClientSpy: HttpClientSpy<unknown, SurveyModel[]>;
  sut: RemoteLoadSurveyList;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<unknown, SurveyModel[]>();
  const sut = new RemoteLoadSurveyList(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe("RemoteLoadSurveyList", () => {
  test("Should call HttpClient with correct URL and method", async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    await sut.loadAll();
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("GET");
  });

  test("Should throw AccessDeniedError if HttpClient returns 403", async () => {
    const { sut, httpClientSpy } = makeSut();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };

    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test("Should throw UnexpectedError if HttpClient returns 404", async () => {
    const { sut, httpClientSpy } = makeSut();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };

    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw UnexpectedError if HttpClient returns 500", async () => {
    const { sut, httpClientSpy } = makeSut();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };

    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should return a list of SurveyModels if HttpClient returns 200", async () => {
    const { sut, httpClientSpy } = makeSut();

    const httpResult = mockSurveyList();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const surveyList = await sut.loadAll();

    expect(surveyList).toEqual(httpResult);
  });

  test("Should return an empty list of SurveyModels if HttpClient returns 204", async () => {
    const { sut, httpClientSpy } = makeSut();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
    };

    const surveyList = await sut.loadAll();

    expect(surveyList).toEqual([]);
  });
});