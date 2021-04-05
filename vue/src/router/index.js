import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Mobile from "@/views/Mobile";
import NewMobile from "@/views/NewMobile";
import Reviews from "@/views/Reviews";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import Review from "../views/Review.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUp
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: '/edit',
    name: 'newMobile',
    component: NewMobile
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: Reviews
  },
  {
    path: '/mobile/:id',
    name: 'mobile',
    component: Mobile
  },
  {
    path: '/review/:id',
    name: 'review',
    component: Review
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
