import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { Object3D } from "three"
import PositionedItem from "../../api/core/PositionedItem"
import { mouseEvents } from "../../api/mouse"
import Model from "../../display/Model"
import { onSelectionTarget } from "../../events/onSelectionTarget"
import { setSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import { setSceneGraphTarget } from "../../states/useSceneGraphTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"

preventTreeShake(h)

const traverseUp = (obj: Object3D, expandedSet: Set<Object3D>) => {
    expandedSet.add(obj)
    const nextParent = obj.userData.manager?.parent?.outerObject3d ?? obj.parent
    nextParent && traverseUp(nextParent, expandedSet)
}

const search = (n: string) => {
    const model = getSelectionTarget()
    if (!(model instanceof Model)) return
    
    const name = n.toLowerCase()
    let found: Object3D | undefined
    //@ts-ignore
    model.loadedGroup.traverse(item => {
        if (found) return
        item.name.toLowerCase().includes(name) && (found = item)
    })
    if (!found) return
    
    const expandedSet = new Set<Object3D>()
    traverseUp(found, expandedSet)
    setSceneGraphExpanded(expandedSet)
    setSceneGraphTarget(found)
}

const ContextMenu = () => {
    const [data, setData] = useState<{ x: number, y: number, target: PositionedItem } | undefined>(undefined)
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        let [clientX, clientY] = [0, 0]
        const cb = (e: MouseEvent) => [clientX, clientY] = [e.clientX, e.clientY]
        document.addEventListener("mousemove", cb)

        const handle0 = mouseEvents.on("down", () => setData(undefined))

        const handle = onSelectionTarget(({ target, rightClick }) => {
            rightClick && target && setData({ x: clientX, y: clientY, target })
        })
        return () => {
            handle0.cancel()
            handle.cancel()
            document.removeEventListener("mousemove", cb)
        }
    }, [])

    if (!data) return null

    return (
        <div className="lingo3d-ui" style={{
            zIndex: 9999,
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "hidden"
        }}>
            <div style={{
                position: "absolute",
                left: data.x,
                top: data.y,
                background: "rgb(40, 41, 46)",
                padding: 6,
                pointerEvents: "auto"
            }}>
                {showSearch ? (
                    <input
                    ref={el => el?.focus()}
                    style={{ all: "unset", padding: 6 }}
                    onKeyDown={e => {
                        e.stopPropagation()
                        if (e.key !== "Enter" && e.key !== "Escape") return
                        e.key === "Enter" && search((e.target as HTMLInputElement).value)
                        setShowSearch(false)
                        setData(undefined)
                    }}
                    />
                ) : (
                    <div style={{ padding: 6, whiteSpace: "nowrap" }} onClick={() => setShowSearch(true)}>
                        Search children
                    </div>
                )}
            </div>
        </div>
    )
}

export default ContextMenu