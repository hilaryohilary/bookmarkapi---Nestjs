import { Controller, Get, UseGuards, Patch, Body } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetMe } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("me")
  getMe(@GetMe() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetMe("id") userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
