{{/* vim: set filetype=mustache: */}}
{{/*
postgresql customisation
*/}}
{{- define "postgresql.name" -}}
{{- default "enterpriseapp-postgresql" -}}
{{- end -}}

{{- define "postgresql.fullname" -}}
{{- default "enterpriseapp-postgresql" -}}
{{- end -}}
