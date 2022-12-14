<template lang="html">
    <div
        :class="classes"
        :style="elStyle"
        @fullscreenchange="onFullscreenchange"
        @webkitfullscreenchange="onFullscreenchange"
        @keydown.space.prevent="togglePlay"
    >
        <div
            ref="player"
            class="player"
            :style="playerStyles"
        >
            <iframe
                ref="iframe"
                class="iframe"
                :src="iFrameSrc"
                :width="videoSize.width"
                :height="videoSize.height"
                frameborder="0"
                allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture;"
                allowfullscreen
                :playsinline="playsinline"
                :title="title"
                tabindex="-1"
            />

            <div
                class="target"
                @click="togglePlay"
            />

            <div class="controls">
                <button
                    class="button play"
                    @click="togglePlay"
                >
                    <svg-play class="svg svg-play" />
                    <svg-pause class="svg svg-pause" />
                </button>

                <div class="play-bar">
                    <div
                        ref="progress"
                        class="progress"
                        @mousedown="mouseDownHandler"
                        @touchstart="mouseDownHandler"
                    >
                        <div
                            class="loaded"
                            :style="loadedStyles"
                        />
                        <div
                            class="played"
                            :style="playedStyles"
                        />
                        <div
                            class="playhead"
                            :style="playheadStyles"
                        >
                            <svg-playhead class="svg svg-playhead" />
                        </div>
                    </div>
                </div>
                <div class="right">
                    <button
                        class="button volume"
                        @click="toggleVolume"
                    >
                        <svg-sound-on class="svg svg-sound-on" />
                        <svg-sound-off class="svg svg-sound-off" />
                    </button>
                    <button
                        class="button fullscreen"
                        @click="toggleFullscreen"
                    >
                        <svg-fullscreen class="svg svg-fullscreen" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Helpers
import VimeoPlayer from "@vimeo/player"
import { contain } from "intrinsic-scale"
import setCookie from "~/utils/setCookie"
import getCookie from "~/utils/getCookie"
import _get from "lodash/get"

// SVGs
import SvgPlay from "~/assets/svg/video-player/play"
import SvgPause from "~/assets/svg/video-player/pause"
import SvgSoundOn from "~/assets/svg/video-player/sound-on"
import SvgSoundOff from "~/assets/svg/video-player/sound-off"
import SvgFullscreen from "~/assets/svg/video-player/fullscreen"
import SvgPlayhead from "~/assets/svg/video-player/playhead"

export default {
    components: {
        SvgPlay,
        SvgPause,
        SvgSoundOn,
        SvgSoundOff,
        SvgFullscreen,
        SvgPlayhead
    },
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
        muted: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            default: "css"
        },
        dimensions: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            player: null,
            hasLoaded: false,
            title: "",
            hasControls: false,
            elSize: {
                width: 0,
                height: 0
            },
            playerSize: {
                height: 0,
                width: 0
            },
            videoSize: {
                height: 720,
                width: 1280,
                ratio: 1280 / 720
            },
            isPlaying: false,
            isFullscreen: false,
            isScrubbing: false,
            volume: Number(!this.muted),
            duration: 0,
            durationRect: {},
            loaded: {
                duration: 0,
                percent: 0,
                seconds: 0
            },
            played: {
                duration: 0,
                percent: 0,
                seconds: 0
            }
        }
    },
    computed: {
        classes() {
            return [
                "video-player",
                { "is-playing": this.isPlaying },
                { "is-muted": Boolean(this.volume) },
                { "has-loaded": this.hasLoaded },
                { "is-fullscreen": this.isFullscreen },
                { "is-scrubbing": this.isScrubbing },
                { "default-controls": this.hasControls },
                `mode-${this.mode}`
            ]
        },
        elStyle() {
            let output = [
                { "--color-video-player": `#${this.color}` },
                this.dimensions
            ]

            if (this.mode == "intrinsic-ratio") {
                output.push({
                    "--unit-height": `${
                        this.elSize.width / this.videoSize.ratio
                    }px`
                })
            }

            return output
        },
        playerStyles() {
            let output = {
                height: `${this.playerSize.height}px`,
                width: `${this.playerSize.width}px`
            }
            if (this.isFitToParent) {
                output = {}
            }
            return output
        },
        isFitToParent() {
            return this.mode == "fit-to-parent"
        },
        shouldAutoplay() {
            const referrer = _get(this, "$store.state.referrer", "")
            let output = this.autoplay

            // Don't try to autoplay on initial page load
            if (!referrer && this.autoplay) {
                output = false
            }

            // If muted, allow to auto play
            if (this.muted && this.autoplay) {
                output = true
            }

            return output
        },
        loadedStyles() {
            return [{ width: `${this.loaded.percent}%` }]
        },
        playedStyles() {
            return [{ width: `${this.played.percent}%` }]
        },
        playheadStyles() {
            return [{ left: `${this.played.percent}%` }]
        },
        isVimeo() {
            return String(this.src).includes("vimeo.com")
        },
        iFrameSrc() {
            let url = this.src.replace("http://", "https://")

            switch (true) {
                case this.isVimeo:
                    const base = url.replace(
                        "https://vimeo.com/",
                        "https://player.vimeo.com/video/"
                    )
                    url = `${base.trim()}?
                    &byline=0
                    &portrait=0
                    &autoplay=${this.shouldAutoplay}
                    &muted=${this.muted}
                    &playsinline=${this.playsinline}
                    &color=${this.color}
                    &controls=${this.hasControls}`
                    break
            }

            return url
        }
    },
    mounted() {
        switch (true) {
            case this.isVimeo:
                this.initVimeoPlayer()
                break
        }

        this.sizeVideo()
        window.addEventListener("performant-resize", this.sizeVideo)
        window.addEventListener("keydown", this.keydownHandler)
    },
    beforeDestroy() {
        window.removeEventListener("performant-resize", this.sizeVideo)
        window.removeEventListener("keydown", this.keydownHandler)

        document.removeEventListener("mousemove", this.mouseMoveHandler)
        document.removeEventListener("touchmove", this.mouseMoveHandler)
        document.removeEventListener("mouseup", this.mouseUpHandler)
    },
    methods: {
        async initVimeoPlayer() {
            // init player
            this.player = new VimeoPlayer(this.$refs.iframe, {
                muted: this.muted,
                playsinline: this.playsinline,
                autoplay: this.shouldAutoplay,
                color: this.color,
                controls: false,
                portrait: false,
                title: false,
                byline: false
            })

            // Setup events, delay a little on intial load to avoid Vimeo bug
            // SEE https://github.com/vimeo/player.js/issues/719
            if (this.shouldAutoplay) {
                this.initEvents()
            } else {
                setTimeout(() => {
                    this.initEvents()
                }, 500)
            }

            // Get the starting defaults
            const [volume, title, duration, width, height] = await Promise.all([
                this.player.getVolume(),
                this.player.getVideoTitle(),
                this.player.getDuration(),
                this.player.getVideoWidth(),
                this.player.getVideoHeight()
            ])
            this.volume = volume
            this.title = title
            this.duration = duration
            this.videoSize.width = width
            this.videoSize.height = height
            this.videoSize.ratio = width / height

            // Wait till player iFrame ready
            try {
                await this.player.ready()
            } catch (e) {
                // Fallback to a regular controled player
                this.hasControls = true
            }

            // Restore saved volume
            let savedVolume = 1
            const cookieJson = getCookie("videoPlayer")
            try {
                const cookieObject = JSON.parse(cookieJson)
                if (cookieObject.hasOwnProperty("volume")) {
                    savedVolume = cookieObject.volume
                }
            } catch (e) {
                // No cookie saved, so fail silently
            } finally {
                // Don't try to set volume if first page load
                if (this.$store.state.referrer) {
                    this.player.setVolume(savedVolume)
                } else if (this.shouldAutoplay) {
                    this.player.setVolume(0)
                }
            }

            // Ready!
            this.$emit("has-loaded", {
                width,
                height
            })
            this.sizeVideo()
            this.hasLoaded = true
        },
        initEvents() {
            this.player.on("play", this.onPlay)
            this.player.on("playing", this.onPlay)
            this.player.on("pause", this.onPause)
            this.player.on("ended", this.onEnded)
            this.player.on("timeupdate", this.onTimeupdate)
            this.player.on("progress", this.onProgress)
            this.player.on("volumechange", this.onVolumechange)
        },
        async sizeVideo() {
            await this.$nextTick()

            // Save our containing element size
            this.elSize = {
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight
            }

            // Calculation the "object-fit: contain" sizes
            let { width, height, x, y } = contain(
                this.$el.offsetWidth,
                this.$el.offsetHeight,
                this.videoSize.width,
                this.videoSize.height
            )

            // Size player to fit inside containing video player, keep ratio
            this.playerSize = {
                height,
                width
            }

            // Emit new player dimensions event
            this.$emit("resized", {
                width,
                height
            })
        },
        onPlay(data) {
            this.isPlaying = true
            this.$emit("play", data)
        },
        onPause(data) {
            this.isPlaying = false
            this.$emit("pause", data)
        },
        onEnded(data) {
            this.isPlaying = false
            this.$emit("ended", data)
        },
        onTimeupdate(data) {
            this.played = {
                ...data,
                percent: data.percent * 100
            }
        },
        onProgress(data) {
            this.loaded = {
                ...data,
                percent: data.percent * 100
            }
        },
        onVolumechange(data) {
            this.volume = data.volume
            const value = JSON.stringify({
                volume: data.volume || 0
            })
            setCookie("videoPlayer", value, 365)
        },
        onFullscreenchange(e) {
            if (
                document.fullscreenElement ||
                document.webkitFullscreenElement
            ) {
                this.isFullscreen = true
            } else {
                this.isFullscreen = false
            }
        },
        togglePlay() {
            if (this.isPlaying) {
                this.player.pause()
                this.isPlaying = false
            } else {
                this.player.play()
                this.isPlaying = true
            }
        },
        toggleVolume() {
            if (this.volume) {
                this.player.setVolume(0)
            } else {
                this.player.setVolume(1)
            }
        },
        toggleFullscreen() {
            // Lot of conditionals here to deal with poor browser support (mostly Safari)
            if (this.isFullscreen) {
                switch (true) {
                    case Boolean(document.exitFullscreen):
                        document.exitFullscreen()
                        break

                    case Boolean(document.webkitCancelFullScreen):
                        document.webkitCancelFullScreen()
                        break

                    default:
                        this.player.exitFullscreen()
                        break
                }
            } else {
                switch (true) {
                    case Boolean(this.$el.requestFullscreen):
                        this.$el.requestFullscreen()
                        break

                    case Boolean(this.$el.webkitRequestFullScreen):
                        this.$el.webkitRequestFullscreen()
                        break

                    default:
                        this.player.requestFullscreen()
                        break
                }

                // Hacky Resize after fullscreen (mostly for OSX Safari)
                this.sizeVideo()
                setTimeout(() => {
                    this.sizeVideo()
                }, 500)
            }
        },
        mouseDownHandler(e) {
            this.isScrubbing = true
            this.durationRect = this.$refs.progress.getBoundingClientRect()

            const clientX = e.clientX || e.touches[0].clientX

            // Capture starting point of scrubbing
            this.player.pause()
            this.setNewTime(
                clientX - this.durationRect.left,
                this.durationRect.width
            )

            // Watch for mouse move and up
            document.addEventListener("mousemove", this.mouseMoveHandler)
            document.addEventListener("mouseup", this.mouseUpHandler)

            // Also watch for Touch events
            document.addEventListener("touchmove", this.mouseMoveHandler)
            document.addEventListener("touchend", this.mouseUpHandler)
        },
        mouseMoveHandler(e) {
            this.isScrubbing = true
            const clientX = e.clientX || e.touches[0].clientX

            // As mouse moves, scrub the playbar
            this.setNewTime(
                clientX - this.durationRect.left,
                this.durationRect.width
            )
        },
        mouseUpHandler() {
            this.player.play()
            this.isScrubbing = false

            // Remove mouse events now
            document.removeEventListener("mousemove", this.mouseMoveHandler)
            document.removeEventListener("mouseup", this.mouseUpHandler)

            // Remove touch events
            document.removeEventListener("touchmove", this.mouseMoveHandler)
            document.removeEventListener("touchend", this.mouseUpHandler)
        },
        setNewTime(mouseX, durationPixels) {
            // Pixels per second
            const pixelPerSec = durationPixels / this.duration
            const newTime = mouseX / pixelPerSec

            // Set new time so UI is snappy
            this.played = {
                duration: this.played.duration,
                percent: (mouseX / durationPixels) * 100,
                seconds: mouseX / pixelPerSec
            }

            // Go to new time
            this.player.setCurrentTime(newTime)
        },
        keydownHandler(e) {
            switch (e.code) {
                case "Space":
                case "space":
                    e.preventDefault()
                    this.togglePlay()
                    break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
:where(.video-player) {
    --unit-height: 100%;

    position: relative;
    z-index: 0;
    font-size: 10px;
    line-height: normal;
    opacity: 0;
    transition: opacity 400ms ease-out;
    width: 100%;
    height: var(--unit-height, 100%);

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: center;
    align-items: center;

    .player {
        position: relative;
    }
    .iframe {
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 0;
        background-color: #000000;
    }
    .target {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 10;
    }

    // Generic
    .svg {
        display: block;

        path {
            fill: var(--color-video-player, #ffffff);
        }
    }
    .button {
        border: none;
        margin: 0;
        padding: 0;
        width: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
        font: inherit;
        line-height: normal;
        font-smoothing: inherit;
        appearance: none;

        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-content: center;
        align-items: center;

        &:focus {
            outline: 0;
        }
    }

    // Controls wrapper
    .controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: auto;
        z-index: 20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: opacity 125ms ease-out;
    }
    .right {
        display: flex;
        flex-direction: row;
    }

    // Play button
    .play {
        height: 100%;
        padding: 1em;
        min-width: 3.42em;
    }
    .svg-play {
        display: block;
    }
    .svg-pause {
        width: 10px;
        display: none;
    }

    // The progress
    .play-bar {
        flex: 1;

        // position: relative;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translate(0, -100%);
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    .progress {
        flex: 1;
        cursor: pointer;
        position: relative;
        // border: 0.1em solid var(--color-video-player, #ffffff);
        border-bottom: 0.1em solid var(--color-video-player, #ffffff);
        box-sizing: border-box;
        cursor: pointer;
        height: 2px;
    }
    .loaded {
        position: absolute;
        transition: width 175ms cubic-bezier(0.18, 0, 0.07, 1);
        background-color: var(--color-gray);
        height: 3px;
        width: 40%;
    }
    .played {
        background-color: var(--color-video-player, #ffffff);
        position: absolute;
        height: 3px;

        width: 20%;
    }
    .playhead {
        position: absolute;
        left: 0;
        top: 50%;
        height: 1.4em;
        padding: 1px;
        transform: translate(-50%, -50%);
    }

    // Volume toggle
    .volume {
        height: 100%;
        min-width: 3.4em;
        padding: 0.5em;
        margin-left: 0.5em;
    }
    .svg-sound-on {
        display: none;
    }
    .svg-sound-off {
        display: block;
    }

    // Fullscreen toggle
    .fullscreen {
        height: 100%;
        padding: 0.5em;
        margin-right: 0.5em;
    }

    // UI States
    &.has-loaded {
        opacity: 1;
    }
    &.is-playing {
        .svg-play {
            display: none;
        }
        .svg-pause {
            display: block;
        }
    }
    &.is-muted {
        .svg-sound-on {
            display: block;
        }
        .svg-sound-off {
            display: none;
        }
    }
    &.is-scrubbing {
        cursor: grabbing;

        .progress {
            cursor: grabbing;
        }
    }
    &.default-controls {
        .target,
        .controls {
            display: none;
        }
    }
    &.is-fullscreen,
    &:fullscreen {
        background-color: #000000;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }

    // Sizing modes
    &.mode-css {
        position: absolute;
    }
    &.mode-fit-to-parent {
        .player {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
    }

    // Hover states
    @media #{$has-hover} {
        &.is-playing {
            .controls {
                opacity: 0;
            }
        }
        &:hover {
            .controls {
                opacity: 1;
            }
        }
    }

    // Breakpoints
    @media #{$lt-phone} {
        .volume {
            display: none;
        }
        .fullscreen {
            margin-left: 0.5em;
        }
    }
}
</style>
