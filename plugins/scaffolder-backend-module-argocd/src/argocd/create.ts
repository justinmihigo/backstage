import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { KubeConfig, CustomObjectsApi, setHeaderOptions } from '@kubernetes/client-node';
import YAML from 'yaml';

const tmpl = `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: to-be-changed
spec:
  destination:
    namespace: default
    server: https://kubernetes.default.svc
  project: default
  source:
    repoURL: to-be-changed
    targetRevision: to-be-changed
  syncPolicy:
    automated:
      selfHeal: true
    syncOptions:
      - CreateNamespace=true`;

export const argocdCreateHelmApplication = () => {
    return createTemplateAction<{
        name: string;
        namespace: string;
        application: {
            path: string;
            repoURL: string;
            targetRevision: string;
        }
        chart: {
            name: string;
            repo: string;
            version: string;
        };
    }>({
        id: 'argocd:create-helm-application',
        schema: {
            input: {
                type: 'object',
                required: ['name', 'namespace'],
                properties: {
                    name: {
                        type: 'string',
                        title: 'Name',
                        description: 'The name of the Application',
                    },
                    namespace: {
                        type: 'string',
                        title: 'Namespace',
                        description: 'The namespace of the Application',
                    },
                    application: {
                        type: 'object',
                        required: ['path', 'repoURL', 'targetRevision'],
                        description: 'Details of the application source',
                        properties: {
                            path: {
                                type: 'string',
                                title: 'Path',
                                description: 'The path to the kubernetes manifest files in the repository',
                            },
                            repoURL: {
                                type: 'string',
                                title: 'Repository URL',
                                description: 'The URL of the repository containing the application',
                            },
                            targetRevision: {
                                type: 'string',
                                title: 'Target Revision',
                                description: 'The target revision of the application',
                            },
                        },
                    },
                    chart: {
                        type: 'object',
                        required: ['repo', 'name', 'version'],
                        description: 'Details of the Helm chart to be used',
                        properties: {
                            repo: {
                                type: 'string',
                                title: 'Repository',
                                description: 'The repository address, i.e. ghcr.io/organization',
                            },
                            name: {
                                type: 'string',
                                title: 'Name',
                                description: 'The name of the chart, i.e. mychart',
                            },
                            version: {
                                type: 'string',
                                title: 'Version',
                                description: 'The version of the chart, i.e. 0.1.0',
                            },
                        }
                    },
                },
            },
        },
        async handler(ctx) {
            const kc = new KubeConfig();
            kc.loadFromDefault();
            const client = kc.makeApiClient(CustomObjectsApi);
            const obj = YAML.parse(tmpl);
            obj.metadata.name = ctx.input.name;
            if (process.env.POD_NAMESPACE === undefined) {
                throw new Error('POD_NAMESPACE is not set');
            }
            obj.metadata.spec.destination.server= process.env.K8S_SERVER_URL || "https://kubernetes.default.svc"
            obj.metadata.namespace = process.env.POD_NAMESPACE;
            obj.spec.destination.namespace = ctx.input.namespace;
            if (ctx.input?.chart?.name) {
                obj.spec.source.chart = ctx.input.chart.name;
            }
            obj.spec.source.path = ctx.input.application.path;
            obj.spec.source.repoURL = ctx.input?.chart?.repo || ctx.input?.application?.repoURL;
            obj.spec.source.targetRevision = ctx.input?.chart?.version || ctx.input?.application?.targetRevision;

            // Server-side apply.
            await client.patchNamespacedCustomObject(
                {
                    group: 'argoproj.io', // group
                    version: 'v1alpha1', // version
                    namespace: obj.metadata.namespace, // namespace
                    plural: 'applications', // plural
                    name: obj.metadata.name,
                    body: obj,
                    force: true, // force
                    fieldManager: 'backstage-scaffolder', // field manager
                },
                setHeaderOptions('Content-Type', 'application/apply-patch+yaml') // header 
            ).then(
                (resp) => {
                    ctx.logger.info(
                        `Successfully created ${obj.metadata.namespace}/${obj.metadata.name} Application: HTTPResponse: ${JSON.stringify(resp, null, 2)}.`
                    );
                    for (const key in resp) {
                        ctx.logger.debug(`Response: ${key}=${resp[key]}`);
                    }
                },
                (err) => {
                    ctx.logger.info(`Applying ArgoCD Application:\n${YAML.stringify(obj)}`);
                    ctx.logger.error(
                        `Failed to make PATCH call for ${obj.metadata.namespace}/${obj.metadata.name} Application: Body ${JSON.stringify(err.body, null, 2)} Response ${JSON.stringify(err.response, null, 2)}.`
                    );
                    throw err;
                }
            )
        },
    });
};