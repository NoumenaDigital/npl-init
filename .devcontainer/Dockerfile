FROM mcr.microsoft.com/devcontainers/universal:latest
ADD --chmod=755 https://documentation.noumenadigital.com/get-npl-cli.sh /tmp/
RUN /tmp/get-npl-cli.sh \
    && cp /root/.npl/bin/npl /usr/local/bin/npl
