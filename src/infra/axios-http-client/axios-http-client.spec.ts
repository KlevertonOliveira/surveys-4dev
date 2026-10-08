import { describe, test, expect, vi, type MockedFunction } from 'vitest';
import type { AxiosStatic } from 'axios';

import { AxiosHttpClient } from './axios-http-client';
import { mockAxios, mockHttpResponse } from '@/infra/test';
import { mockHttpRequest } from '@/data/test/mock-http';

vi.mock('axios');

type SutTypes = {
  sut: AxiosHttpClient<unknown, unknown>;
  mockedAxios: MockedFunction<AxiosStatic>;
};

const makeSut = (): SutTypes => {
  return {
    sut: new AxiosHttpClient(),
    mockedAxios: mockAxios(),
  };
};

describe('AxiosHttpClient', () => {
  test('Should call axios with correct values', async () => {
    const request = mockHttpRequest();
    const { sut, mockedAxios } = makeSut();

    await sut.request(request);

    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: request.url,
      data: request.body,
      headers: request.headers,
      method: request.method
    });
  });

  test('Should return correct response on axios', async () => {
    const { sut, mockedAxios } = makeSut();

    const httpResponse = await sut.request(mockHttpRequest());
    const mockedAxiosResponse = await mockedAxios.request.mock.results[0].value;

    expect(httpResponse).toEqual({
      statusCode: mockedAxiosResponse.status,
      body: mockedAxiosResponse.body,
    });
  });

  test("Should return correct error on axios", () => {
    const { sut, mockedAxios } = makeSut();

    mockedAxios.request.mockRejectedValueOnce({
      response: mockHttpResponse()
    });

    const promise = sut.request(mockHttpRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });
});