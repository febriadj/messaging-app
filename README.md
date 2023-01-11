# LeChat

LeChat is a web-based instant messaging app that allows you to quickly send and receive text messages, emojis, photos, or files with other LeChat users. LeChat uses its own socket server and works independently, professionally built using **MongoDB, Express, React, Node, and Socket IO**. Suitable for those of you who are interested in learning the workflow of messaging apps.

## Table of Contents

- [Getting Started](#getting-started)
- [Preview](#preview)
- [Requirements](#requirements)
- [Features](#features)
- [Environment Variables](#environment-variables)
  - [Connect to MongoDB](#connect-to-mongodb)
  - [Cloudinary](#cloudinary)
  - [Nodemailer](#nodemailer)
  - [Fake SMTP Server](#fake-smtp-server)
- [License](#license)

## Getting Started

**Step 1:** Fork and clone this repository.

```bash
git clone https://github.com/{username}/lechat.git
```

**Step 2:** Rename `.env.example` file to `.env` and complete the required [environment variables](#environment-variables).

**Step 3:** Install dependencies.

```bash
npm install
```

**Step 4:** Run the app in development mode.

```bash
npm run dev
```

## Preview

![cover](/docs/img/light-desktop.png)
![cover](/docs/img/dark-desktop.png)

## Requirements

- **Node.js:** _latest_
- **NPM**: _latest_
- **MongoDB**: _^6.0.4_
- [Cloudinary account](https://cloudinary.com): _third-party for media cloud_

## Features

- User authentication
- Sharing text messages, emojis, photos, or files
- Online/offline, last seen time, blue tick, and typing indicators
- Photo capture
- Browser notification
- Peer-to-peer and group chat
- User profile
- Contact
- Account settings
- Dark mode
- Change account password
- Delete account
- ...

## Environment Variables

Environment variables provide information about the environment in which the process is running. We use Node environment variables to handle sensitive data like API keys, or configuration details that might change between runs.

```
NODE_ENV = development
```

### Connect to MongoDB

By default, LeChat will use your local MongoDB server and the `lechat` database will be created automatically when the app is run in development mode. In production mode, you should use a cloud database like [MongoDB Atlas](https://www.mongodb.com/atlas/database).

```
MONGO_URI = mongodb+srv://{username}:{password}@node.deu00vc.mongodb.net/{dbname}?retryWrites=true&w=majority
```

### Cloudinary

We rely on Cloudinary service to store all media uploaded by users, follow the instructions below to getting started with Cloudinary:

- Create [Cloudinary Account](https://cloudinary.com/) for free and you will get **Product Environment Credentials** like Cloud Name, API Key, and API Secret.
- Open the **Media Library** then create `avatars` and `chat` folders.

```
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
CLOUDINARY_CLOUD_NAME =
```

### Nodemailer

We use [Nodemailer](https://nodemailer.com/about/) to send OTP code via email, use your email address and App Password to run Nodemailer, follow the instructions below to generate your App Password:

- Go to your [Google Account](https://myaccount.google.com/) > **Security** > **2-Step Verification**
- At the bottom, choose **Select app** and choose Other (custom name) > give this App Password a name, e.g. "Nodemailer" > **Generate**
- Follow the instructions to enter the App Password. The App Password is the 16-character code in the yellow bar on your device
- **Done**

```
EMAIL_USER = your@gmail.com
EMAIL_PASS =
```

### Fake SMTP Server

There are many fake SMTP server services to test your email but I recommend using [Mailtrap](https://mailtrap.io), this variable will only be executed in development mode.

```
TEST_EMAIL_USER =
TEST_EMAIL_PASS =
TEST_EMAIL_HOST = smtp.mailtrap.io
TEST_EMAIL_PORT = 2525
```

## License

Distributed under the [GPL-3.0 License](/LICENSE).
