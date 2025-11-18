import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultsView from '../views/ResultsView.vue'
import Confirmation from '../views/Confirmation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { depth: 0 }
    },
    {
      path: '/search',
      name: 'search',
      component: ResultsView,
      meta: { depth: 1 }
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: Confirmation,
      meta: { depth: 2 }
    }
  ]
})

router.afterEach(() => {
    setTimeout(() => {
      window.scroll({ top: -1, left: 0, behavior: "smooth" });
  }, 10); 
})

export default router
