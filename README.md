# gmail-extension-server

Gmail Chrome Extension Backend

## Set up Configuration

Copy and fill out the env file

```sh
cp .env.example .env
```

```txt
# Server PORT
PORT=

# DB Configuration
DB_HOST= // if you are using docker, please set as 'db'
DB_USER=
DB_PASS=
DB_NAME=
```

## Running Server

### With Docker

#### 1. Build docker image

```sh
docker-compose up --build
```

#### 2. Running server with detach mode

```sh
docker-compose up -d
```

### Without Docker

#### 1. Install npm packages

```sh
yarn install or npm install
```

#### 2. Running with development mode

```sh
yarn dev or npm run dev
```

#### 3. Running with production mode

```sh
yarn build or npm run build
yarn start or npm start
```

## Swagger API Docs

<http://localhost:${PORT}/docs>

## Notes

- Tsoa doesn't like `Omit<>`. Use `Pick<>` instead, even if more verbose
