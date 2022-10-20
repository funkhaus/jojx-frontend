/**
 * Figures out if an element has scrollbars
 * https://stackoverflow.com/a/42681820/503546
 * @param {HTMLElement} element
 * @returns {object}
 */
function isScrollable(el) {
    const style = getComputedStyle(el)

    const hidden = style.overflow === "hidden"
    const xHidden = style.overflowX === "hidden"
    const yHidden = style.overflowY === "hidden"

    // If overflow:hidden, then no scorll bars ever
    if (hidden) {
        return {
            x: false,
            y: false
        }
    }

    // Calculate if element is overflowing
    var y1 = el.scrollTop
    el.scrollTop += 1
    var y2 = el.scrollTop
    el.scrollTop -= 1
    var y3 = el.scrollTop
    el.scrollTop = y1
    var x1 = el.scrollLeft
    el.scrollLeft += 1
    var x2 = el.scrollLeft
    el.scrollLeft -= 1
    var x3 = el.scrollLeft
    el.scrollLeft = x1
    let x = x1 !== x2 || x2 !== x3
    let y = y1 !== y2 || y2 !== y3

    // Force no scrollbars if set as hidden in CSS
    if (xHidden) {
        x = false
    }
    if (yHidden) {
        y = false
    }

    return {
        x,
        y
    }
}

/**
 * Finds the nearest scrollable ancestor of an element
 * https://stackoverflow.com/questions/35939886/find-first-scrollable-parent
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
function getScrollParent(element) {
    // If self is scrollable, then return it
    if (isScrollable(element).y) {
        return element
    }

    // Now check every parent upwards to find out if that is a scrollable element
    for (var parent = element; (parent = parent.parentElement); ) {
        if (isScrollable(parent).y) {
            return parent
        } else {
            continue
        }
    }

    return false
}

/**
 * @param {number} value
 * @param {number} target
 * @param {number} time
 * @returns {number}
 */
function lerp(value, target, time) {
    return value * (1 - time) + target * time
}

/**
 * This isn't perfect, but preserving so the plugin remains backwards compatible
 * https://stackoverflow.com/a/5542105
 * @param {WheelEvent} e
 * @returns {number}
 */
function normalizeWheelDelta(e) {
    if (e.detail) {
        if (e.wheelDelta)
            return (e.wheelDelta / e.detail / 40) * (e.detail > 0 ? 1 : -1)
        else return -e.detail / 3
    } else return e.wheelDelta / 120
}

class MagicScroll {
    /**
     * Whether or not we've attached event handlers
     * @private
     * @type {boolean}
     */
    initialized = false
    /**
     * Holds onto the target destination and value for elements that are animating
     * @private
     * @type {Map}
     */
    targets = new Map()
    /**
     * How far we scroll the element with each wheel event
     * @private
     * @type {number}
     */
    speed = 30
    /**
     * How quickly we animate the scroll, value between 0 and 1
     * this is passed directly as t to lerp
     * @private
     * @type {number}
     */
    momentum = 0.1
    /**
     * Request animation frame id
     * @private
     * @type {number}
     */
    rafId

    /**
     * @param {{
     *   momentum: number;
     *   speed: number;
     * }} options
     */
    constructor(options) {
        this.momentum = options.momentum
        this.speed = options.speed
    }

    /**
     * Goes through each target and updates the scroll position
     * removing any that are done animating
     * @private
     */
    animate = () => {
        for (const [el, data] of this.targets.entries()) {
            const nextVal = lerp(data.value, data.target, this.momentum)
            el.scrollTop = nextVal
            data.value = nextVal

            if (Math.abs(data.target - nextVal) < this.momentum) {
                this.targets.delete(el)
            }
        }

        if (this.targets.size > 0) {
            this.rafId = requestAnimationFrame(this.animate)
        }
    }

    /**
     * Updates the target value for nearest scrolling ancestor
     * and kicks off the animation loop if necessary
     * @private
     */
    handleWheelEvent = (e) => {
        const scrollingElement = getScrollParent(e.target)

        // If no scrolling element found, or a horizontal scroll attempted, then act like normal scroll
        if (!scrollingElement || e.deltaX !== 0) {
            return
        }

        // Prevent regular scroll event now
        e.preventDefault()

        const delta = -normalizeWheelDelta(e) * this.speed
        const shouldStartAnimation = this.targets.size === 0

        const value = scrollingElement.scrollTop
        const target = Math.max(
            0,
            Math.min(
                value + delta,
                scrollingElement.scrollHeight -
                    scrollingElement.clientHeight +
                    (scrollingElement.scrollHeight -
                        scrollingElement.offsetHeight)
            )
        )

        this.targets.set(scrollingElement, {
            target,
            value
        })

        if (shouldStartAnimation) {
            this.rafId = requestAnimationFrame(this.animate)
        }
    }

    /**
     * Initializes the wheel event handler
     */
    init() {
        document.addEventListener("wheel", this.handleWheelEvent, {
            passive: false
        })

        this.initialized = true
    }

    /**
     * Removes the wheel event handler
     */
    destroy() {
        document.removeEventListener("wheel", this.handleWheelEvent)
        cancelAnimationFrame(this.rafId)
        this.initialized = false
    }

    /**
     * Determines if the event handlers are attached
     */
    isEnabled() {
        return this.initialized
    }
}

export default MagicScroll
