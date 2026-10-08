import { type HttpClient, HttpStatusCode } from '@/data/protocols/http';
import type { Authentication, AuthenticationParams } from '@/domain/usecases';
import type { AccountModel } from '@/domain/models';
import { UnexpectedError, InvalidCredentialsError } from '@/domain/errors';

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<AuthenticationParams, AccountModel>
  ) { }

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      body: params,
      method: "POST",
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body!;
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError();
      default: throw new UnexpectedError();
    }
  }
}