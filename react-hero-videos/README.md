# React Hero Videos

Full-screen hero section where videos play one after another when the user scrolls **up** near the top of the page.

## How to run

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually http://localhost:5173).

## How to add your own videos

### Option 1 – Put videos in the `public` folder (recommended)

1. Create a folder: `public/videos`
2. Put your video files inside (mp4 recommended)
3. Open `src/Hero.jsx` and replace the `videos` array:

```js
const videos = [
  '/videos/your-video-1.mp4',
  '/videos/your-video-2.mp4',
  '/videos/your-video-3.mp4',
]
```

### Option 2 – Use external video URLs

Just put the full URLs in the `videos` array.

## Behavior

- Videos are muted + `playsInline` (works on mobile)
- When user scrolls **up** while near the top of the page → next video plays after 1 second
- When a video finishes playing → automatically goes to the next video
- Smooth fade transition between videos
- Loops back to the first video after the last one

## Customize

- Change the 1-second delay → look for `1000` inside `playNext()`
- Change fade speed → edit `0.8s` in `Hero.css`
- Change when scroll triggers → edit the `currentScrollY < 350` value
