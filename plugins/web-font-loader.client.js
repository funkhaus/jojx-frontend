import WebFont from "webfontloader"

// See webfontloader docs here: https://github.com/typekit/webfontloader#modules
WebFont.load({
    custom: {
        families: ["Plantin MT Pro"]
    },
    active: function () {
        window.dispatchEvent(new CustomEvent("font-loaded"))
    }
})
