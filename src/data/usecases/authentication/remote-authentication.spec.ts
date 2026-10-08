import { describe, expect, test } from 'vitest';

import { HttpStatusCode } from '@/data/protocols/http';
import { HttpClientSpy } from '@/data/test';
import { mockAccountModel, mockAuthentication } from '@/domain/test';
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import type { AccountModel } from '@/domain/models';
import type { AuthenticationParams } from '@/domain/usecases';
import { RemoteAuthentication } from './remote-authentication';

import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: RemoteAuthentication;
  httpClientSpy: HttpClientSpy<AuthenticationParams, AccountModel>;
};

// sut -> System Under Test
const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<AuthenticationParams, AccountModel>();

  const sut = new RemoteAuthentication(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL and method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    await sut.auth(mockAuthentication());

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("POST");
  });

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpClientSpy } = makeSut();

    const authenticationParams = mockAuthentication();
    await sut.auth(authenticationParams);

    expect(httpClientSpy.body).toEqual(authenticationParams);
  });

  test('Should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    };

    const promise = sut.auth(mockAuthentication());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw InvalidCredentialsError if HttpPostClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };

    const promise = sut.auth(mockAuthentication());

    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });


  test('Should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };

    const promise = sut.auth(mockAuthentication());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };

    const promise = sut.auth(mockAuthentication());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should return an account model if HttpPostClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();

    const httpResult = mockAccountModel();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    };

    const account = await sut.auth(mockAuthentication());

    expect(account).toEqual(httpResult);
  });
});