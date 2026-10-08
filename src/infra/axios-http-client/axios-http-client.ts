import type { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http';
import axios, { AxiosError, type AxiosResponse } from 'axios';

export class AxiosHttpClient<RequestBody, ResponseBody> implements HttpClient<RequestBody, ResponseBody> {

  async request(data: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>> {
    let axiosResponse: AxiosResponse;

    try {
      axiosResponse = await axios.request({
        url: data.url,
        data: data.body,
        headers: data.headers,
        method: data.method
      }) as AxiosResponse;
    }
    catch (error) {
      axiosResponse = (error as AxiosError).response as AxiosResponse;
    }

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    };
  }
}