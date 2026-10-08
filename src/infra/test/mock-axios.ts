import { vi, type MockedFunction } from 'vitest';
import { faker } from '@faker-js/faker';
import axios, { type AxiosStatic } from 'axios';

export const mockHttpResponse = (): unknown => ({
  data: { content: faker.string.alphanumeric() },
  status: faker.number.int()
});

export const mockAxios = (): MockedFunction<AxiosStatic> => {
  const mockedAxios = vi.mocked(axios);
  mockedAxios.request.mockClear().mockResolvedValue(mockHttpResponse);
  return mockedAxios;
};