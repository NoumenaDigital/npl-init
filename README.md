# npl-init

Starter project intended to be a quick start for writing NPL, deploying it to NOUMENA Cloud, or deploying it to an NPL Engine running locally in DEV_MODE.

Starter options:

- If you want to develop and deploy NPL locally, follow the steps provided in
the [Developing on your own machine](https://documentation.noumenadigital.com/tracks/developing-NPL-local/) track. 

- Alternatively, you can open the repository in GitHub Codespaces by going to the [npl-init GitHub repository](https://github.com/NoumenaDigital/npl-init), and clicking on `Use this template`, then select `Open in a Codespace`.

- **If you've already opened the `npl-init` repository in a Codespace**, see the [Running the npl-init app on NOUMENA Cloud](#running-the-npl-init-app-on-noumena-cloud) or the [Running the npl-init app in Codespaces](#running-the-npl-init-app-in-codespaces) sections to get started with running your first NPL application.

## Running the npl-init app on NOUMENA Cloud

NOUMENA Cloud offers an environment to run NPL applications, including the NPL Engine, an IAM service, and frontend hosting. The next steps will guide you through the deployment of NPL on NOUMENA Cloud.

Before continuing, make sure you have registered on [NOUMENA Cloud](https://portal.noumena.cloud/) and created an application in your tenant.

For developers working in VS Code, Cursor, or GitHub Codespaces, direct deployment is supported.

1.  In the VS Code or Codespaces sidebar, select the NOUMENA icon to open the NOUMENA Cloud panel

2.  Click `Sign in to NOUMENA Cloud`, provide your NOUMENA Cloud credentials in the browser window, and select `Yes` when
    prompted to `Grant Access to NOUMENA Cloud`

3.  The NOUMENA Cloud panel of your VS Code editor should now display your NOUMENA Cloud tenants and applications. If
    not, click the refresh icon

4.  Hover or click on your target application, select `Deploy application`, then `NPL Backend` in the action menu

    > If you are deploying NPL source code again to the same application, make sure to clear the existing package first
    > or implement a [migration](../../runtime/tools/migrations/index.md) for the changes to take effect.
    >
    > To clear NPL sources from the application, select the `Clear deployed NPL application` next to your application in the
    > NOUMENA Cloud panel.

5.  Wait for deployment to complete (indicated by a success message in the VS Code or Codespaces notification area)

Once deployment completes, the NOUMENA Cloud Portal updates to show the new "Last deployment" date for your NPL code. You can also navigate to the
Services tab of the application and visit the Swagger UI to check that the NPL code has been deployed successfully.

## Running the npl-init app in Codespaces

In the next steps, you will be able to run an NPL Engine within the virtual environment provided by the Codespace, and deploy NPL to it.

### Running the NPL Engine

The NPL Engine is the core component that executes the NPL code and manages the protocol data.

To start the NPL Engine within the Codespace, run the following from the Codespace console:

```shell
docker compose up --wait
```

### Deploying NPL locally

To deploy (or re-deploy) your NPL code to the runtime, run:

```shell
npl deploy --clear --sourceDir api/src/main
```

The `--clear` flag makes sure that previous deployments are automatically removed. If you want to upgrade a running
application, implement a [migration](https://documentation.noumenadigital.com/runtime/tools/migrations/).

## Using the NPL API

Note: This section applies to the case of an Engine running locally on our machine or within a Codespace. For an Engine running in NOUMENA Cloud, check the corresponding [NOUMENA Cloud documentation](https://documentation.noumenadigital.com/cloud/portal/) to create users and make API calls.

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

The NPL code in the `api/main/npl` folder can be adjusted to model your use case. Add new protocols and permissions, edit existing ones and create business logic to implement a complete application.

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

-   [Modelling a simple use-case in NPL](https://documentation.noumenadigital.com/howto/modelling-NPL/)
-   [Storing changes in a GitHub repository](https://documentation.noumenadigital.com/tracks/developing-codespaces/#storing-changes-in-a-github-repository)
-   [Creating application users on NOUMENA Cloud](https://documentation.noumenadigital.com/cloud/portal/create-users/)
