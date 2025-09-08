/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';
import sendSlackMessageModule from "@mdude2314/backstage-plugin-scaffolder-backend-module-slack"
import { ragai } from './plugins/rag-ai';
// import { notificationsPlugin } from './plugins/notifications';
const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
// See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
// backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend'));

// notifications
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'))
backend.add(import('@backstage/plugin-notifications-backend-module-slack'));
backend.add(sendSlackMessageModule());
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);

// argocd
backend.add(import('@roadiehq/backstage-plugin-argo-cd-backend/alpha'));


// backend.add(import('@backstage/plugin-scaffolder-backend'));
// See https://
backend.add(import('@internal/plugin-scaffolder-backend-module-argocd'));
// backend.add(import('@alithya-oss/backstage-plugin-rag-ai-backend'))
backend.add(import('@roadiehq/rag-ai-backend'))
// backend.add(import('@alithya-oss/backstage-plugin-rag-ai-backend-module-openai'));
backend.add(ragai)
// pulumi
backend.add(import('@pulumi/backstage-scaffolder-backend-pulumi'));
backend.add(import('@pulumi/plugin-catalog-backend-module-pulumi/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-elasticsearch'));
backend.add(import('@backstage-community/plugin-sonarqube-backend'));
backend.add(import ('@mycloudlab/scaffolder-backend-module-ansible-controller'));
backend.start();

