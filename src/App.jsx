import { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import BlurText from './components/BlurText';
import BubbleMenu from './components/BubbleMenu';
import FaultyTerminal from './components/FaultyTerminal';

const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || "PASTE_LINK_CSV_KAMU_DISINI";

const PLAYLIST = [
  { title: "Niscaya", artist: "Bilal Indrajaya", src: "/music/niscaya.mp3" },
  { title: "Are You My Valentine", artist: "SIVIA", src: "/music/are-you-my-valentine.mp3" },
  { title: "Kau", artist: "Bilal Indrajaya", src: "/music/kau.mp3" }
];

const BIRTHDAY_MESSAGE = "Happy 22nd Birthday! Keep your spirit high for your thesis. May you be blessed with great health and abundant sustenance. Always remember, you are never alone. Many people are here for you, including me.";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [introVisible, setIntroVisible] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    if (SHEET_CSV_URL === 'PASTE_LINK_CSV_KAMU_DISINI' || SHEET_CSV_URL.includes('URL_CSV_GOOGLE_SHEETS')) {
      setMessages([]);
      setLoading(false);
      return;
    }

    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data
          .filter(row => row.Nama || row.Name || row['Nama Pengirim'] || row.Timestamp)
          .map(row => {
            const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('nama')) || 'Nama';
            const msgKey = Object.keys(row).find(k => k.toLowerCase().includes('pesan') || k.toLowerCase().includes('ucapan')) || 'Pesan';
            return {
              name: row[nameKey] || 'Anonim',
              message: row[msgKey] || ''
            };
          }).filter(item => item.message !== '');
          
        if (data.length > 0) {
          setMessages(data);
        } else {
          setMessages([]);
        }
        setLoading(false);
      },
      error: (err) => {
        console.error("Gagal mengambil data CSV:", err);
        setMessages([]);
        setLoading(false);
      }
    });
  }, []);

  const startJourney = () => {
    setIntroVisible(false);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(e => console.log(e));
      setIsPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log(e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        setTimeout(() => {
          audioRef.current.play().catch(e => console.log(e));
        }, 50);
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Generate dynamic items for BubbleMenu
  const bubbleItems = messages.map((msg, idx) => ({
    label: msg.name,
    href: '#',
    rotation: (idx % 2 === 0 ? 1 : -1) * (Math.random() * 10 + 2),
    onClick: () => setSelectedMessage(msg),
    hoverStyles: { bgColor: '#f472b6', textColor: '#ffffff' } // pink-400
  }));

  return (
    <div className="min-h-screen relative overflow-hidden bg-pink-50 flex flex-col items-center justify-center">
      {/* Background Tulip Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=1920')" }}
      ></div>

      {/* WebGL Faulty Terminal Overlay */}
      {!introVisible && (
        <div className="absolute inset-0 z-0 opacity-50">
          <FaultyTerminal
            scale={1.5}
            tint="#ffb6c1"
            mouseReact={true}
            mouseStrength={0.5}
            brightness={1.5}
          />
        </div>
      )}

      {/* Intro Screen */}
      {introVisible && (
        <div id="intro-overlay" className="fixed inset-0 bg-[#fdf2f8] z-[1000] flex items-center justify-center">
          <div className="text-center relative z-10">
            <h2 className="text-4xl text-pink-500 mb-6 animate-bounce" style={{ fontFamily: "'Dancing Script', cursive" }}>
              A special gift for you...
            </h2>
            <button 
              onClick={startJourney} 
              className="px-10 py-4 bg-pink-400 text-white rounded-full font-bold hover:scale-105 transition shadow-xl shadow-pink-200 cursor-pointer"
            >
              Open the Gift 🌸
            </button>
          </div>
        </div>
      )}

      {/* Floating Music Player UI */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <div className="bg-white/60 backdrop-blur-md p-3 pr-5 rounded-full flex items-center gap-4 shadow-xl border border-white/50">
          <div className={`relative w-12 h-12 rounded-full bg-slate-800 border-[3px] border-slate-900 flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 line-clamp-1 w-24">{PLAYLIST[currentTrackIndex].title}</span>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={prevTrack} className="text-slate-600 hover:text-pink-400 transition text-[10px]">⏮</button>
              <button onClick={toggleMusic} className="text-sm text-pink-400 hover:scale-110 transition">
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button onClick={nextTrack} className="text-slate-600 hover:text-pink-400 transition text-[10px]">⏭</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!introVisible && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl px-6 pointer-events-none min-h-screen py-20">
          
          <div className="mb-20 pointer-events-auto mt-auto">
            {/* The BlurText English Message */}
            <BlurText
              text={BIRTHDAY_MESSAGE}
              delay={80}
              animateBy="words"
              direction="top"
              className="text-3xl md:text-5xl text-slate-900 font-extrabold text-center leading-normal md:leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
          </div>

          <div className="mb-auto pointer-events-auto flex flex-col items-center justify-center w-full relative z-50">
            {messages.length > 0 ? (
              <>
                <BubbleMenu
                  useFixedPosition={true}
                  logo={<span className="text-3xl">💌</span>}
                  items={bubbleItems}
                  menuBg="#f472b6"
                  menuContentColor="#ffffff"
                  onMenuClick={(isOpen) => setIsMenuOpen(isOpen)}
                />
                {!isMenuOpen && (
                   <p className="fixed bottom-[8em] left-1/2 -translate-x-1/2 text-pink-500 font-semibold animate-pulse tracking-widest text-sm uppercase text-center bg-white/50 backdrop-blur-md px-6 py-2 rounded-full z-50">Tap the envelope</p>
                )}
              </>
            ) : (
               <p className="fixed bottom-[4em] left-1/2 -translate-x-1/2 text-pink-400 font-semibold tracking-widest text-sm uppercase text-center bg-white/80 backdrop-blur-md px-6 py-3 rounded-full z-50 shadow-lg border border-pink-200">
                 Belum ada pesan dari teman-teman...
               </p>
            )}
          </div>

        </div>
      )}

      {/* Modal for viewing a friend's message */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedMessage(null)}>
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 max-w-lg w-full shadow-2xl relative transform transition-all" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-pink-100 text-pink-500 rounded-full hover:bg-pink-200 transition"
              onClick={() => setSelectedMessage(null)}
            >
              ✕
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl flex items-center justify-center mb-6 shadow-sm mx-auto">
              <span className="text-xl">💌</span>
            </div>
            <p className="text-slate-700 italic mb-6 leading-relaxed text-lg text-center">"{selectedMessage.message}"</p>
            <h4 className="font-bold text-slate-800 text-xl text-center border-b-2 border-pink-300 inline-block px-4 pb-1 mx-auto block w-max">{selectedMessage.name}</h4>
          </div>
        </div>
      )}

      <audio ref={audioRef} src={PLAYLIST[currentTrackIndex].src} onEnded={nextTrack}></audio>
    </div>
  );
}

export default App;
