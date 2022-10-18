<template>
    <div
        ref="stage"
        :class="classes"
    >
        <div
            v-if="$slots.top"
            ref="top"
            class="slot slot-top"
            :style="slotStyles"
        >
            <slot name="top" />
        </div>

        <lazy-video-player
            v-if="customPlayer"
            ref="customPlayer"
            :src="src"
            :color="color"
            :title="title"
            :muted="muted"
            :playsinline="playsinline"
            :autoplay="autoplay"
            class="custom-player"
            :dimensions="iframeStyles"
            :mode="mode"
            @ended="onEnded"
            @has-loaded="onCustomPlayerLoaded"
        />

        <iframe
            v-else
            ref="iframe"
            class="iframe"
            :src="iFrameSrc"
            :width="width"
            :height="height"
            frameborder="0"
            allow="autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture;"
            allowfullscreen
            :playsinline="playsinline"
            :title="title"
            :style="iframeStyles"
        />

        <div
            v-if="$slots.default"
            ref="bottom"
            class="slot slot-bottom"
            :style="slotStyles"
        >
            <slot />
        </div>
    </div>
</template>

<script>
import VimeoPlayer from "@vimeo/player"
import YouTubePlayer from "youtube-player"
import { contain } from "intrinsic-scale"
import _compact from "lodash/compact"

export default {
    props: {
        src: {
            type: String,
            default: ""
        },
        playsinline: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        color: {
            type: String,
            default: "ffffff"
        },
        controls: {
            type: Boolean,
            default: true
        },
        muted: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            default: "css"
        },
        syncSlotWidth: {
            type: Boolean,
            default: false
        },
        customPlayer: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            player: null,
            hasLoaded: false,
            height: 720,
            width: 1280,
            styleHeight: "",
            styleWidth: "",
            title: ""
        }
    },
    computed: {
        classes() {
            return [
                "video-stage",
                `mode-${this.mode}`,
                { "has-loaded": this.hasLoaded },
                { "player-custom": this.isCustomPlayer },
                { "player-vimeo": this.isVimeo },
                { "player-youtube": this.isYouTube }
            ]
        },
        slotStyles() {
            if (this.syncSlotWidth && this.styleWidth) {
                return {
                    width: `${this.styleWidth}px`
                }
            }
        },
        iframeStyles() {
            if (this.styleHeight || this.styleWidth) {
                return {
                    height: `${this.styleHeight}px`,
                    width: `${this.styleWidth}px`
                }
            }
        },
        isIframe() {
            return String(this.src).includes("<iframe")
        },
        isVimeo() {
            return (
                String(this.src).includes("vimeo.com") && !this.isCustomPlayer
            )
        },
        isYouTube() {
            return (
                (String(this.src).includes("youtube.com") ||
                    String(this.src).includes("youtu.be")) &&
                !this.isCustomPlayer
            )
        },
        isCustomPlayer() {
            return this.customPlayer
        },
        youTubeId() {
            // Regex to find the YouTUbe ID from these:
            // https://www.youtube.com/watch?v=wSX9F6ETTDQ
            // https://youtu.be/wSX9F6ETTDQ
            var regex = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/
            const matches = this.src.match(regex)
            return matches[1] || ""
        },
        iFrameSrc() {
            let url = this.src

            switch (true) {
                case this.isCustomPlayer:
                    break

                case this.isVimeo:
                    const base = url.replace(
                        "https://vimeo.com/",
                        "https://player.vimeo.com/video/"
                    )
                    url = `${base.trim()}?
                    &byline=0
                    &portrait=0
                    &autoplay=${this.autoplay}
                    &playsinline=${this.playsinline}
                    &color=${this.color}
                    &controls=${this.controls}`
                    break

                case this.isYouTube:
                    url = `https://www.youtube.com/embed/${this.youTubeId}?
                    &autoplay=${Number(this.autoplay)}
                    &playsinline=${Number(this.playsinline)}
                    &color=${this.color}
                    &rel=0
                    &modestbranding=1
                    &controls=${Number(this.controls)}
                    &enablejsapi=1`
                    break

                case this.isIframe:
                    // TODO get src attribute from iframe, and return it here
                    break
            }

            return url
        }
    },
    mounted() {
        switch (true) {
            case this.isCustomPlayer:
                // Maybe handle resize and any events here?
                this.initCustomPlayer()
                break
            case this.isVimeo:
                this.initVimeoPlayer()
                break
            case this.isYouTube:
                this.initYouTubePlayer()
                break
        }

        window.addEventListener("resize", this.sizeVideo)
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.sizeVideo)
    },
    methods: {
        onPlay(data) {
            this.$emit("play", ...data)
        },
        onPause(data) {
            this.$emit("pause", ...data)
        },
        onEnded(data) {
            this.$emit("ended", ...data)
        },
        play() {
            this.player.play()
        },
        pause() {
            this.player.pause()
        },
        async initCustomPlayer() {
            await this.$nextTick()
            this.player = this.$refs.customPlayer.player
            this.sizeVideo()
        },
        async initYouTubePlayer() {
            // Fetch noEmbed data (regalur YouTube oEmebed not accessble to JS fetch because of CORS)
            let meta =
                (await fetch(`https://noembed.com/embed?url=${this.src}`)
                    .then((response) => response.json())
                    .then((data) => {
                        return data
                    })) || {}

            // Setup player API
            this.player = YouTubePlayer(this.$refs.iframe, {
                videoId: this.youTubeId,
                playerVars: {
                    autoplay: Number(this.autoplay),
                    playsinline: Number(this.playsinline),
                    color: this.color,
                    rel: 0,
                    modestbranding: 1
                }
            })

            // Set meta loaded classes
            this.player.on("ready", () => {
                this.width = meta.width
                this.height = meta.height
                this.title = meta.title

                // Size and loaded state
                this.sizeVideo()

                this.hasLoaded = true
                this.$emit("has-loaded")
            })

            // Register events
            this.player.on("stateChange", (event) => {
                switch (true) {
                    case event.data === 0:
                        this.onEnded
                        break

                    case event.data === 1:
                        this.onPlay
                        break

                    case event.data === 2:
                        this.onPause
                        break
                }
            })
        },
        async initVimeoPlayer() {
            // init player
            this.player = new VimeoPlayer(this.$refs.iframe, {
                muted: this.muted,
                playsinline: this.playsinline
            })

            // Get and set player size and title
            const meta = await Promise.all([
                this.player.getVideoWidth(),
                this.player.getVideoHeight(),
                this.player.getVideoTitle()
            ])
            this.width = meta[0]
            this.height = meta[1]
            this.title = meta[2]

            // Set events
            this.player.on("play", this.onPlay)
            this.player.on("pause", this.onPause)
            this.player.on("ended", this.onEnded)

            // Size, set events and loaded state
            await this.player.ready()
            this.sizeVideo()

            this.hasLoaded = true
            this.$emit("has-loaded")
        },
        async sizeVideo() {
            await this.$nextTick()

            // Abort if mode not "fit-to-parent"
            if (this.mode !== "fit-to-parent") {
                return false
            }

            let $stage = this.$refs.stage
            let heightOffset = 0

            // Abort if no stage
            if (!$stage) {
                return false
            }

            // Measure each slot height
            let slots = _compact([
                this.$refs.top || false,
                this.$refs.bottom || false
            ])

            heightOffset = slots.reduce((acc, slot) => {
                // Now we are in each slot
                const rect = slot.getBoundingClientRect()
                const height = rect.height || 0
                return acc + height
            }, 0)

            // Figure out "contain" height and set it on video
            let { width, height, x, y } = contain(
                $stage.offsetWidth,
                $stage.offsetHeight - heightOffset,
                this.width,
                this.height
            )

            // Set style heights
            this.styleHeight = height
            this.styleWidth = width

            // Emit dimensions event
            this.$emit("resized", {
                width: width,
                height: height
            })
        },
        onCustomPlayerLoaded(dimensions) {
            // Capture the videos dimensions, so we can size the player respecting slots
            this.width = dimensions.width
            this.height = dimensions.height
            this.sizeVideo()
            this.hasLoaded = true
        }
    }
}
</script>

<style lang="scss">
.video-stage {
    position: relative;

    > .iframe {
        opacity: 0;
        display: block;
        transition: opacity 0.4s var(--easing-authentic-motion);
    }
    .slot {
        overflow: hidden;
    }

    /* Loaded state */
    &.has-loaded > .iframe {
        opacity: 1;
    }

    /* Sizing modes */
    &.mode-css {
        > .iframe {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
