import SITE_SETTINGS from "~/gql/queries/SiteSettings.gql"
import _get from "lodash/get"

// Define State defaults
export const state = () => ({
    siteMeta: {},
    menuIsOpen: false,
    breakpoint: "desktop",
    sTop: 0,
    winHeight: 0,
    winWidth: 0,
    referrer: false,
    theme: "",
    introIsActive: true
})

// Define mutations
export const mutations = {
    SET_BREAKPOINT(state, breakpoint) {
        state.breakpoint = breakpoint
    },
    SET_MENU(state, data) {
        state.menuIsOpen = data
    },
    SET_S_TOP(state, pos) {
        state.sTop = pos
    },
    SET_WIN_DIMENSIONS(state, dimensions) {
        state.winHeight = dimensions.height
        state.winWidth = dimensions.width
    },
    SET_SITE_META(state, data) {
        state.siteMeta = data
    },
    SET_REFERRER(state, object) {
        state.referrer = object
    },
    SET_SCROLL_DIRECTION(state, direction) {
        state.scrollDirection = direction
    },
    SET_THEME(state, data) {
        state.theme = data
    },
    SET_INTRO(state, bool) {
        state.introIsActive = bool
    }
}

// Define actions
export const actions = {
    //async nuxtServerInit(store, context) {},

    async nuxtGenerateInit({ dispatch }, context) {
        // NOTE context.generatePayload will be populated after first route is generated
        return await dispatch("QUERY_SETTINGS", context)
    },

    async QUERY_SETTINGS({ commit }, context) {
        if (!process.env.GQL_ENDPOINT) {
            throw new Error(
                "No GQL endpoint found. You probably forgot to set the enviroment vars correctly."
            )
        }

        // If we already have generatePayload, just store it and return
        if (context.generatePayload) {
            commit("SET_SITE_META", context.generatePayload)
            return context.generatePayload
        }

        // Get site settings from WordPress and save them to store
        try {
            const data = await this.$graphql.default.request(SITE_SETTINGS)

            const options = _get(data, "acfSettings.siteOptions", {})

            // Get and shape general settings
            const settings = _get(data, "wpSettings", {})
            let meta = {
                title: settings.title,
                description: settings.description,
                themeScreenshotUrl: settings.themeScreenshotUrl,
                backendUrl: settings.backendUrl,
                frontendUrl: settings.frontendUrl
            }

            // Get ACF site settings, shape them correctly
            if (options.googleAnalytics) {
                meta.gaTrackingCodes = options.googleAnalytics.map((item) => {
                    return item.code
                })
                delete options.googleAnalytics
            }
            options.socialSharedImage = _get(
                options,
                "socialSharedImage.sourceUrl",
                ""
            )

            const siteMeta = { ...meta, ...options }
            commit("SET_SITE_META", siteMeta)
            return siteMeta
        } catch (e) {
            throw new Error(e)
        }
    }
}
