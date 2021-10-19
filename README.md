# Chicago E-Skate Services

## Huge thank you to our sponsors!
- jgiard6 - Joe Giardina
- dpromano76 - Donal (Lord) Romano
- Rick Rivera
- Stewart Ciesla
- Jared Auker

## This is a Mono-Repo for the

- Chicago E-Skate Website
- Chicago E-Skate Bot
- The APIs which act as the backend for both of those services

## Contributing

In order to properly contribute, you should submit a PR to the branch `feature/devel`. If contributing, you might want to send @jacob_waller a message on Telegram & he can give you instructions on testing your changes.

## Architecture

The Mono-Repo is divided into 3 main directories, `bot`,`client`, and `api`. The names of each are self explanatory.

### Bot

Main Dependencies

- Telegraf - The Telegram Bot API Wrapper. [More Info Here](https://telegraf.js.org)
- Google Cloud Functions

The structure of the bot is that most of the simple implementation is done in the `index.ts` file. While most of the more complex logic (calling APIs, anything that isn't Telegraf specific) is broken out into individual files in `bot/utils/`.

### API

The APIs are designed to be fairly minimal. As of right now, the APIs only offer the ability to see when the next group rides are.

### Client

The client is currently not deployed anymore. But the most recent update to it can be seen at chicagoeskate.com
