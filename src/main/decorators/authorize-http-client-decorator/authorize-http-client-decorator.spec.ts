import { httpMethods, type HttpRequest } from "@/data/protocols/http";
import { GetStorageSpy, HttpClientSpy, mockHttpRequest } from "@/data/test";
import { mockAccountModel } from "@/domain/test";
import { AuthorizeHttpClientDecorator } from "@/main/decorators";
import { faker } from "@faker-js/faker";

type SutTypes = {
  sut: AuthorizeHttpClientDecorator<unknown, unknown>;
  getStorageSpy: GetStorageSpy;
  httpClientSpy: HttpClientSpy<unknown, unknown>;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();

  const httpClientSpy = new HttpClientSpy();

  const sut = new AuthorizeHttpClientDecorator(getStorageSpy, httpClientSpy);

  return {
    getStorageSpy,
    httpClientSpy,
    sut
  };
};

describe('AuthorizeHttpClientDecorator', () => {
  test('Should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();

    await sut.request(mockHttpRequest());

    expect(getStorageSpy.key).toBe("account");
  });

  test('Should not add headers if getStorage is invalid', async () => {
    const { sut, httpClientSpy } = makeSut();

    const httpRequest: HttpRequest<unknown> = {
      url: faker.internet.url(),
      headers: {
        field: faker.word.words()
      },
      method: faker.helpers.arrayElement(httpMethods),
    };

    await sut.request(httpRequest);

    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual(httpRequest.headers);
  });

  test('Should add access token to headers if GetStorage is valid (original headers  empty)', async () => {
    const { sut, httpClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();

    const httpRequest: HttpRequest<unknown> = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(httpMethods),
    };

    await sut.request(httpRequest);

    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      "x-access-token": getStorageSpy.value.accessToken
    });
  });

  test('Should merge access token to headers when GetStorage is valid (original headers not empty)', async () => {
    const { sut, httpClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();

    const httpRequest: HttpRequest<unknown> = {
      url: faker.internet.url(),
      headers: {
        field: faker.word.words()
      },
      method: faker.helpers.arrayElement(httpMethods),
    };

    await sut.request(httpRequest);

    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      ...httpRequest.headers,
      "x-access-token": getStorageSpy.value.accessToken,
    });
  });

  test('Should return the same result as HttpClient', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResponse = await sut.request(mockHttpRequest());
    expect(httpResponse).toEqual(httpClientSpy.response);
  });
});