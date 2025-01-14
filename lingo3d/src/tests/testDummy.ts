
import { ThirdPersonCamera, Dummy, Reflector, keyboard } from ".."
import { setGridHelper } from "../states/useGridHelper"
//@ts-ignore
import roughnessSrc from "../../assets-local/roughness.png"
//@ts-ignore
import normalSrc from "../../assets-local/normal.jpg"
import createProxy from "../api/createProxy"
//@ts-ignore
// import cbpunkSrc from "../../assets-local/cbpunk.glb"

export default {}

setGridHelper(true)

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
reflector.roughnessMap = roughnessSrc
reflector.normalMap = normalSrc
reflector.roughness = 5

const dummy = new Dummy()
dummy.y = 50
dummy.preset = "rifle"
dummy.physics = "character"
dummy.strideMove = true

const cam = new ThirdPersonCamera()
cam.append(dummy)
cam.activate()
cam.mouseControl = true

const dummyProxy = createProxy<Dummy>()
dummy.proxy = dummyProxy

// const map = new Model()
// map.scale = 200
// map.src = cbpunkSrc
// map.y = 8900
// map.z = 1000
// map.physics = "map"

keyboard.onKeyPress = (_, pressed) => {
    if (pressed.has("w"))
        dummyProxy.strideForward = -5
    else if (pressed.has("s"))
        dummyProxy.strideForward = 5
    else
        dummyProxy.strideForward = 0

    if (pressed.has("a"))
        dummyProxy.strideRight = 5
    else if (pressed.has("d"))
        dummyProxy.strideRight = -5
    else
        dummyProxy.strideRight = 0

    if (pressed.has("Space"))
        dummyProxy.jump(10)
}