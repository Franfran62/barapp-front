import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/panier',
      name: 'panier',
      component: () => import('../views/PanierView.vue')
    },
    {
      path: '/commande-success/:numero',
      name: 'commande-success',
      component: () => import('../views/CommandeSuccessView.vue')
    },
    {
      path: '/commande',
      name: 'commande',
      component: () => import('../views/CommandeView.vue')
    },
    {
      path: '/admin/login',
      name: 'login',
      component: () => import('../views/user/LoginView.vue')
    },
    {
      path: '/admin/commandes',
      name: 'admin-commande',
      component: () => import('../views/admin/AdminCommandesView.vue')
    },
    {
      path: '/admin/commande/:id',
      name: 'admin-commande-detail',
      component: () => import('../views/admin/AdminCommandeDetailView.vue')
    },
    {
      path: '/admin/categorie',
      name: 'admin-categorie',
      component: () => import('../views/admin/AdminCategorieView.vue')
    },
    {
      path: '/admin/boisson',
      name: 'admin-boisson',
      component: () => import('../views/admin/AdminBoissonView.vue')
    },
    {
      path: '/admin/boisson/ajouter',
      name: 'admin-boisson-create',
      component: () => import('../views/admin/AdminBoissonCreateView.vue')
    },
    {
      path: '/admin/ingredient',
      name: 'admin-ingredient',
      component: () => import('../views/admin/AdminIngredientView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const loginTimeStr = localStorage.getItem('loginTime');
  const loginTime = loginTimeStr ? parseInt(loginTimeStr) : null;

  if (typeof to.name === 'string' && to.name?.startsWith('admin') && (!token || !loginTime || Date.now() - loginTime > 20 * 60 * 1000)) {
    next({ name: 'login' })
  } else {
    if (typeof to.name === 'string' && to.name?.startsWith('admin') && token && loginTime && Date.now() - loginTime < 5 * 60 * 1000) {
      localStorage.setItem('loginTime', Date.now().toString());
    }
    next()
  }
})

router.afterEach((to, from) => {
  const isAdminRoute = to.path.includes('/admin');
  const bodyClass = isAdminRoute ? 'admin' : 'client'
  document.body.className = bodyClass
})

export default router
