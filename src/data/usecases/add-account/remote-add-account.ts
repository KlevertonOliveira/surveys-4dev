import { HttpStatusCode, type HttpClient } from '@/data/protocols/http';
import type { AddAccount, AddAccountParams } from '@/domain/usecases';
import type { AccountModel } from '@/domain/models';
import { EmailInUseError, UnexpectedError } from "@/domain/errors";

export class RemoteAddAccount implements AddAccount {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<AddAccountParams, AccountModel>
  ) { }

  async add(params: AddAccountParams): Promise<AccountModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      body: params,
      method: "POST",
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body!;
      case HttpStatusCode.forbidden: throw new EmailInUseError();
      default: throw new UnexpectedError();
    }
  }
}