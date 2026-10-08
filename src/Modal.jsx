import { useEffect, useRef } from 'react'

// A native <dialog> controlled by the `open` prop. onClose fires on Esc or close().
export default function Modal({ open, onClose, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dlg = ref.current
    if (open && !dlg.open) dlg.showModal()
    if (!open && dlg.open) dlg.close()
  }, [open])

  return (
    <dialog ref={ref} onClose={onClose}>
      {open ? children : null}
    </dialog>
  )
}
