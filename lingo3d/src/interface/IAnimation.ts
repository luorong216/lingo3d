import AnimationManager from "../display/core/SimpleObjectManager/AnimationManager"
import IEventLoop from "./IEventLoop"

export type AnimationValue = Record<string, Array<number>>
export type Animation = string | boolean | AnimationValue

export default interface IAnimation extends IEventLoop {
    animations: Record<string, string | AnimationManager>
    animation?: Animation
}