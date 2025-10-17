include .env

GITHUB_SHA=HEAD
MAVEN_CLI_OPTS?=--no-transfer-progress

KEYCLOAK_URL=https://keycloak-$(VITE_NC_TENANT_NAME)-$(NC_APP_NAME_CLEAN).$(NC_DOMAIN)
ENGINE_URL=https://engine-$(VITE_NC_TENANT_NAME)-$(VITE_NC_APPLICATION_NAME).$(NC_DOMAIN)
READ_MODEL_URL=https://engine-$(VITE_NC_TENANT_NAME)-$(VITE_NC_APPLICATION_NAME).$(NC_DOMAIN)/graphql
NPL_SOURCES=$(shell find npl/src/main -name \*npl)
TF_SOURCES=$(shell find keycloak-provisioning -name \*tf)

escape = $(subst $$,\$$,$1)

cli-cloud:
	curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash
	@touch cli-cloud

cli:
	@brew install NoumenaDigital/tools/npl
	@touch cli
