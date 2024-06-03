import { useState, useEffect, useRef, useMemo, FC } from "react";
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Stars } from "@react-three/drei";
import { DepthOfField, EffectComposer, Noise, Vignette, Scanline, BrightnessContrast  } from '@react-three/postprocessing'
// import { Perf } from 'r3f-perf'

import MusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'

import { Vinyl } from './components/Vinyl'
import { Room } from "./components/Room";
import { Turntable } from "./components/Turntable";


interface JsonProps {
  id: string,
  fields: {
    key: number,
    name: string,
    album: string,
    musicSrc: string,
    cover: string,
    stickerCover: string,
    position: string,
  }
}

interface VinylProps {
  key: number,
  name: string,
  album: string,
  musicSrc: string,
  cover: string,
  stickerCover: string,
  position: [number, number, number],
  rotation: [number, number, number]
}

interface SceneProps {
  onVinylClick: (name: string) => void,
  activeVinyl: string,
  vinyls: VinylProps[]
}

const LIGHT_PROPS = {
  intensity: 2000,
  positionX: -3.5,
  positionY: 26.8,
  positionZ: -0.1,
  angle: 1.1,
  penumbra: 0.2,
  decay: 2,
  distance: 50,
  shadowMapSize: 2048,
  shadowBias: -0.0001,
}

const ROTATIONS: [number, number, number][] = [
  [Math.PI / 2, 0, Math.PI / 3],
  [Math.PI / 2, 0, Math.PI / -3],
  [Math.PI / 2, 0, Math.PI / 2],
  [Math.PI / 2, 0, Math.PI / -2]
]


const Scene: FC<SceneProps> = ({ onVinylClick, activeVinyl, vinyls }) => {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      {vinyls.map((vinyl: VinylProps) => {
        const isActive = activeVinyl === vinyl.name
        const floatParams = isActive ? { speed: 0, floatIntensity: 0 } : { speed: 5,  floatIntensity: 1.2, rotationIntensity: 0}
        return (
          <Float key={vinyl.key} {...floatParams}>
            <Vinyl
              name={vinyl.name}
              isActive={isActive}
              originalPosition={vinyl.position}
              originalRotation={vinyl.rotation}
              stickerCover={vinyl.stickerCover}
              onClick={() => onVinylClick(vinyl.name)}
            />
          </Float>
        )
      })}
      <Room />
      <Turntable />
    </>
  )
}

const App: FC = () => {
  const [vinyls, setVinyls] = useState<Array<VinylProps>>([])
  const [activeVinyl, setActiveVinyl] = useState<string>('')
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 734)
  const [useEffectComposer, setUseEffectComposer] = useState<boolean>(true)
  const [currentCover, setCurrentCover] = useState<string>('')
  const [currentSongName, setCurrentSongName] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(true)

  const musicPlayerRef = useRef<any>();
  const sfxin = useRef(new Audio('audios/sfxin.wav'))
  const sfxout = useRef(new Audio('audios/sfxout.wav'))

  const musicList = useMemo(() => vinyls.map(vinyl => ({
    name: vinyl.name,
    musicSrc: vinyl.musicSrc,
    cover: vinyl.cover,
  })), [vinyls]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 734)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchVinyls = async () => {
      try  {
        const response = await fetch('/vinyls.json')
        const data = await response.json()

        const processedVinyls: VinylProps[] = data.items.map((item: JsonProps) => {
          const randomRotation = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
          let position: [number, number, number] = [0, 0, 0]

          try {
            position = JSON.parse(item.fields.position)
          } catch (error) {
            console.error('Failed to parse position', error)
          }

          return {
            key: item.fields.key,
            name: item.fields.name,
            album: item.fields.album,
            musicSrc: item.fields.musicSrc,
            cover: item.fields.cover,
            stickerCover: item.fields.stickerCover,
            rotation: randomRotation,
            position: position
          }
        })

        setVinyls(processedVinyls)
      } catch (error) {
        console.error('Failed to fetch vinyls', error)
      }
    }

    fetchVinyls()
  } , [])

  const handleToggleEffectComposer = () => {
    setUseEffectComposer((prev) => !prev)
  };

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleVinylClick = (name: string) => {
    if (isAnimating) return

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1200)

    const vinyl = vinyls.find(v => v.name === name)
    if (!vinyl) return

    sfxout.current.play()
    musicPlayerRef.current?.audio.pause()

    if (activeVinyl === name) {
      setActiveVinyl('')
      setCurrentCover('')
      setCurrentSongName('')
    } else {
      setActiveVinyl(name)
      const songIndex = musicList.findIndex((song) => song.name === name)
      setTimeout(() => {
        setCurrentCover(vinyl.cover)
        setCurrentSongName(vinyl.name)
        sfxin.current.play()
        musicPlayerRef.current?.updatePlayIndex(songIndex)
        musicPlayerRef.current?.audio.play()
      }, 1200);
    }
  }

  return (
    <>
    {showModal && (
      <div className="info-modal">
        <div className="info-modal-content">
          <p className="typography-info-headline">
            Click a vinyl to start playing, move in the space in 3d. If a song doesn't start playing, wait for the song loading, enjoy!
          </p>
          <button className="info-modal-button typography-info-button" onClick={handleCloseModal}>Okay</button>
        </div>
      </div>
    )}

    {isDesktop && (
      <button className={'effect-modal-trigger modal-trigger effect-modal-button'} onClick={handleToggleEffectComposer}>
        <div className="effect-modal-content">
          <h1 className="typography-effect-headline">
            {useEffectComposer ? 'Cinematic mode (heavy)' : 'Basic mode (light)'}
          </h1>
        </div>
        <div className="modal-trigger-container" style={{backgroundColor: useEffectComposer ? '#fed700' : '#6e6e73'}}>
          <span className="effect-button-icon"style={{transform: useEffectComposer ? 'translateX(20px)' : 'translateX(4px)'}}>
          </span>
        </div>
      </button>
    )}

    <Canvas shadows camera={{ fov: 70, position: [-16, 7, 0] }}>
      <OrbitControls />
      <Scene onVinylClick={handleVinylClick} activeVinyl={activeVinyl} vinyls={vinyls} />
      <ambientLight intensity={0.5} />
      <spotLight
        castShadow
        position={[LIGHT_PROPS.positionX, LIGHT_PROPS.positionY, LIGHT_PROPS.positionZ]}
        intensity={LIGHT_PROPS.intensity}
        penumbra={LIGHT_PROPS.penumbra}
        decay={LIGHT_PROPS.decay}
        distance={LIGHT_PROPS.distance}
        shadow-mapSize-width={LIGHT_PROPS.shadowMapSize}
        shadow-mapSize-height={LIGHT_PROPS.shadowMapSize}
        shadow-bias={LIGHT_PROPS.shadowBias}
      />

      {isDesktop && useEffectComposer && (
          <EffectComposer>
            <DepthOfField focusDistance={0.5} focalLength={2} bokehScale={0.5} height={480} />
            <Noise opacity={0.07} />
            <Vignette eskil={false} offset={0.15} darkness={1.0} />
            <Scanline density={10} opacity={0.25} />
            <BrightnessContrast brightness={0.12} contrast={0.3} />
          </EffectComposer>
        )}

      {/* <Perf position={'top-left'} /> */}
      </Canvas>

      <div className="music-modal">
        <div className="music-modal-content" style={{top: isDesktop ? '3%' : '15px'}}>
          {currentCover && (
            <div className="music-modal-image" style={{backgroundImage: `url(${currentCover})`}} />
          )}
          {currentSongName && (
            <div className="typography-music-headline">
              {currentSongName}
            </div>
          )}
        </div>
      </div>

      <MusicPlayer 
        ref={musicPlayerRef}
        audioLists={musicList}
        defaultPlayIndex={5}
        defaultPosition={{ bottom: 15, right: 15 }}
        glassBg={true}
        mode={'full'}
        autoPlay={false}
        showDownload={false}
        showThemeSwitch={false}
      />
    </>
  )
}

export default App
