<script>
import _clamp from "lodash/clamp"
import rafThrottle from "~/utils/rafThrottle"

// Setup class
const InViewState = (el, settings) => {
    let root
    let observer
    let timerId
    let scrollHandler
    let oldScroll = 0
    let hasIntersected = el.classList.contains("view-in") || false

    // Setup the observer, check for class on start
    const init = () => {
        root = settings.value.root || document || window

        if (!observer) {
            observer = initObserver(settings.value)
            observer.observe(el)
            window.addEventListener("resize", updatePosition)
        }

        updatePosition()
    }

    // If directive updates, destroy and re-init
    const update = () => {
        destroy()
        init()
    }

    // Remove and clean up everything
    const destroy = () => {
        stopTracking()
        observer.disconnect()
        window.removeEventListener("resize", updatePosition)
        scrollHandler = null
        observer = null
        delete el._inView
    }

    // Creates Observer
    const initObserver = ({ root, rootMargin, threshold }) => {
        const options = {
            root,
            rootMargin,
            threshold,
        }
        return new IntersectionObserver(intersectionHandler, options)
    }

    // This is the function that runs when an Intersection occurs.
    // We use this to only start tracking the postion of elements when they are close to being in view.
    // SEE https://developer.mozilla.org/en-US/docs/Web/API/Intersection_inView_API
    // SEE https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
    const intersectionHandler = (entries, observer) => {
        entries.forEach(function (entry, index) {
            // If "once" and already intersected, we have nothing to do
            if (settings.modifiers.once && hasIntersected) {
                destroy()
                return
            }

            // Save state so we can set it later
            hasIntersected = entry.isIntersecting

            // Stagger eveything by random number
            // This is done to make multiple elements not all "in view" at exactly the same time.
            clearTimeout(timerId)
            timerId = setTimeout(() => {
                if (hasIntersected) {
                    startTracking()
                } else {
                    stopTracking()
                }
                emitIntersectionEvents(entry)
            }, getStagger())
        })
    }

    // Start tracking the position of the element now that they are in view
    const startTracking = () => {
        // Save a throttled scroll handler so we can remove later.
        // Throttled for performance!
        scrollHandler = rafThrottle(updatePosition)
        root.addEventListener("scroll", scrollHandler, {
            passive: true,
        })
        return scrollHandler
    }

    // Stop tracking the position of the element now that they are out of view
    const stopTracking = () => {
        // Remove throttled scroll handler
        root.removeEventListener("scroll", scrollHandler)
        scrollHandler = null
        return !scrollHandler
    }

    // This is the main callback on scroll events. Calculate the position of the element and emit events.
    const updatePosition = () => {
        const viewHeight = root.clientHeight || window.innerHeight
        const scrollTop = root.scrollTop || window.pageYOffset
        const rect = el.getBoundingClientRect()
        const data = { rect, viewHeight, scrollTop }

        // Get percentages of element in view
        const progress = {
            percentVisible: getPercentVisible(data),
            percentCenter: getPercentCenter(data),
            percentTop: getPercentTop(data),
            percentFromCenter: getPercentFromCenter(data),
            percentScrolled: getPercentScrolled(data),
            percentToCenter: getPercentToCenter(data),
        }

        // Build out event detail, add in extra flags data
        const detail = {
            ...data,
            ...progress,
            flags: getFlags({ ...data, ...progress }),
        }

        // Dispatch an event with the detail. Remove reactivity data from Object.
        const progressEvent = new CustomEvent("progress", {
            detail: Object.freeze(detail),
        })
        el.dispatchEvent(progressEvent)

        // Set classes
        setClasses(detail)

        // Set some CCS vars
        if (settings.value.cssVars) {
            setCssVars(detail)
        }

        return detail
    }

    // Returns the percent of the element that is visible
    const getPercentVisible = ({ rect, viewHeight }) => {
        // Get distence above and below the element, don't allow to go into negative numbers.
        rect.fromTop = _clamp(rect.top, 0, viewHeight)
        rect.fromBottom = _clamp(viewHeight - rect.bottom, 0, viewHeight)

        return (viewHeight - rect.fromTop - rect.fromBottom) / rect.height || 0
    }

    // Center of element to top of viewport. 0 when not in view below, 0.5 at center, 1 when center at top of view or above.
    const getPercentCenter = ({ rect, viewHeight }) => {
        const rectCenter = rect.top + rect.height / 2

        // Distance between two centers as percentage
        return _clamp(1 - rectCenter / viewHeight, 0, 1)
    }

    // Get the percentage of distance from center of element to center of viewport. -1 when at bottom or below, 0 at center, +1 when center is at top or above.
    const getPercentFromCenter = ({ rect, viewHeight }) => {
        const viewHeightCenter = viewHeight / 2
        const rectCenter = rect.top + rect.height / 2

        const amount = (viewHeightCenter - rectCenter) / viewHeightCenter

        return _clamp(amount, -1, 1)
    }

    // Get percentage of distence top of element is to center of view. 0 when at bottom of screen, 1 when element top is at center of view.
    const getPercentToCenter = ({ rect, viewHeight }) => {
        const viewHeightCenter = viewHeight / 2
        const rectTop = rect.top

        const amount = Math.abs(viewHeightCenter / rectTop)

        return _clamp(amount, 0, 1)
    }

    // Percentage of top of element to top of viewport
    const getPercentTop = ({ rect, viewHeight }) => {
        return _clamp(rect.top / viewHeight, 0, 1)
    }

    // Percentage of element that has been scrolled threw view. 0 when top of element is in view, 1 when bottom of element hits top of view.
    const getPercentScrolled = ({ rect, viewHeight }) => {
        const top = viewHeight - rect.top
        const amount = rect.height + viewHeight

        return _clamp(top / amount, 0, 1)
    }

    // Return an object with useful flags about the element
    const getFlags = ({ percentCenter, percentVisible, rect, scrollTop }) => {
        const inView = percentVisible > 0

        // Figure out scroll direction
        let scrollDirection = "up"
        if (scrollTop > oldScroll && scrollTop) {
            scrollDirection = "down"
        } else {
            scrollDirection = "up"
        }
        oldScroll = scrollTop || 0

        return {
            inView: percentVisible > 0,
            isAbove: rect.top < 0 && !inView,
            isBelow: rect.top > 0 && !inView,
            isHalf: percentVisible >= 0.5,
            isFull: percentVisible === 1,
            intersectingTop:
                percentCenter > 0.5 && percentVisible < 1 && inView,
            intersectingBottom:
                percentCenter < 0.5 && percentVisible < 1 && inView,
            scrollingDown: scrollDirection === "down",
            scrollingUp: scrollDirection === "up",
        }
    }

    // Set CSS classes for convenience
    const setClasses = ({ flags }) => {
        // Classes when in view
        el.classList.toggle("view-in", flags.inView)
        el.classList.toggle("view-in-half", flags.isHalf)
        el.classList.toggle("view-in-full", flags.isFull)

        // Classes when out of view
        el.classList.toggle("view-out", !flags.inView)
        el.classList.toggle("view-out-above", flags.isAbove)
        el.classList.toggle("view-out-below", flags.isBelow)

        // Classes when intersection edge of view
        el.classList.toggle("view-intersecting-top", flags.intersectingTop)
        el.classList.toggle(
            "view-intersecting-bottom",
            flags.intersectingBottom
        )

        // Add scrolling classes
        el.classList.toggle("view-scrolling-down", flags.scrollingDown)
        el.classList.toggle("view-scrolling-up", flags.scrollingUp)

        return true
    }

    // Emit some use JS events for convenience
    const emitIntersectionEvents = (entry) => {
        const detail = {
            entry,
            progress: updatePosition(),
        }

        // Emit an event on intersection
        const intersectionEvent = new CustomEvent("intersection", {
            detail,
        })
        el.dispatchEvent(intersectionEvent)

        // Emit shortcut events for in and out of view
        if (entry.isIntersecting) {
            const enteredEvent = new CustomEvent("has-entered", {
                detail,
            })
            el.dispatchEvent(enteredEvent)
        } else {
            const exitedEvent = new CustomEvent("has-exited", {
                detail,
            })
            el.dispatchEvent(exitedEvent)
        }

        return true
    }

    // Set some CSS variables on the element for convenience
    const setCssVars = ({
        percentVisible,
        percentCenter,
        percentTop,
        percentFromCenter,
        percentToCenter,
        percentScrolled,
    }) => {
        el.style.setProperty("--view-percent-visible", percentVisible)
        el.style.setProperty("--view-percent-center", percentCenter)
        el.style.setProperty("--view-percent-top", percentTop)
        el.style.setProperty("--view-percent-from-center", percentFromCenter)
        el.style.setProperty("--view-percent-top-center", percentToCenter)
        el.style.setProperty("--view-percent-scrolled", percentScrolled)

        return true
    }

    // Generate random time for stagger effect
    const getStagger = (maxTime = 500) => {
        let number = 0
        if (settings.modifiers.stagger) {
            number = Math.floor(Math.random() * Math.floor(maxTime))
        }
        return number
    }

    // What public methods to expose
    return Object.freeze({
        init,
        update,
        destroy,
        hasIntersected,
    })
}

// The Vue directive config
export default {
    bind(el, binding) {
        // Default settings
        const settings = {
            value: {
                root: null,
                rootMargin: "0px 0px 0px 0px",
                threshold: 0.0,
                cssVars: false,
            },
            modifiers: {
                once: false,
                stagger: false,
            },
        }

        // Overwrite any default settings
        settings.value = { ...settings.value, ...binding.value }
        settings.modifiers = { ...settings.modifiers, ...binding.modifiers }

        // Start constructor, save to el for future access
        el._inView = new InViewState(el, settings)
        el._inView.init()
    },
    update(el) {
        if (el._inView) {
            el._inView.update()
        }
    },
    unbind(el) {
        if (el._inView) {
            el._inView.destroy()
        }
    },
    inserted(el) {
        if (el._inView) {
            el._inView.update()
        }
    },
}
</script>
