# not-pass

This is a simple project that demonstrates how to log in with just the user's email and no password.
The authorization is done by sending an e-mail to the user with an authorization link.
Once followed, the session is automatically authorized.

Think about it as an 1.5FA system! Better than SFA but not fully 2FA.

## Login flow

- The client sends an email address to the server.
- The server sends an authorization email with a unique token linked to that email address.
- Once the server confirms the email was sent, the client opens a [Socket.IO](https://socket.io) connection to be notified when the login is authorized.
- The user follows the authorization link in the email.
- The server validates the token, the email address and sends the authorization message back.
- The client receives the authorization and proceeds.

### Benefits

Some benefits of this approach are:

- Easier to use: no passwords to manage or remember!
- Better user experience than traditional "create user/pass, verify email and login" flows.
- Instant user onboarding: user creation and login are a single verified step.
- Easier to implement: no passwords will be leaked/compromised ever.

## Run it locally

The simplest way to run the example is to use Docker.

First create an `api/.env` file with the following variables:

- API_URL=http://localhost
- EMAIL_USER="your Gmail email"
- EMAIL_PASS="your Gmail password"
- SESSION_SECRET="secret to sign cookies"
- WEB_URL=http://localhost:3000

Then create a `web/.env` file containing:

- REACT_APP_API_URL=http://localhost:3001

Finally, in the root folder tell Docker to start the API and website:

```console
$ docker-compose up
```

The website will be available at http://localhost:3000.

### Note

In order to send emails using Gmail, it is required to enable the "less secure apps" setting in your Google account:

https://myaccount.google.com/lesssecureapps

## Demo deployment

There is a running demo at https://not-pass-web.now.sh deployed using [Zeit Now](https://zeit.co/).

To deploy your own, install `now` and login.

```console
$ npm i -g now
$ now login
```

Then configure the required [Now Secrets](https://zeit.co/docs/v2/serverless-functions/env-and-secrets):

```console
$ now secret add not-pass-email-user <your Gmail email>
$ now secret add not-pass-email-pass <your Gmail password>
$ now secret add not-pass-session-secret <secret to sign cookies>
```

With the secrets set, deploy the API server:

```console
$ cd api
$ now
```

The last step is to set an alias so that deployment URL matches the one set in the `API_URL` environment variable set in `api/now.json` and `REACT_APP_API_URL` in `web/now.json`:

```console
$ now alias set <the API deployment url> <the URL set in API_URL>
```

Then is the turn to deploy the web:

```console
$ cd ../web
$ now
```

As with the API server, an alias has to be set for the website so it matches `WEB_URL` in `api/now.json`:

```console
$ now alias set <the website deployment url> <the URL set in WEB_URL>
```
