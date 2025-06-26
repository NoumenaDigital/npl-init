FROM mcr.microsoft.com/devcontainers/java

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install git

RUN curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash