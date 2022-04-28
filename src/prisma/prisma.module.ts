import { Global, Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: "postgresql://postgres:123@localhost:5434/nest?schema=public",
        },
      },
    });
  }
}
