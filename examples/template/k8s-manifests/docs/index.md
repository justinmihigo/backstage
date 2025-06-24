# Kubernetes Namespace and Deployment

This documentation provides sample Kubernetes manifests for creating a namespace and deploying an application.

## Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
    name: my-namespace
```

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: my-app
    namespace: my-namespace
spec:
    replicas: 2
    selector:
        matchLabels:
            app: my-app
    template:
        metadata:
            labels:
                app: my-app
        spec:
            containers:
                - name: my-app-container
                    image: nginx:latest
                    ports:
                        - containerPort: 80
```

## Usage

Apply the manifests using:

```sh
kubectl apply -f <manifest-file>.yaml
```