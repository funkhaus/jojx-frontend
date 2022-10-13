<template>
    <section class="page-info">
        <contact-region
            :address="infoData.address"
            :phone="infoData.phone"
            :image="infoData.image"
            :email="infoData.email"
            :map-url="infoData.mapUrl"
            :social-links="infoData.socialLinks"
            :title="infoData.title"
        />
        <contact-team :items="teamReps" />
        <contact-reps :regions="regions" />
    </section>
</template>

<script>
// Queries
import INFO from "~/gql/queries/Info"

export default {
    async asyncData({ $graphql, route }) {
        const data = await $graphql.default.request(INFO, {
            uri: route.path
        })
        return {
            page: data?.nodeByUri || {}
        }
    },
    computed: {
        infoData() {
            return {
                ...this.page,
                image: this?.page?.featuredImage?.node || {},
                address: this?.page?.contactMeta?.address || "",
                phone: this?.page?.contactMeta?.telephone || "",
                email: this?.page?.contactMeta?.email || "",
                mapUrl: this?.page?.contactMeta?.addressLink || "",
                socialLinks: this?.page?.contactMeta?.socials || [],
                title: this?.page?.encodedContent || ""
            }
        },
        teamReps() {
            const team = this.page?.contactMeta?.team || []
            return team.map((obj) => {
                return {
                    ...obj,
                    email: obj.email || "",
                    name: obj.name || "",
                    position: obj.position || ""
                }
            })
        },
        regions() {
            const regions = this.page?.contactMeta?.representation || []
            return regions.map((obj) => {
                return {
                    ...obj,
                    location: obj.location || "",
                    company: obj.company || "",
                    reps: obj.rep || {}
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-info {
    display: flex;
    flex-direction: column;
    justify-self: center;
}
</style>
