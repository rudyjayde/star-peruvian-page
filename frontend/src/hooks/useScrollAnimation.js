import { useEffect, useRef } from 'react'

export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

export function useCounter(end, duration = 2000) {
  const ref = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true
            let start = 0
            const increment = end / (duration / 16)
            const timer = setInterval(() => {
              start += increment
              if (start >= end) {
                element.textContent = end.toLocaleString()
                clearInterval(timer)
              } else {
                element.textContent = Math.floor(start).toLocaleString()
              }
            }, 16)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [end, duration])

  return ref
}
