import { createBackendModule } from "@backstage/backend-plugin-api";
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createExampleAction } from "./actions/example";
import { argocdCreateHelmApplication } from "./argocd";
import { githubWaitLastWorkflow } from "./github";
import { coreServices } from "@backstage/backend-plugin-api";
/**
 * A backend module that registers the action into the scaffolder
 */

export const scaffolderModule = createBackendModule({
  moduleId: 'argocd',
  pluginId: 'scaffolder',
  register({registerInit }) {
    registerInit({
      deps: {
        
        config: coreServices.rootConfig,
        scaffolderActions: scaffolderActionsExtensionPoint,
       
      },
      async init({ scaffolderActions, config}) {
        scaffolderActions.addActions(createExampleAction());
        scaffolderActions.addActions(argocdCreateHelmApplication());
        scaffolderActions.addActions(githubWaitLastWorkflow(config.get('integrations.github')));
      }
    });
  },
})
