# these ensure that if any cmd fails in the pipeline the whole script will fail
set -e; set -o pipefail; 

nix build
image=$((docker load < result) | sed -n '$s/^Loaded image: //p')
docker image tag "$image" test-docker:latest
