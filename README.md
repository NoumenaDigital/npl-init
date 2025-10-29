# npl-init

Starter project intended to be a quick start for writing NPL and deploying it in an engine in DEV_MODE.

An easy getting-started can be found on
the [Developing on your own machine](https://documentation.noumenadigital.com/tracks/developing-NPL-local/) track.

## Usage

Using the NPL CLI, the project can be run validated for compilation errors with

```shell
npl check
```

and for test errors with

```shell
npl test
```

Before running the api, the OpenAPI specification can be generated with

```shell
npl openapi
```

Using docker and the NPL CLI, the project can be run locally:

```shell
docker compose up -d --wait
npl deploy --clear
```

Fetch a token from the embedded OIDC server with

```shell
export ACCESS_TOKEN=$(curl -s -X POST http://localhost:11000/token -d "grant_type=password" -d "username=alice" -d "password=password123" | jq -r .access_token)
```

and interact with the engine to create a hello world protocol:

```shell
curl -X POST -H 'accept: application/json' -H "Authorization: Bearer $ACCESS_TOKEN" -d '{ "@parties": {}}' http://localhost:12000/npl/demo/HelloWorld/
```

Say hello (replace the instance ID with the one you got from the previous command):

```shell
curl -X POST -H 'accept: application/json' -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:12000/npl/demo/HelloWorld/{instanceId}/sayHello
```

and examine the resulting state of the protocol instance:

```shell
curl -X GET -H 'accept: application/json' -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:12000/npl/demo/HelloWorld/
```

## Support

For any question, reach out to us on the [NOUMENA Community](https://community.noumenadigital.com/).

What interaction will you be modelling next?
