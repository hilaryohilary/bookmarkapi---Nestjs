import { Injectable } from "@nestjs/common";
@Injectable({})
export class AuthService {
  signin() {
    return {
      msg: "i have signed in now",
    };
  }

  signup() {
    return {
      msg: "i have signed up now",
    };
  }
}
