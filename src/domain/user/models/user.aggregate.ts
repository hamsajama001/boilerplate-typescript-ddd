import { User } from "./user";

export class UserAggregate {
  private _user: User;

  constructor(user: User) {
    this._user = user;
  }

  // Business logic methods can be added here

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }
}
