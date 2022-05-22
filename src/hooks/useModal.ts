import { RefObject, useEffect, useRef } from 'react'

const getDOMRef = (
  value: string | RefObject<HTMLElement> | HTMLElement
): HTMLElement | null => {
  if (typeof value == 'string') {
    return document.querySelector(value)
  } else if (typeof value == 'object') {
    if (value instanceof HTMLElement) return value
    if (value.current) return value.current
  }
  return null
}
interface UseModalProps {
  focusFirst?: string | RefObject<HTMLElement> | HTMLElement
  focusAfterClosed?: string | RefObject<HTMLElement> | HTMLElement
  autoFocus?: boolean
  onClose: () => void
  overlayModal?: boolean
}

const useModal = <RefType extends HTMLElement>({
  focusFirst,
  onClose,
  focusAfterClosed,
  autoFocus,
  overlayModal = true,
}: UseModalProps) => {
  let modalRoot = document.getElementById('modal-root')
  if (!modalRoot) {
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(modalRoot)
  }

  const ref = useRef<RefType | null>(null)

  let _focusFirst = focusFirst ? getDOMRef(focusFirst) : null
  let _focusAfterClosed = focusAfterClosed ? getDOMRef(focusAfterClosed) : null

  /**
   * click = mousedown + mouseup, focus fires on successful mousedown(verify this)
   * set this true to prevent `focus` is getting fired on mousedown
   */
  let avoidFocusOnMouseDown = false
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      avoidFocusOnMouseDown = true

      // handle outside clicks
      if (!ref.current) {
        return
      }
      if (!ref.current.contains(e.target as HTMLElement)) {
        onClose()
        if (_focusAfterClosed) _focusAfterClosed.focus()
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      //  handle `Escape` keypress
      if (e.key === 'Escape') {
        onClose()
        if (_focusAfterClosed) _focusAfterClosed.focus()
      }
    }
    function handleMouseUp(e: MouseEvent) {
      // reset variable setup during `mousedown`
      avoidFocusOnMouseDown = false
    }
    document.body.addEventListener('keyup', handleKeyUp)
    document.body.addEventListener('mousedown', handleMouseDown)
    document.body.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.body.removeEventListener('mousedown', handleMouseDown)
      document.body.removeEventListener('keyup', handleKeyUp)
      document.body.addEventListener('mouseup', handleMouseUp)
    }
  }, [onClose, _focusAfterClosed])

  useEffect(() => {
    const isFocusable = (element: HTMLElement): element is HTMLElement => {
      return typeof element.focus === 'function'
    }

    /**
     * When `attempFocus` moves focus around, set this true so the focus listener can ignore the events.
     */
    let ignoreUntilFocusChanges = false
    const attempFocus = (element: HTMLElement) => {
      /**
       * Manually focus the given element using `HTMLElement.focus` method while avoiding invoking `focus` listeners again.
       */
      if (!isFocusable(element)) {
        return false
      }
      ignoreUntilFocusChanges = true

      try {
        element.focus()
      } catch (e) {
        console.error(e)
      }
      ignoreUntilFocusChanges = false
      return document.activeElement === element
    }
    const focusFirstDescendant = (element: HTMLElement) => {
      /**
       * Iterate over an element's children recursively and focus the first `focusable` element and
       * return true if focused otherwise false.
       */
      for (var i = 0; i < element.childNodes.length; i++) {
        var child = element.childNodes[i]

        if (
          attempFocus(child as HTMLElement) ||
          focusFirstDescendant(child as HTMLElement)
        ) {
          return true
        }
      }
      return false
    }
    const focusLastDescendant = (element: HTMLElement) => {
      /**
       * Iterate over an element's children recursively and focus the last `focusable` element and
       * return true if focused otherwise false.
       */
      for (var i = element.childNodes.length - 1; i >= 0; i--) {
        var child = element.childNodes[i]
        if (
          attempFocus(child as HTMLElement) ||
          focusLastDescendant(child as HTMLElement)
        ) {
          return true
        }
      }
      return false
    }

    if (_focusFirst) _focusFirst.focus()
    else {
      if (autoFocus && ref.current) {
        focusFirstDescendant(ref.current)
      }
    }

    let lastFocus: any
    const trapFocus = (e: FocusEvent) => {
      if (avoidFocusOnMouseDown) return
      if (ignoreUntilFocusChanges) {
        return
      }

      if (!ref.current) {
        console.error('dialog not found')
        return
      }
      if (ref.current.contains(e.target as HTMLElement)) {
        lastFocus = e.target
      } else {
        focusFirstDescendant(ref.current)

        /**
         * EdgeCase: user clicks Shift + Tab when activeElement is first focusable descendant inside dialog,
         * `focusFirstDescendant` will focus again first focusable element and cycle goes on as user repeats Shift+ Tab
         * To avoid that, if `lastFocused` is current `activeElement`, we will try focusing last focusable descendants
         */
        if (lastFocus === document.activeElement) {
          focusLastDescendant(ref.current)
        }

        lastFocus = document.activeElement
      }
    }

    if (overlayModal) {
      document.body.classList.add('has-dialog')
    }
    // see example: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#bubbling_and_capturing_explained
    // run registered listener during `capture` but not `bubble` phase
    document.addEventListener('focus', trapFocus, true)

    return () => {
      if (overlayModal) {
        document.body.classList.remove('has-dialog')
      }
      document.removeEventListener('focus', trapFocus, true)

      if (_focusAfterClosed) {
        _focusAfterClosed.focus()
      }
    }
  }, [_focusFirst, _focusAfterClosed, autoFocus, overlayModal])

  return { ref, modalRoot }
}

export default useModal
