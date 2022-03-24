import React, { useLayoutEffect, useRef } from "react"
import { container, outline, settings } from "lingo3d"
import index from "lingo3d"
import { preventTreeShake } from "@lincode/utils"
import { SetupNode } from "lingo3d/lib/display/utils/deserialize/types"
import Setup from "./logical/Setup"
import { useMemoOnce } from "@lincode/hooks"
import scene from "lingo3d/lib/engine/scene"
import { getAreaLight, setAreaLight } from "lingo3d/lib/states/useAreaLight"
import { getAreaLightInitialized, setAreaLightInitialized } from "lingo3d/lib/states/useAreaLightInitialized"
import { hook } from "@lincode/react-global-state"

const useAreaLight = hook(setAreaLight, getAreaLight)
const useAreaLightInitialized = hook(setAreaLightInitialized, getAreaLightInitialized)

preventTreeShake(index)
outline.style.display = "none"

type WorldProps = Partial<SetupNode> & {
    style?: React.CSSProperties
    className?: string
    position?: "absolute" | "relative" | "fixed"
}

const World: React.FC<WorldProps> = ({ style, className, position, children, ...rest }) => {
    const divRef = useRef<HTMLDivElement>(null)

    useMemoOnce(() => {
        for (const child of [...scene.children])
            child.userData.manager && scene.remove(child)
    })

    useLayoutEffect(() => {
        const el = divRef.current
        if (!el) return

        el.appendChild(container)

        const cb = () => {
            settings.containerWidth = settings.width = el.clientWidth
            settings.containerHeight = settings.height = el.clientHeight
        }
        cb()
        window.addEventListener("resize", cb)

        return () => {
            window.removeEventListener("resize", cb)
        }
    }, [])

    const [areaLight] = useAreaLight()
    const [areaLightInitialized] = useAreaLightInitialized()

    return (<>
        <Setup {...rest} />
        <div ref={divRef} style={{
            width: "100%", height: "100%", position: position ?? "absolute", top: 0, left: 0, ...style
        }}>
            {(!areaLight || areaLightInitialized) && children}
        </div>
    </>)
}

export default World