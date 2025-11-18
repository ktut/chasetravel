import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultsView from '../views/ResultsView.vue'
import FlightConfirmation from '../views/FlightConfirmation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      component: ResultsView
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: FlightConfirmation
    }
  ]
})

router.afterEach(() => {
    setTimeout(() => {
      window.scroll({ top: -1, left: 0, behavior: "smooth" });
  }, 10); 
})

export default router
