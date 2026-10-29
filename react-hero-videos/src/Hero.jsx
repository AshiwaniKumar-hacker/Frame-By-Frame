import { useEffect, useRef, useState } from 'react'
import './Hero.css'

function Hero() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  const [videoSrc, setVideoSrc] = useState(null)
  const [duration, setDuration] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // 👇 user-tunable: how many frames the scroll is split into
  const [frames, setFrames] = useState(120)

  const hasInteracted = useRef(false)
  const SCROLL_MULTIPLIER = 90

  // ---- When a new video file is picked ----
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setIsReady(false)
    setDuration(0)
  }

  // ---- Read duration when video metadata is loaded ----
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    const handleLoaded = () => {
      setDuration(video.duration || 0)
      setIsReady(true)
      video.pause()
      video.currentTime = 0
      if (audioRef.current) audioRef.current.currentTime = 0
    }

    if (video.readyState >= 1) {
      handleLoaded()
    } else {
      video.addEventListener('loadedmetadata', handleLoaded)
    }
    return () => video.removeEventListener('loadedmetadata', handleLoaded)
  }, [videoSrc])

  useEffect(() => {
  if (!isReady || !duration) return

  const section = sectionRef.current
  const video = videoRef.current
  const audio = audioRef.current
  if (!section || !video || !audio) return

  let ticking = false
  let targetTime = 0
  let currentTime = 0

  const applyScroll = () => {
    const rect = section.getBoundingClientRect()
    const sectionHeight = section.offsetHeight
    const viewportHeight = window.innerHeight

    const scrolled = -rect.top
    const maxScroll = sectionHeight - viewportHeight
    let progress = scrolled / maxScroll
    progress = Math.max(0, Math.min(1, progress))

    const reversed = 1 - progress
    targetTime = reversed * duration
  }

  // Smooth lerp loop — video "eases" toward target instead of jumping
  let rafId
  const loop = () => {
    // Lerp factor: 0.15 = smooth but responsive. 0.25 = snappier. 0.08 = floaty.
    currentTime += (targetTime - currentTime) * 0.15

    // Only seek if we actually moved (avoids redundant seeks)
    if (Math.abs(video.currentTime - currentTime) > 0.01) {
      video.currentTime = currentTime
    }
    if (Math.abs(audio.currentTime - currentTime) > 0.05) {
      audio.currentTime = currentTime
    }

    rafId = requestAnimationFrame(loop)
  }

  const onScroll = () => {
    if (!hasInteracted.current) {
      hasInteracted.current = true
      audio.play().catch(() => {})
    }
    if (!ticking) {
      ticking = true
      requestAnimationFrame(() => {
        applyScroll()
        ticking = false
      })
    }
  }

  // Initialize target so first frame is correct
  applyScroll()
  currentTime = targetTime
  video.currentTime = currentTime
  rafId = requestAnimationFrame(loop)

  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(rafId)
  }
}, [isReady, duration])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
    if (!hasInteracted.current) {
      hasInteracted.current = true
      audio.play().catch(() => {})
    }
  }

  // ---- Upload screen (before any video is chosen) ----
  if (!videoSrc) {
    return (
      <section className="hero-scroll-section" style={{ height: '100vh' }}>
        <div className="hero sticky upload-screen">
          <h1>Choose your video</h1>
          <p>Pick a video file (mp4 / webm) from your computer.</p>
          <input type="file" accept="video/*" onChange={handleFile} />
        </div>
      </section>
    )
  }

  // ---- Normal hero with controls ----
  return (
    <section
      ref={sectionRef}
      className="hero-scroll-section"
      style={{ height: `${SCROLL_MULTIPLIER * 100}vh` }}
    >
      <div className="hero sticky">
        <video
          ref={videoRef}
          className="hero-video"
          src={videoSrc}
          muted
          playsInline
          preload="auto"
        />

        <audio ref={audioRef} src={videoSrc} preload="auto" />

        {/* Mute button */}
        <button className="mute-btn" onClick={toggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </button>

        {/* Frames-per-scroll control */}
        <div className="frames-control">
          <label>
            Frames: <strong>{frames}</strong>
          </label>
          <input
  type="range"
  min="10"
  max="600"
  step="10"
  value={frames}
  onChange={(e) => setFrames(Number(e.target.value))}
  style={{ '--fill': `${((frames - 10) / (600 - 10)) * 100}%` }}
/>
          <small>
            Higher = smoother scrub. Lower = steppy/choppy frames.
          </small>
        </div>

        {/* Change video */}
        <label className="change-video">
          Change video
          <input type="file" accept="video/*" onChange={handleFile} hidden />
        </label>
      </div>
    </section>
  )
}

export default Hero