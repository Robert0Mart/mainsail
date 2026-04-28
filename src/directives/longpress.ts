import Vue, { VNode, VNodeDirective } from 'vue'

Vue.directive('longpress', {
    bind: function (el: HTMLElement, binding: VNodeDirective, vNode: VNode) {
        if (typeof binding.value !== 'function') {
            const compName = vNode.context?.$options.name
            let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
            if (compName) warn += ` Found in component '${compName}' `
            console.warn(warn)
        }

        const debounceTime = Number(binding.arg ?? 1000)
        let pressTimer: number | null = null

        const handler = (e: Partial<Touch> & { preventDefault: TouchEvent['preventDefault'] }) => {
            binding.value(e)
        }

        const start = (e: TouchEvent) => {
            if (e.type === 'click' || (!e.touches || e.touches.length < 1)) return

            document.querySelector('body')?.setAttribute('style', 'user-select: none; -webkit-user-select: none; -moz-user-select: none;')

            setTimeout(() => {
                document.querySelector('body')?.setAttribute('style', '')
            }, debounceTime + 200)

            if (pressTimer === null) {
                pressTimer = window.setTimeout(() => {
                    e.preventDefault();
                    e.stopPropagation();
                    (e as Event).stopImmediatePropagation();
                    (e as any).cancelBubble = true;

                    handler({
                        clientX: e.touches[0].clientX,
                        clientY: e.touches[0].clientY,
                        force: e.touches[0].force,
                        identifier: e.touches[0].identifier,
                        pageX: e.touches[0].pageX,
                        pageY: e.touches[0].pageY,
                        radiusX: e.touches[0].radiusX,
                        radiusY: e.touches[0].radiusY,
                        rotationAngle: e.touches[0].rotationAngle,
                        screenX: e.touches[0].screenX,
                        screenY: e.touches[0].screenY,
                        preventDefault: () => e.preventDefault(),
                    })
                }, debounceTime)
            }
            return false
        }

        const cancel = () => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer)
                pressTimer = null
            }
        }

        el.addEventListener('touchstart', start as EventListener)
        el.addEventListener('touchmove', cancel as EventListener)
        el.addEventListener('touchend', cancel as EventListener)
        el.addEventListener('touchcancel', cancel as EventListener)
        document.addEventListener('scroll', cancel, { passive: true })
    },
})