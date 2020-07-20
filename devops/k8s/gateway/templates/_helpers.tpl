{{/* vim: set filetype=mustache: */}}
{{/*
postgresql customisation
*/}}
{{- define "postgresql.name" -}}
{{- default "gateway-postgresql" -}}
{{- end -}}

{{- define "postgresql.fullname" -}}
{{- default "gateway-postgresql" -}}
{{- end -}}
