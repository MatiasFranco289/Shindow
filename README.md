# Shindow

## Running the Back-End tests

To run the back-end tests it is necessary to create two pairs of keys, one without passphrase, and another with the passphrase in `PRIVATE_KEY_PASSPHRASE` in `login.test.ts`, which right now is `testing software is not easy`.

The public keys must be stored inside the directory `tests/keys/pub`.

The name and path of the private keys must be the same as the values of `PRIVATE_KEY_WITHOUT_PASSPHRASE_PATH` and `PRIVATE_KEY_WITH_PASSPHRASE_PATH` in `login.test.ts`

Once all that's done, go to the backend directory and run the following command

```bash
npm run test
```
