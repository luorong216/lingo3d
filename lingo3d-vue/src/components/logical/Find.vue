<script setup lang="ts">
import FoundManager from "lingo3d/lib/display/core/FoundManager"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { foundDefaults } from "lingo3d/lib/interface/IFound"
import { inject, ref, watchEffect, computed, Ref, provide, toRaw } from "vue"
import useDiffProps from "../../hooks/useDiffProps"
import { applyChanges } from "../../hooks/useManager"
import foundProps from "../../props/foundProps"

const props = defineProps({ ...foundProps, onLoad: Function })

const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)
const managerRef = ref<FoundManager>()
provide("parent", managerRef)

watchEffect(onCleanUp => {
    const { name } = props
    const parent = toRaw(parentRef?.value)
    if (!parent || !name) return
    
    if ("loadedResolvable" in parent){
        //@ts-ignore
        const handle = parent.loadedResolvable.then(() => managerRef.value = parent.find(name))
        return onCleanUp(() => {
            handle.cancel()
        })
    }
    managerRef.value = parent.find(name)
})

const paused = computed(() => !managerRef.value)
const diff = useDiffProps(props, foundDefaults, paused)
applyChanges(managerRef, undefined, diff, foundDefaults)

defineExpose(managerRef)

watchEffect(() => {
    managerRef.value && props.onLoad?.()
})

</script>

<template>
    <slot />
</template>