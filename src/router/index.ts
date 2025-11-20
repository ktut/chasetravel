import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultsView from '../views/ResultsView.vue'
import Confirmation from '../views/Confirmation.vue'
import HotelView from '../views/HotelView.vue'
import MyBookings from '../views/MyBookings.vue'
import ComponentsView from '../views/ComponentsView.vue'

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
      path: '/hotel/:id',
      name: 'hotel',
      component: HotelView,
      meta: { depth: 2 }
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: Confirmation,
      meta: { depth: 3 }
    },
    {
      path: '/mybookings',
      name: 'mybookings',
      component: MyBookings,
      meta: { depth: 4 }
    },
    {
      path: '/components',
      name: 'components',
      component: ComponentsView,
      meta: { depth: 1 }
    }
  ]
})

router.afterEach(() => {
    setTimeout(() => {
      window.scroll({ top: -1, left: 0, behavior: "smooth" });
  }, 10); 
})

export default router
