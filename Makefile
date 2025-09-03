include .env

GITHUB_SHA=HEAD
MAVEN_CLI_OPTS?=--no-transfer-progress

KEYCLOAK_URL=https://keycloak-$(VITE_NC_ORG_NAME)-$(NC_APP_NAME_CLEAN).$(NC_DOMAIN)
ENGINE_URL=https://engine-$(VITE_NC_ORG_NAME)-$(VITE_NC_APP_NAME).$(NC_DOMAIN)
READ_MODEL_URL=https://engine-$(VITE_NC_ORG_NAME)-$(VITE_NC_APP_NAME).$(NC_DOMAIN)/graphql
NPL_SOURCES=$(shell find npl/src/main -name \*npl)
TF_SOURCES=$(shell find keycloak-provisioning -name \*tf)

escape = $(subst $$,\$$,$1)

cli-cloud:
	curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash
	@touch cli-cloud

cli:
	@brew install NoumenaDigital/tools/npl
	@touch cli

iam:	$(TF_SOURCES)
	@echo "Fetching IAM credentials from NPL cloud secrets..."
	@SECRETS=$$(npl cloud secrets --app $(VITE_NC_APP_NAME) --tenant $(VITE_NC_ORG_NAME)) && \
		USERNAME=$$(echo "$$SECRETS" | jq -r '.iam_username') && \
		PASSWORD=$$(echo "$$SECRETS" | jq -r '.iam_password') && \
		echo "Using IAM username: $$USERNAME" && \
		cd keycloak-provisioning && \
		KEYCLOAK_USER=$$USERNAME \
		KEYCLOAK_PASSWORD="$$PASSWORD" \
		KEYCLOAK_URL=$(VITE_CLOUD_AUTH_URL) \
		TF_VAR_default_password=welcome \
		TF_VAR_systemuser_secret=super-secret-system-security-safe \
		TF_VAR_app_name=$(VITE_NC_APP_NAME) \
		./local.sh
