import { Request, Response } from "express";
import fs from "fs";
import { Client } from "ssh2";

const authController = {
  login: async (req: Request, res: Response) => {
    const { username, password, key, passphrase, port } = req.body;

    await new Promise((resolve, reject) => {
      const conn = new Client();

      conn
        .on("ready", () => {
          console.log("SSH Client :: ready");
          resolve(conn); // Resolve with the connected client
        })
        .on("error", (err) => {
          reject(err); // Reject if there's an error
        })
        .connect({
          host: "your-ssh-server.com",
          port: 22,
          username: "your-username",
          privateKey: fs.readFileSync("/path/to/your-key.pem"),
          passphrase: "your-passphrase",
        });
    });

    res.status(200).json({ asd: "Hola" });
  },
};

export default authController;
