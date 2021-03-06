#!/bin/bash
# Files are ordered in proper order with needed wait for the dependent custom resource definitions to get initialized.
# Usage: bash helm-apply.sh
kubectl apply -f namespace.yaml
kubectl label namespace enterpriseapp istio-injection=enabled
if [ -d "csvc" ]; then
helm delete --purge csvc 2>/dev/null
helm dep up ./csvc
helm install --name csvc ./csvc --namespace enterpriseapp
fi
helm delete --purge gateway 2>/dev/null
helm dep up ./gateway
helm install --name gateway  ./gateway --namespace enterpriseapp
helm delete --purge enterpriseapp 2>/dev/null
helm dep up ./enterpriseapp
helm install --name enterpriseapp  ./enterpriseapp --namespace enterpriseapp
helm delete --purge enterpriseapp 2>/dev/null
helm dep up ./enterpriseapp
helm install --name enterpriseapp  ./enterpriseapp --namespace enterpriseapp


