docker compose up -d --wait

curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash

PATH=/home/codespace/.npl/bin:/root/.npl/bin:$PATH npl deploy --sourceDir src/main
