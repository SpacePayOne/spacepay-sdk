const MODAL_INNER_WIDTH = 768
const MODAL_INNER_HEIGHT = 600
const MODAL_BORDER_RADIUS = 24
const MODAL_OVERLAY_GRADIENT =
  'linear-gradient(to bottom, rgba(10, 10, 10, 0.8), rgba(11, 18, 32, 0.8), rgba(10, 10, 10, 0.8))'

export interface CreateModalIframeOptions {
  src: string
  title: string
  ariaLabel: string
  onBackdropClick?: () => void
}

export type ModalElement = HTMLDivElement

/**
 * Creates the shared modal DOM (backdrop + inner container + iframe).
 * Does not append to document.body. Automatically wires a backdrop click
 * handler that either calls the provided onBackdropClick or, by default,
 * removes the backdrop from the DOM when the user clicks outside the iframe.
 */
export function createModalIframe(
  options: CreateModalIframeOptions
): ModalElement {
  const { src, title, ariaLabel, onBackdropClick } = options

  const backdrop = document.createElement('div')
  backdrop.setAttribute('role', 'dialog')
  backdrop.setAttribute('aria-modal', 'true')
  backdrop.setAttribute('aria-label', ariaLabel)
  backdrop.style.position = 'fixed'
  backdrop.style.inset = '0'
  backdrop.style.background = MODAL_OVERLAY_GRADIENT
  backdrop.style.backdropFilter = 'blur(4px)'
  backdrop.style.display = 'flex'
  backdrop.style.alignItems = 'center'
  backdrop.style.justifyContent = 'center'
  backdrop.style.zIndex = '1000'
  backdrop.style.padding = '24px'
  backdrop.style.boxSizing = 'border-box'

  const inner = document.createElement('div')
  inner.style.width = `${MODAL_INNER_WIDTH}px`
  inner.style.height = `${MODAL_INNER_HEIGHT}px`
  inner.style.borderRadius = `${MODAL_BORDER_RADIUS}px`
  inner.style.overflow = 'hidden'
  inner.style.position = 'relative'
  inner.style.background = 'transparent'

  const iframe = document.createElement('iframe')
  iframe.src = src
  iframe.title = title
  iframe.style.position = 'absolute'
  iframe.style.top = '0'
  iframe.style.left = '0'
  iframe.style.width = '100%'
  iframe.style.height = '100%'
  iframe.style.border = 'none'
  iframe.style.background = 'transparent'

  inner.appendChild(iframe)
  backdrop.appendChild(inner)

  backdrop.addEventListener('click', (event) => {
    if (event.target !== backdrop) return
    if (onBackdropClick) {
      onBackdropClick()
      return
    }
    if (backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop)
    }
  })

  return backdrop
}

export function removeModal(element: ModalElement | null): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element)
  }
}

export function appendModal(element: ModalElement): void {
  document.body.appendChild(element)
}

export function hideModal(element: ModalElement): void {
  element.hidden = true
  element.style.display = 'none'
}

export function showModal(element: ModalElement): void {
  element.hidden = false
  element.style.display = 'flex'
}
