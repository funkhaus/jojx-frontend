<script>
// Setup class
const ObserverState = (el, settings) => {
    let observer
    let hasIntersected = el.classList.contains("has-intersected") || false
    let timerId

    // Setup the observer, check for class on start
    const init = () => {
        if (!observer) {
            observer = initObserver()
            observer.observe(el)
        }
        refresh()
    }

    // Creates Observer
    const initObserver = () => {
        return new IntersectionObserver(onIntersection, settings.value)
    }

    // This is the function that runs when an Intersection occurs.
    // NOTE Intersection event happens when it goes out of view too!
    // SEE https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // SEE https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
    const onIntersection = (entries, observer) => {
        entries.forEach(function (entry, index) {
            const target = entry.target

            // If "once" and already intersected, we have nothing to do
            if (settings.modifiers.once && hasIntersected) return

            // Save state so refresh() can set it later
            hasIntersected = entry.isIntersecting

            // Stagger time by number
            clearTimeout(timerId)
            timerId = setTimeout(() => {
                refresh()

                // Setup relevent events
                let toggleEvent = new CustomEvent("has-exited", {
                    detail: entry,
                })
                if (hasIntersected) {
                    toggleEvent = new CustomEvent("has-entered", {
                        detail: entry,
                    })
                }
                const allEvent = new CustomEvent("has-intersected", {
                    detail: entry,
                })

                // Fire off events now!
                target.dispatchEvent(allEvent)
                target.dispatchEvent(toggleEvent)
            }, getStagger())
        })
    }

    // Generate random time for stagger effect
    const getStagger = () => {
        let number = 0
        if (settings.modifiers.stagger) {
            number = Math.floor(Math.random() * Math.floor(500))
        }
        return number
    }

    // This will set the correct classes
    const refresh = () => {
        el.classList.add("has-intersection-observer")

        if (hasIntersected) {
            el.classList.add("has-intersected")
        } else {
            el.classList.remove("has-intersected")
        }

        return hasIntersected
    }

    // Remove observer
    const destroy = () => {
        observer.disconnect()
        delete el._observer
    }

    // What public methods to expose
    return Object.freeze({
        init,
        refresh,
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
                rootMargin: "0px",
                threshold: 0.0,
            },
            modifiers: {
                once: false,
                stagger: false,
            },
        }

        // Overwrite settings
        settings.value = { ...settings.value, ...binding.value }
        settings.modifiers = { ...settings.modifiers, ...binding.modifiers }

        // Start ObserverState constructor, save to el for future access
        el._observer = new ObserverState(el, settings)
        el._observer.init()
    },
    update(el) {
        if (el._observer) {
            el._observer.refresh()
        }
    },
    unbind(el) {
        if (el._observer) {
            el._observer.destroy()
        }
    },
    inserted(el) {
        if (el._observer) {
            el._observer.init()
        }
    },
}
</script>
