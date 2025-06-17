import { Navigate, Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { TechRadarPage } from '@backstage-community/plugin-tech-radar';
// import  kubernetesPlugin  from '@backstage/plugin-kubernetes/alpha';
import { createTranslationMessages } from '@backstage/core-plugin-api/alpha';
import { kubernetesReactTranslationRef } from '@backstage/plugin-kubernetes-react/alpha';
import { kubernetesTranslationRef } from '@backstage/plugin-kubernetes/alpha';
import { kubernetesClusterTranslationRef } from '@backstage/plugin-kubernetes-cluster/alpha';

const app = createApp({
  featureFlags:[{pluginId:'kubernetes',name:'kubernetes'}],
  apis,
   __experimentalTranslations: {
    resources: [
      createTranslationMessages({
        ref: kubernetesReactTranslationRef,
        messages: {
          "podDrawer.buttons.delete": 'Restart Pod'
        }
      }),
      createTranslationMessages({
        ref: kubernetesTranslationRef,
        messages: {
          'kubernetesContentPage.permissionAlert.title': 'Insufficient permissions',
          'kubernetesContentPage.permissionAlert.message': 'You do not have permissions to view Kubernetes objects.',
        },
      }),
      createTranslationMessages({
        ref: kubernetesClusterTranslationRef,
        messages: {
          'kubernetesClusterContentPage.permissionAlert.title': 'Insufficient permissions',
          'kubernetesClusterContentPage.permissionAlert.message': 'You do not have permissions to view Kubernetes objects.',
        },
      }),
    ]
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
    
  },
  
  components: {
    SignInPage: props => (

      [
        <SignInPage {...props} auto providers={['guest', {
          id: 'github-auth-provider',
          title: 'GitHub',
          message: 'Sign in using GitHub',
          apiRef: githubAuthApiRef,
        }]} />,

        // <SignInPage
        //   {...props}
        //   auto
        //   provider={{
        //     id: 'github-auth-provider',
        //     title: 'GitHub',
        //     message: 'Sign in using GitHub',
        //     apiRef: githubAuthApiRef,
        //   }}
        // />
      ]
    )
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
