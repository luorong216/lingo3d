import { Cancellable } from "@lincode/promiselikes"
import { createEffect, GetGlobalState } from "@lincode/reactivity"
import { loop, timer } from "../../engine/eventLoop"
import IEventLoop from "../../interface/IEventLoop"
import Appendable from "./Appendable"

export default abstract class EventLoopItem extends Appendable implements IEventLoop {
    private _proxy?: EventLoopItem
    public get proxy() {
        return this._proxy
    }
    public set proxy(val) {
        if (this._proxy === val) return
        //@ts-ignore
        this._proxy && (this._proxy.__target = undefined)
        this._proxy = val
        //@ts-ignore
        val && (val.__target = this)
    }

    public timer(time: number, repeat: number, cb: () => void) : Cancellable {
        return this.watch(timer(time, repeat, cb))
    }

    public loop(cb: () => void) {
        return this.watch(loop(cb))
    }

    public queueMicrotask(cb: () => void) {
        queueMicrotask(() => !this.done && cb())
    }

    protected cancellable(cb?: () => void) {
        return this.watch(new Cancellable(cb))
    }

    protected createEffect(cb: () => (() => void) | void, getStates: Array<GetGlobalState<any> | any>) {
        return this.watch(createEffect(cb, getStates))
    }

    private _loopHandle?: Cancellable
    private _onLoop?: () => void
    public get onLoop(): (() => void) | undefined {
        return this._onLoop
    }
    public set onLoop(cb: (() => void) | undefined) {
        this._onLoop = cb
        this._loopHandle?.cancel()
        cb && (this._loopHandle = this.loop(cb))
    }
}