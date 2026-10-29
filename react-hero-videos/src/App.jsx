import Hero from './Hero'
import './App.css'

function App() {
  const year = new Date().getFullYear()

  return (
    <div className="app">
      <Hero />

      {/* ---- Section 1: What this is ---- */}
      <section className="content">
        <h2>Turn any video into a scroll-driven experience</h2>
        <p>
          Load your own video, pick how many frames you want, and let the
          scrollbar become the timeline. No video editor, no timeline keyframes,
          no exports — just drop a file and scroll.
        </p>

        <h3>What you get out of the box</h3>
        <ul>
          <li>
            <strong>Your video, scrubbed by scroll</strong> — scrolling up
            rewinds, scrolling down fast-forwards, and stopping holds the frame.
          </li>
          <li>
            <strong>Adjustable frame density</strong> — decide how many discrete
            positions the timeline is split into. Coarse = punchy, fine =
            buttery smooth.
          </li>
          <li>
            <strong>Built-in audio control</strong> — the video's own soundtrack
            plays alongside the scrub. Mute or unmute any time.
          </li>
          <li>
            <strong>Swap videos instantly</strong> — the "Change video" button
            replaces the source without a page reload.
          </li>
        </ul>

        <p>
          Everything runs locally in the browser. Nothing is uploaded to a
          server, nothing is re-encoded, and no account is required.
        </p>
      </section>

      {/* ---- Section 2: How to use ---- */}
      <section className="content dark">
        <h2>Three steps to a scroll-video hero</h2>
        <p>
          <strong>1. Pick a video.</strong> Click the file input on the hero
          screen and choose any local <code>.mp4</code> or <code>.webm</code>{' '}
          file. It loads as a blob URL — instant, no upload.
        </p>
        <p>
          <strong>2. Set your frames.</strong> Use the "Frames" slider in the
          bottom-left corner. This decides how many distinct positions the
          video timeline is sliced into. Higher = smoother scrub, lower =
          punchier stepped playback.
        </p>
        <p>
          <strong>3. Scroll.</strong> Move the page up and down. The video
          timeline follows your scroll position. The mute button in the corner
          controls audio.
        </p>
        <p>
          Questions? Reach out at{' '}
          <a href="mailto:hello@fintechx.com">hello@fintechx.com</a> — a real
          human replies within one business day.
        </p>
      </section>

      {/* ---- Section 3: FAQ ---- */}
      <section className="content faq" id="faq">
        <h2>Frequently asked questions</h2>

        <details>
          <summary>What exactly is a "frame" in this context?</summary>
          <p>
            A <strong>frame</strong> is one discrete position in the video's
            timeline. When you set the frames slider to, say, <code>120</code>,
            the player divides the entire video duration into 120 equal
            positions. As you scroll, the progress value (0&nbsp;→&nbsp;1) is
            snapped to the nearest of those 120 positions, and the video is
            seeked to that exact timestamp.
          </p>
          <p>
            A low frame count (e.g. <code>20</code>) means each scroll step
            jumps a long way through the video — it feels like flipping through a
            flipbook. A high frame count (e.g. <code>300</code>) means each
            scroll step moves only a tiny amount, so the scrub feels continuous
            and buttery.
          </p>
        </details>

        <details>
          <summary>How do I add my own video?</summary>
          <p>
            Two ways — both are local, nothing is uploaded anywhere:
          </p>
          <ol>
            <li>
              <strong>First load:</strong> the hero screen shows a file input.
              Click it, browse to your video (e.g. in{' '}
              <code>Downloads</code>), select it, done.
            </li>
            <li>
              <strong>Already playing a video:</strong> click the{' '}
              <strong>"Change video"</strong> button in the bottom-right corner
              of the hero to swap it out.
            </li>
          </ol>
          <p>
            Accepted formats are anything the browser can decode — typically{' '}
            <code>.mp4</code> (H.264) and <code>.webm</code>. The file is
            loaded via <code>URL.createObjectURL()</code>, so even large files
            open instantly.
          </p>
        </details>

        <details>
          <summary>Why does my scrub look choppy, even at high frames?</summary>
          <p>
            Video scrubbing is limited by <strong>keyframes</strong>, not by our
            JS. Browsers can only seek instantly to keyframes; every
            in-between frame forces the decoder to decode forward from the
            nearest keyframe. If your video has a keyframe only every 2–5
            seconds, fine-grained scrubbing will look steppy no matter what the
            frames slider says.
          </p>
          <p>
            Fix: re-encode your video with a dense keyframe interval. With
            ffmpeg:
          </p>
          <pre><code>ffmpeg -i input.mp4 -g 5 -keyint_min 5 -sc_threshold 0 -c:v libx264 -crf 23 -movflags +faststart output.mp4</code></pre>
          <p>
            <code>-g 5</code> means a keyframe every 5th frame — good balance
            between file size and smooth seeking. Use <code>-g 1</code> for
            every frame as a keyframe (perfectly smooth but much bigger file).
          </p>
        </details>

        <details>
          <summary>Does scrolling up rewind the video?</summary>
          <p>
            Yes. The scrub is <strong>reversed</strong> by default: at the very
            top of the section the video is at the <em>end</em> of its timeline,
            and as you scroll down it plays backward toward frame 0. If you'd
            rather scroll-down = play-forward, remove the{' '}
            <code>reversedProgress = 1 - progress</code> line in{' '}
            <code>Hero.jsx</code> and use <code>progress</code> directly.
          </p>
        </details>

        <details>
          <summary>How do I change how long the section is?</summary>
          <p>
            In <code>Hero.jsx</code> there's a constant:
          </p>
          <pre><code>{`const SCROLL_MULTIPLIER = 90`}</code></pre>
          <p>
            The hero section height is <code>SCROLL_MULTIPLIER * 100vh</code>.
            So <code>90</code> makes the section 9000&nbsp;vh tall — very long,
            giving you lots of scroll room for a slow scrub. Lower it (e.g.{' '}
            <code>30</code>) to make the whole scrub happen in a shorter
            distance.
          </p>
        </details>

        <details>
          <summary>Is my video uploaded to a server?</summary>
          <p>
            No. Everything happens client-side. The file is read from disk with{' '}
            <code>URL.createObjectURL()</code> and stored in memory as a blob
            URL for the current session. Close the tab and it's gone. If you
            later want to share a build with a pre-loaded video, put the file in{' '}
            <code>src/</code> and import it like the original{' '}
            <code>barsaat.mp4</code>.
          </p>
        </details>

        <details>
          <summary>Does the audio play?</summary>
          <p>
            Yes — a hidden <code>&lt;audio&gt;</code> element is kept in sync
            with the video's timeline, so the original soundtrack plays while
            you scrub. Browsers block autoplay until the user interacts, so
            audio starts on your first scroll (or when you click the mute
            button). Use the 🔊 / 🔇 button in the corner to toggle.
          </p>
        </details>

        <details>
          <summary>What's the maximum video size I can use?</summary>
          <p>
            There is <strong>no hard limit in the code</strong> — the video is
            loaded with <code>URL.createObjectURL()</code> straight from your
            disk, so the file never touches a server. However, the browser has
            to hold the whole file in memory while it plays, so practical
            limits come from the browser and your device's RAM:
          </p>
          <ul>
            <li>
              <strong>Chrome</strong> — around <strong>2 GB</strong> before
              crashes become likely.
            </li>
            <li>
              <strong>Firefox</strong> — reports range from{' '}
              <strong>512 MB</strong> to <strong>8 GB</strong> depending on
              version and available memory.
            </li>
            <li>
              <strong>Safari</strong> — around <strong>4 GB</strong>.
            </li>
          </ul>
          <p>
            These are ceilings, not targets. A low-RAM laptop can choke on a
            500 MB file even though the browser "supports" it, especially with
            scroll-scrubbing that seeks constantly.
          </p>
          <p><strong>Recommended for smooth scrolling:</strong></p>
          <ul>
            <li>
              <strong>File size:</strong> under <strong>100 MB</strong>.
            </li>
            <li>
              <strong>Duration:</strong> <strong>10–15 seconds</strong> — long
              videos aren't needed for a scroll-scrub effect.
            </li>
            <li>
              <strong>Resolution:</strong> <strong>720p</strong> is plenty for
              a hero section.
            </li>
            <li>
              <strong>Keyframes:</strong> re-encode with a dense keyframe
              interval so seeks are instant:
              <pre><code>ffmpeg -i input.mp4 -g 5 -keyint_min 5 -sc_threshold 0 -c:v libx264 -crf 23 -movflags +faststart output.mp4</code></pre>
              If the output is too large, raise <code>-crf</code> (e.g.{' '}
              <code>28</code>) to shrink the file — quality drops slightly but
              size falls fast.
            </li>
          </ul>
          <p>
            If your source video is genuinely too large to compress below
            ~100 MB, you'll need a different approach — streaming via{' '}
            <strong>MediaSource Extensions</strong> or chunked loading — but for
            a hero section, compression and a short clip are almost always the
            better trade-off.
          </p>
        </details>
      </section>

      {/* ---- Footer ---- */}
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-brand">
            <span className="footer-logo">FintechX</span>
            <span className="footer-tag">
              Scroll-driven video heroes, made simple.
            </span>
          </p>

          <div className="footer-links">
            <a href="#top">Back to top</a>
            <a href="#faq">FAQ</a>
            <a href="mailto:mrashiwanihacker@gmail.com">Contact</a>
          </div>

          <p className="footer-credit">
            Made with <span className="heart">❤️</span> by{' '}
            <strong>Ashiwani Kumar</strong>
          </p>

          <p className="footer-copy">
            © {year} FintechX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App