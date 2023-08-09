import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	/*{
		path: '/cms',
		component: () => import('layouts/Dashboard.vue'),
		children: [
		  { path: 'hilfsmittel', name : 'Hilfsmittel',  component: () => import('pages/Admin/Auxiliaries.vue') },
		  { path: 'hilfsmittel/produkt',name : 'Hilfsmittelprodukt',  component: () => import('pages/Admin/Single/Auxiliary.vue') },
		  { path: 'hilfsmittelgruppen', name : 'Hilfsmittelgruppen',  component: () => import('pages/Admin/Auxiliarygroups.vue') },
		  { path: 'hilfsmittelgruppen/gruppe', name : 'Hilfsmittelgruppe',  component: () => import('pages/Admin/Single/Auxiliarygroup.vue') },
		  { path: 'marken',name : 'Marken / Firmen',  component: () => import('pages/Admin/Brands.vue') },
		]
	},*/
	{
		path: '/auth',
		component: () => import('layouts/AuthLayout.vue'),
		children: [
		  { path: 'login', name : 'Login',  component: () => import('src/pages/Auth/SignIn.vue') },
		  { path: 'passwort/zuruecksetzen', name : 'Passwort Zurücksetzen',  component: () => import('src/pages/Auth/PasswordReset.vue') },
		  { path: 'passwort/anfordern', name : 'Passwort Anfordern',  component: () => import('src/pages/Auth/PasswordResetRequest.vue') },
		]
	},

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;