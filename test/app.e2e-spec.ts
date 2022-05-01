import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl("http://localhost:3333");
  });

  afterAll(() => {
    app.close();
  });
  describe("Auth", () => {
    const dto: AuthDto = {
      email: "hillary@gmail.com",
      password: "125",
    };
    describe("Signup", () => {
      it("should throw if email is empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it("should throw if password is empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            password: dto.email,
          })
          .expectStatus(400);
      });

      it("should throw if body is empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({})
          .expectStatus(400);
      });

      it("should sign up", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe("Signin", () => {
      it("should throw if email is empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it("should throw if password is empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({
            password: dto.email,
          })
          .expectStatus(400);
      });

      it("should throw if body is empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({})
          .expectStatus(400);
      });
      it("should sign in", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(dto)
          .expectStatus(200)
          .stores("userAt", "access_token");
      });
    });
  });
  describe("User", () => {
    describe("Getme", () => {
      it("should get current user", () => {
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .inspect();
      });
    });

    describe("Edit user", () => {
      const dto: EditUserDto = {
        firstName: "ogochukwu",
        lastName: "Hilary",
        email: "hilarynew@gmail.com",
      };
      it("should edit user", () => {
        return pactum
          .spec()
          .patch("/users")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName);
      });
    });
  });
  describe("Bookmarks", () => {
    describe("Create bookmark", () => {});

    describe("Get bookmarks", () => {});

    describe("Get bookmark by id", () => {});

    describe("Edit bookmark by id", () => {});

    describe("Delete bookmark by id", () => {});
  });
});
