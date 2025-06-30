FROM ubuntu:latest
ADD --chmod=755 https://documentation.noumenadigital.com/get-npl-cli.sh /tmp/
RUN \
    # Install basic stuff
    apt-get update && export DEBIAN_FRONTEND=noninteractive  \
    && apt-get install -y --no-install-recommends \
      ca-certificates curl git make sudo vim zip unzip \
    && apt-get clean -y \
    # Install NPL CLI
    && /tmp/get-npl-cli.sh \
    && cp /root/.npl/bin/npl /usr/local/bin/npl \
    && rm -rf /tmp/* \
    # Set up codespace user
    && useradd -m -s /bin/bash codespace \
    && echo "codespace ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

VOLUME ["/var/lib/docker"]
WORKDIR /home/codespace
