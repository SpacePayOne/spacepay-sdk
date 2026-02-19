/**
 * Single global message handler for embedded checkout/button iframes.
 * Only one handler is attached to window at a time; registering a new one
 * replaces the previous, so repeated init+mount without unmount never leaks listeners.
 */
let activeHandler: ((event: MessageEvent) => void) | null = null

export function setEmbedMessageHandler(
  handler: (event: MessageEvent) => void
): void {
  if (activeHandler) {
    window.removeEventListener('message', activeHandler)
    activeHandler = null
  }
  activeHandler = handler
  window.addEventListener('message', handler)
}

export function clearEmbedMessageHandler(
  handler: ((event: MessageEvent) => void) | null
): void {
  if (handler && activeHandler === handler) {
    window.removeEventListener('message', handler)
    activeHandler = null
  }
}
