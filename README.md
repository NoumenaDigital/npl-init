# npl-init

Starter project intended to be a quick start for writing NPL and deploying it in an engine in DEV_MODE.

An easy getting-started can be found on
the [Developing on your own machine](https://documentation.noumenadigital.com/tracks/developing-NPL-local/) track. 

Alternatively, you can open the repository in GitHub Codespaces by going to the [npl-init GitHub repository](https://github.com/NoumenaDigital/npl-init), and clicking on `Use this template`, then select `Open in a Codespace`.

If you're there already, see the [Starting in Codespaces](#running-the-npl-init-app) section to get started with running your first NPL application.

## Running the npl-init app

In the next steps, you will be able to run a 

### Running the NPL Engine

The NPL Engine is the core component that executes the NPL code and manages the protocol data.

To start the NPL Engine, run:

```shell
docker compose up --wait
```

### Deploying NPL

To deploy (or re-deploy) your NPL code to the runtime, run:

```shell
npl deploy --clear --sourceDir api/src/main
```

The `--clear` flag makes sure that previous deployments are automatically removed. If you want to upgrade a running
application, implement a [migration](https://documentation.noumenadigital.com/runtime/tools/migrations/).

## Using the NPL API

All API calls to the NPL Engine require an authentication token.

Fetch a token from the embedded OIDC server with

```shell
export ACCESS_TOKEN=$(curl -s -X POST http://localhost:11000/token -d "grant_type=password" -d "username=alice" -d "password=password123" | jq -r .access_token)
```

and interact with the engine to create a hello world protocol instance:

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

## Using the NPL CLI for development

The NPL code in the `api/main/npl` folder can be adjusted to model your use case. Add new protocols and permissions, edit existing ones and create business login to implement a complete application.

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

## Support

For any question, reach out to us on the [NOUMENA Community](https://community.noumenadigital.com/).

What interaction will you be modelling next?

## Next Steps

-   [Storing changes in a GitHub repository](https://documentation.noumenadigital.com/tracks/developing-codespaces/#storing-changes-in-a-github-repository)
-   [Modelling a simple use-case in NPL](https://documentation.noumenadigital.com/howto/modelling-NPL/)
