import MagicScroll from "~/plugins/vendor/magic-scroll"

export default function (context, inject) {
    const magicScroll = new MagicScroll({
        speed: 80,
        momentum: 0.1
    })

    // Start and make magicScroll available to the entire app
    magicScroll.init()
    inject("magicScroll", magicScroll)
}
