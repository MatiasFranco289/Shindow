import { ApiResponse } from "../src/interfaces";
import app from "../src/index";
import fs from "fs";
import path from "path";

import {
  ERROR_TYPE_AUTH,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_OK,
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "../src/constants";
import request from "supertest";
import { SUCCESSFUL_LOGIN_MESSAGE } from "../src/controllers/authController";
import { body, ValidationError } from "express-validator";
import { fstat } from "fs";
import { INCORRECT_CREDENTIALS_MESSAGE } from "../src/errorHandlers/authErrorHandler";
import {
  PASSPHRASE_IS_STRING_VALIDATION_MSG,
  PASSWORD_IS_STRING_VALIDATION_MSG,
  PASSWORD_LENGHT_VALIDATION_MSG,
  PRIVATE_KEY_IS_STRING_VALIDATION_MSG,
  USERNAME_EXISTS_VALIDATION_MSG,
  USERNAME_IS_STRING_VALIDATION_MSG,
  USERNAME_LENGHT_VALIDATION_MSG,
} from "../src/validations/login";

const PRIVATE_KEY_WITHOUT_PASSPHRASE_PATH = "./keys/no-passphrase.key";
const PRIVATE_KEY_WITH_PASSPHRASE_PATH = "./keys/with-passphrase.key";
const PRIVATE_KEY_PASSPHRASE = "testing software is not easy";

function getKey(keyPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, keyPath), "utf-8");
}

/**
 * TODO
 * -Add documentation on README.md to run tests
 */

describe("POST /api/auth/login", () => {
  it("Should login with password successfully", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      password: "test",
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_OK);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_OK);
    expect(body.message).toBe(SUCCESSFUL_LOGIN_MESSAGE);

    expect(body.data).toEqual([]);
  });

  it("Should login with key successfully", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "test",
        privateKey: getKey(PRIVATE_KEY_WITHOUT_PASSPHRASE_PATH),
      });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_OK);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_OK);
  });

  it("Should login with key and passphrase successfully", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "test",
        privateKey: getKey(PRIVATE_KEY_WITH_PASSPHRASE_PATH),
        passphrase: PRIVATE_KEY_PASSPHRASE,
      });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_OK);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_OK);
  });

  it("Should return 401 error if only username is given", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_UNAUTHORIZED);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_UNAUTHORIZED);

    expect(body.data).toEqual([]);
  });

  it("Should return 401 error if username is not valid", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "wronguser",
      password: "test",
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_UNAUTHORIZED);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_UNAUTHORIZED);
    expect(body.message).toBe(INCORRECT_CREDENTIALS_MESSAGE);

    expect(body.data).toEqual([]);
  });

  it("Should return 401 error if password is not valid", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      password: "wrongpassword",
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_UNAUTHORIZED);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_UNAUTHORIZED);
    expect(body.message).toBe(INCORRECT_CREDENTIALS_MESSAGE);

    expect(body.data).toEqual([]);
  });

  it("Should return 401 error if passphrase is not valid", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "test",
        privateKey: getKey(PRIVATE_KEY_WITH_PASSPHRASE_PATH),
        passphrase: "wrong passphrase",
      });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_UNAUTHORIZED);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_UNAUTHORIZED);
    expect(body.message).toBe(INCORRECT_CREDENTIALS_MESSAGE);

    expect(body.data).toEqual([]);
  });

  it("Should return 400 error if request is empty", async () => {
    const response = await request(app).post("/api/auth/login").send({});

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: USERNAME_EXISTS_VALIDATION_MSG,
        path: "username",
        type: "field",
      },
      {
        location: "body",
        msg: USERNAME_IS_STRING_VALIDATION_MSG,
        path: "username",
        type: "field",
      },
      {
        location: "body",
        msg: USERNAME_LENGHT_VALIDATION_MSG,
        path: "username",
        type: "field",
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if username isn't a string", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: 123,
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: USERNAME_IS_STRING_VALIDATION_MSG,
        path: "username",
        type: "field",
        value: 123,
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if password isn't a string", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      password: 123,
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: PASSWORD_IS_STRING_VALIDATION_MSG,
        path: "password",
        type: "field",
        value: 123,
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if key isn't a string", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      privateKey: 123,
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: PRIVATE_KEY_IS_STRING_VALIDATION_MSG,
        path: "privateKey",
        type: "field",
        value: 123,
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if passphrase isn't a string", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      passphrase: 123,
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: PASSPHRASE_IS_STRING_VALIDATION_MSG,
        path: "passphrase",
        type: "field",
        value: 123,
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if username is empty, but password isn't", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "",
      password: "test",
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: USERNAME_LENGHT_VALIDATION_MSG,
        path: "username",
        type: "field",
        value: "",
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if password is empty, but username isn't", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      password: "",
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: PASSWORD_LENGHT_VALIDATION_MSG,
        path: "password",
        type: "field",
        value: "",
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if username and password are empty", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "",
      password: "",
    });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: USERNAME_LENGHT_VALIDATION_MSG,
        path: "username",
        type: "field",
        value: "",
      },
      {
        location: "body",
        msg: PASSWORD_LENGHT_VALIDATION_MSG,
        path: "password",
        type: "field",
        value: "",
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if username is empty, but key isn't", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "",
        privateKey: getKey(PRIVATE_KEY_WITHOUT_PASSPHRASE_PATH),
      });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: USERNAME_LENGHT_VALIDATION_MSG,
        path: "username",
        type: "field",
        value: "",
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if username is empty, but key and passphrase aren't", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "",
        privateKey: getKey(PRIVATE_KEY_WITH_PASSPHRASE_PATH),
        passphrase: PRIVATE_KEY_PASSPHRASE,
      });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    const expectedData: Array<ValidationError> = [
      {
        location: "body",
        msg: USERNAME_LENGHT_VALIDATION_MSG,
        path: "username",
        type: "field",
        value: "",
      },
    ];

    expect(body.data).toEqual(expectedData);
  });

  it("Should return 400 error if passphrase is empty, but key and username aren't", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "test",
        privateKey: getKey(PRIVATE_KEY_WITH_PASSPHRASE_PATH),
        passphrase: "",
      });

    const body: ApiResponse<any> = response.body;

    expect(response.status).toBe(HTTP_STATUS_CODE_BAD_REQUEST);
    expect(body.status_code).toBe(HTTP_STATUS_CODE_BAD_REQUEST);

    expect(body.data).toEqual([]);
  });
});
