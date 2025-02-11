import { createRouter, createWebHistory } from 'vue-router'
import EventListView from '@/views/EventListView.vue'
import EventEditView from '@/views/event/EventEditView.vue'
import EventRegisterView from '@/views/event/EventRegisterView.vue'
import AboutView from '../views/AboutView.vue'
import EventLayoutView from '@/views/event/EventLayoutView.vue'
import EventDetailView from '@/views/event/EventDetailView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import NetWorkErrorView from '@/views/NetworkErrorView.vue'
import AddEvent from '@/views/EventForm.vue'
import AddOrganizer from '@/views/OrganizerForm.vue'
import NProgress from 'nprogress'
import GStore from '@/store'
import EventService from '@/services/EventService'
import OrganizerService from '@/services/OrganizerService.js'
import OrganizerDetailView from '@/views/organizer/OrganizerDetailView.vue'
import OrganizerLayoutView from '@/views/organizer/OrganizerLayoutView.vue'
import OrganizerView from '@/views/OrganizerListView.vue'
const routes = [
  {
    path: '/',
    name: 'EventList',
    component: EventListView,
    props: (route) => ({ page: parseInt(route.query.page) || 1 })
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/organizer',
    name: 'OrganizerView',
    component: OrganizerView,
    props: (route) => ({ page: parseInt(route.query.page) || 1 })
  },
  {
    path: '/organizer/:id',
    name: 'OrganizerLayoutView',
    component: OrganizerLayoutView,
    beforeEnter: (to) => {
      console.log(to.params.id)
      return OrganizerService.getOrganizer(to.params.id)
        .then((response) => {
          GStore.organizers = response.data
        })
        .catch((error) => {
          if (error.response && error.response.start == 404) {
            return {
              name: '404Resource',
              parames: { resource: 'event' }
            }
          } else {
            return { name: 'NetworkError' }
          }
        })
    },
    props: true,
    children: [
      {
        path: 'organizerDetail',
        name: 'organizerDetail',
        component: OrganizerDetailView,
        props: true
      }
    ]
  },
  {
    path: '/event/:id',
    name: 'EventLayoutView',
    component: EventLayoutView,
    beforeEnter: (to) => {
      return EventService.getEvent(to.params.id)
        .then((response) => {
          GStore.event = response.data
        })
        .catch((error) => {
          if (error.response && error.response.start == 404) {
            return {
              name: '404Resource',
              parames: { resource: 'event' }
            }
          } else {
            return { name: 'NetworkError' }
          }
        })
    },
    props: true,
    children: [
      {
        path: '',
        name: 'EventDetails',
        component: EventDetailView,
        props: true
      },
      {
        path: 'register',
        name: 'EventRegister',
        props: true,
        component: EventRegisterView
      },
      {
        path: 'edit',
        name: 'EventEdit',
        props: true,
        component: EventEditView
      }
    ]
  },
  {
    path: '/add-event',
    name: 'AddEvent',
    component: AddEvent,
    beforeEnter: () => {
      return OrganizerService.getOrganizers()
        .then((response) => {
          GStore.organizers = response.data
        })
        .catch(() => {
          GStore.organizers = null
          console.log('cannot load organizer')
        })
    }
  },
  {
    path: '/add-organizer',
    name: 'AddOrganizer',
    component: AddOrganizer
  },
  {
    path: '/404/:resource',
    name: '404Resource',
    component: NotFoundView,
    props: true
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundView
  },
  {
    path: '/network-error',
    name: 'NetworkError',
    component: NetWorkErrorView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
