import { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import BlurText from './components/BlurText';
import FaultyTerminal from './components/FaultyTerminal';
import ReflectiveCard from './components/ReflectiveCard';
import DomeGallery from './components/DomeGallery';
import Folder from './components/Folder';

const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || "PASTE_LINK_CSV_KAMU_DISINI";

const PLAYLIST = [
  { title: "Niscaya", artist: "Bilal Indrajaya", src: "/music/niscaya.mp3" },
  { title: "Are You My Valentine", artist: "SIVIA", src: "/music/are-you-my-valentine.mp3" },
  { title: "Kau", artist: "Bilal Indrajaya", src: "/music/kau.mp3" }
];

const BIRTHDAY_MESSAGE = "Happy 22nd Birthday! Keep your spirit high for your thesis. May you be blessed with great health and abundant sustenance. Always remember, you are never alone. Many people are here for you, including me.";

const PHOTOS = [
  { image: 'https://cdn.phototourl.com/free/2026-06-30-8759f85f-57a9-458f-b4ce-7a5e20101fdd.jpg', title: 'Happy', description: 'Birthday' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-c0217af0-6e61-409e-b69a-a47fab7988fb.jpg', title: 'To', description: 'You' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-c993c845-4920-4dcc-b42e-b7e9ff839929.jpg', title: 'Nabilah', description: 'Rasyiqah' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-60688270-fcec-480d-b328-02de4de4306d.jpg', title: '22nd', description: 'Years' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-37055339-1460-4502-8958-006b864790dc.jpg', title: 'Old', description: 'Now' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-adb0d4a7-807a-4a91-bef2-454856c3a85e.jpg', title: 'May', description: 'All' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-182347a3-a8e7-4543-a8a4-f8e7b77b2f24.jpg', title: 'Your', description: 'Dreams' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-2947aaa2-877b-4d0a-adb9-2bbddefdb1d0.jpg', title: 'Come', description: 'True' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-bc65caf1-cd05-4fe1-bb75-0614c1d99405.jpg', title: 'Always', description: 'Happy' },
  { image: 'https://cdn.phototourl.com/free/2026-06-30-112c284d-8947-456f-87ae-a6016c733779.jpg', title: 'Smile', description: 'Forever' }
].map(p => p.image);

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [introVisible, setIntroVisible] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
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

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-pink-50 flex flex-col items-center justify-center">
      {/* Background Tulip Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-40 z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=1920')" }}
      ></div>

      {/* WebGL Faulty Terminal Overlay */}
      {!introVisible && (
        <div className="fixed inset-0 z-0 opacity-50 pointer-events-none">
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
        <div id="intro-overlay" className="fixed inset-0 bg-slate-900 z-[1000] flex flex-col items-center justify-center p-6">
          <div className="text-center relative z-10 flex flex-col items-center">
            <h2 className="text-4xl text-pink-400 mb-8 animate-pulse" style={{ fontFamily: "'Dancing Script', cursive" }}>
              A special gift awaits...
            </h2>
            
            <div onClick={startJourney} className="cursor-pointer">
              <ReflectiveCard 
                blurStrength={10}
                glassDistortion={15}
                metalness={0.8}
                roughness={0.5}
                displacementStrength={25}
                noiseScale={1.5}
                specularConstant={2.0}
                grayscale={0.5}
                color="#ffffff"
                overlayColor="rgba(244, 114, 182, 0.2)"
              />
            </div>
            
            <p className="text-pink-300 mt-8 mb-4 text-sm tracking-widest uppercase">Tap Identity Card To Access</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!introVisible && (
        <div className="relative z-10 flex flex-col items-center justify-start w-full pointer-events-none min-h-screen py-20">
          
          <div className="mb-20 px-6 max-w-5xl pointer-events-auto">
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

          <div className="w-full h-[90vh] my-10 pointer-events-auto relative">
             <DomeGallery 
               images={PHOTOS} 
               grayscale={false}
               overlayBlurColor="transparent"
             />
          </div>

          <div className="w-full max-w-7xl px-10 mt-32 mb-20 pointer-events-auto z-20">
             <h2 className="text-4xl md:text-5xl font-bold text-center text-pink-500 mb-20" style={{ fontFamily: "'Dancing Script', cursive" }}>Messages from Your Friends</h2>
             
             {messages.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-24 gap-x-8 place-items-center">
                  {messages.map((msg, i) => {
                    const colors = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24'];
                    const color = colors[i % colors.length];
                    return (
                     <Folder 
                       key={i} 
                       color={color} 
                       size={1} 
                       onPaperClick={() => setSelectedMessage(msg)}
                       items={[
                         <div className="flex flex-col items-center justify-center w-full h-full p-2 bg-pink-50 rounded-lg shadow-inner">
                           <div className="text-[11px] font-medium text-slate-800 leading-tight w-full truncate">"{msg.message.substring(0, 30)}..."</div>
                           <div className="font-bold text-pink-600 mt-2 text-sm">{msg.name}</div>
                           <div className="text-[8px] italic text-slate-500 mt-1">Tap paper to read</div>
                         </div>,
                         <div className="flex flex-col items-center justify-center w-full h-full p-2 bg-pink-100 rounded-lg">
                           <span className="text-xl">💌</span>
                         </div>,
                         <div className="flex flex-col items-center justify-center w-full h-full p-2 bg-pink-50 rounded-lg">
                           <span className="text-xl">🌸</span>
                         </div>
                       ]}
                     />
                    )
                  })}
               </div>
             ) : (
                <p className="text-pink-400 font-semibold tracking-widest text-sm uppercase text-center bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-pink-200 mx-auto max-w-md">
                  Belum ada pesan dari teman-teman...
                </p>
             )}
          </div>

          <div className="h-40"></div>
        </div>
      )}

      {/* Floating Music Player UI */}
      {!introVisible && (
        <div className="fixed bottom-6 right-6 z-[200] pointer-events-auto">
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
      )}

      {/* Modal for viewing a friend's message */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md pointer-events-auto" onClick={() => setSelectedMessage(null)}>
          <div className="bg-gradient-to-b from-white/95 to-pink-50/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative transform transition-all border border-pink-200 flex flex-col" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center bg-pink-100 hover:bg-pink-200 text-pink-500 rounded-full transition font-bold shadow-sm z-10 text-xl"
              onClick={() => setSelectedMessage(null)}
            >
              ✕
            </button>
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg mx-auto transform -rotate-3 border-4 border-white">
              <span className="text-4xl drop-shadow-md">💌</span>
            </div>
            
            <div className="flex-grow flex flex-col justify-center">
              <p className="text-slate-700 leading-loose text-base sm:text-lg whitespace-pre-wrap text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {selectedMessage.message}
              </p>
            </div>

            <div className="text-center mt-12 flex-shrink-0">
              <div className="w-16 h-1 bg-pink-200 mx-auto mb-4 rounded-full"></div>
              <p className="text-xs text-pink-400 font-bold uppercase tracking-widest mb-1">From</p>
              <h4 className="font-extrabold text-slate-800 text-3xl sm:text-4xl inline-block px-4" style={{ fontFamily: "'Dancing Script', cursive" }}>{selectedMessage.name}</h4>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} src={PLAYLIST[currentTrackIndex].src} onEnded={nextTrack}></audio>
    </div>
  );
}

export default App;
