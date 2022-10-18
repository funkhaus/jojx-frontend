// Import custom directives here
import Vue from "vue"
import inView from "~/directives/InView"
import intersectionObserver from "~/directives/IntersectionObserver"
import { VuePrlxDirective } from "vue-prlx"
let hasLoadedDirectives = false

if (!hasLoadedDirectives) {
    Vue.directive("in-view", inView)
    Vue.directive("intersection-observer", intersectionObserver)
    Vue.directive("prlx", VuePrlxDirective)
    hasLoadedDirectives = true
}
