#!/bin/bash
# Files are ordered in proper order with needed wait for the dependent custom resource definitions to get initialized.
# Usage: bash helm-apply.sh
if [ -d "csvc" ]; then
helm dep up ./csvc
helm upgrade --install csvc ./csvc --namespace enterpriseapp
fi
helm dep up ./gateway
helm upgrade --install gateway ./gateway --namespace enterpriseapp
helm dep up ./enterpriseapp
helm upgrade --install enterpriseapp ./enterpriseapp --namespace enterpriseapp
helm dep up ./enterpriseapp
helm upgrade --install enterpriseapp ./enterpriseapp --namespace enterpriseapp


