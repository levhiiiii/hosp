import React, { useEffect } from 'react'

const ModelViewer = () => {
  useEffect(() => {
    // Load model-viewer script dynamically
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
    document.head.appendChild(script)

    // Wait for model-viewer to load and then enable animations
    script.onload = () => {
      setTimeout(() => {
        const modelViewer = document.querySelector('model-viewer')
        if (modelViewer) {
          // Enable animations
          modelViewer.autoplay = true
          modelViewer.loop = true
          
          // Try to play the first animation if available
          modelViewer.addEventListener('load', () => {
            const animations = modelViewer.availableAnimations
            if (animations && animations.length > 0) {
              console.log('Available animations:', animations)
              // Play the first animation
              modelViewer.animationName = animations[0]
              modelViewer.play()
            }
          })
        }
      }, 1000)
    }

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <model-viewer
        src="/floating_town-hand_painted.glb"
        alt="Floating Town 3D Model"
        auto-rotate
        camera-controls
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent'
        }}
        camera-orbit="0deg 75deg 4m"
        field-of-view="30deg"
        exposure="1"
        shadow-intensity="1"
        loading="eager"
        reveal="auto"
        animation-name=""
        autoplay
        loop
        animation-crossfade-duration="0.5"
        interaction-prompt="auto"
        interaction-prompt-threshold="2000"
      />
    </div>
  )
}

export default ModelViewer
