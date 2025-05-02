# npl-init

Starter project intended to be a quick start for writing NPL and deploying it in an engine in DEV_MODE.

An easy getting-started can be found on
the [Developing on your own machine](https://dev-docs.noumenadigital.com/tracks/developing-NPL-local/) track.

## Usage

Using docker and the NPL CLI, the project can be run locally.

```shell
docker compose up -d --wait
npl deploy local src/main
```

fetch a token from the embedded OIDC server

```shell
export ACCESS_TOKEN=$(curl -s -X POST http://localhost:11000/token -d "grant_type=password" -d "username=alice" -d "password=password123" | jq -r .access_token)
```

and interact with the engine to create a counter

```shell
curl -X POST -H 'accept: application/json' -H "Authorization: Bearer $ACCESS_TOKEN" -d '{ "target": 5, "@parties": { "user": { "entity": { "preferred_username": [ "alice" ] }, "access": {} }}}' http://localhost:12000/npl/counter/Counter/
```

increment the counter (replace the instance ID with the one you got from the previous command)

```shell
curl -X POST -H 'accept: application/json' -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:12000/npl/counter/Counter/{instanceId}/increment
```

and get the result

```shell
curl -X GET -H 'accept: application/json' -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:12000/npl/counter/Counter/
```

## Support

For any question, reach out to us on the [NOUMENA Community](https://community.noumenadigital.com/).

What interaction will you be modelling next?
