import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Play, Pause, X, RotateCcw, Volume2, VolumeX } from "lucide-react";

const MediaPreviewModal = ({ isOpen, onClose, mediaUrl, title }) => {
  if (!isOpen) return null;

  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); 

  const videoRef = useRef(null);
  const viewportRef = useRef(null);
  const urlString = mediaUrl || "";
  const isDriveLink = urlString.includes("drive.google.com");
  const isVideo = !isDriveLink && (urlString.match(/\.(mp4|webm|ogg|mov|mkv)$/i) || urlString.includes("video/upload"));
  const isPdf = !isDriveLink && urlString.match(/\.pdf$/i);
  const isDocOrExcel = !isDriveLink && urlString.match(/\.(docx|doc|xlsx|xls|pptx|ppt)$/i);
  const isDocument = isPdf || isDocOrExcel;

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("/view") || url.includes("/edit")) {
      return url.replace(/\/view.*$/, "/preview").replace(/\/edit.*$/, "/preview");
    }
    if (url.includes("id=")) {
      try {
        const id = url.split("id=")[1].split("&")[0];
        return `https://drive.google.com/file/d/${id}/preview`;
      } catch (e) {
        return url;
      }
    }
    return url;
  };

  const computedUrl = isDriveLink ? getEmbedUrl(urlString) : urlString;

  useEffect(() => {
    setZoom(1);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPosition({ x: 0, y: 0 });
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
      viewportRef.current.scrollLeft = 0;
    }
  }, [mediaUrl]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => {
    setZoom((prev) => {
      const nextZoom = Math.max(prev - 0.25, 0.5);
      if (nextZoom === 1) setPosition({ x: 0, y: 0 });
      return nextZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (isVideo || isDocument || zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekChange = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
      if (nextMute) {
        videoRef.current.volume = 0;
      } else {
        videoRef.current.volume = volume > 0 ? volume : 0.5;
        if (volume === 0) setVolume(0.5);
      }
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/10 backdrop-blur-xs p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="flex flex-col bg-white rounded-2xl border-slate-200 w-full max-w-4xl h-[85vh] shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
        style={{ borderLeft: '6px solid #0D7A80' }}
      >
        
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shrink-0 select-none">
          <div>
            <h2 className="text-xl font-bold text-[#063A3A] tracking-tight">
              Content Viewer <span className="text-slate-300 mx-1 font-light">|</span> <span className="text-[#063A3A] font-medium">{title || "Untitled Media"}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div 
          ref={viewportRef}
          className={`flex-1 bg-white relative overflow-auto select-none min-h-0 ${
            isDocument || isDriveLink ? "p-0 flex flex-col items-stretch" : "px-6 py-4 flex items-center justify-center"
          }`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ scrollbarColor: '#0D7A80 transparent', scrollbarWidth: 'thin' }}
        >
          <div 
            onMouseDown={handleMouseDown}
            className={`flex items-center justify-center bg-white ${
              isDocument || isDriveLink ? "w-full flex-1 h-full min-h-full items-stretch" : "w-full min-h-full max-w-full max-h-[54vh]"
            } ${zoom > 1 ? 'cursor-grabbing' : 'cursor-default'}`}
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              transformOrigin: zoom > 1 ? 'top center' : 'center center'
            }}
          >
           
            
            {isDriveLink && (
              <div className="w-full h-full relative bg-white flex-1 flex items-center justify-center">
                <iframe
                  src={computedUrl}
                  className="w-full h-full border-0 flex-1 bg-white"
                  title={title || "Drive Content Preview"}
                />
                
                <div className="absolute inset-0 bg-transparent z-10 pointer-events-auto" />
              </div>
            )}

            {isPdf && (
              <iframe 
                src={`${computedUrl}#toolbar=0&scrollbar=0`} 
                title={title} 
                className="w-full h-full border-0 flex-1 bg-white"
                style={{ backgroundColor: '#ffffff' }}
              />
            )}

            {isDocOrExcel && (
              <iframe 
                src={`https://docs.google.com/gview?url=${encodeURIComponent(computedUrl)}&embedded=true&bg=ffffff`}
                title={title}
                className="w-full h-full border-0 flex-1 bg-white"
                style={{ backgroundColor: '#ffffff' }}
              />
            )}

            {isVideo && (
              <div 
                onClick={togglePlay}
                className="relative bg-white flex items-center justify-center rounded-xl max-w-full max-h-[52vh]"
              >
                <video 
                  ref={videoRef}
                  src={computedUrl} 
                  className="max-w-full max-h-[52vh] object-contain bg-white rounded-xl"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-all z-10 cursor-pointer rounded-xl">
                    <div className="p-4 bg-white border border-slate-100 rounded-full text-[#063A3A] shadow-md transform hover:scale-105 transition-transform">
                      <Play size={22} fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isVideo && !isDocument && !isDriveLink && (
              <img 
                src={computedUrl} 
                alt={title || "Preview Window"} 
                className={`max-w-full max-h-[54vh] object-contain select-none bg-white ${
                  zoom > 1 ? 'cursor-grab' : 'cursor-default'
                }`}
                draggable={false}
              />
            )}
          </div>
        </div>

        <div 
          className="px-6 py-3.5 flex items-center justify-between gap-4 shrink-0 select-none"
          style={{ backgroundColor: '#063A3A', borderTop: '1px solid #000000' }}
        >
          
          <div 
            className="flex items-center bg-white rounded-xl p-1 shadow-xs"
            style={{ border: '1px solid #c3fae8' }}
          >
            <button onClick={handleZoomOut} className="p-2 text-slate-500 hover:text-[#063A3A] hover:bg-slate-50 rounded-lg transition cursor-pointer">
              <ZoomOut size={15} />
            </button>
            <span className="px-2.5 text-xs font-mono font-bold text-[#063A3A] min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={handleZoomIn} className="p-2 text-slate-500 hover:text-[#063A3A] hover:bg-slate-50 rounded-lg transition cursor-pointer">
              <ZoomIn size={15} />
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <button onClick={handleResetZoom} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition cursor-pointer" title="Reset Zoom">
              <RotateCcw size={13} />
            </button>
          </div>

          {isVideo && (
            <div className="flex items-center flex-1 justify-end gap-3 max-w-2xl">
              
              <div 
                className="flex items-center gap-3 flex-1 bg-white px-3 py-2 rounded-xl shadow-xs"
                style={{ border: '1px solid #c3fae8' }}
              >
                <span className="text-xs font-mono font-bold text-[#063A3A] shrink-0">
                  {formatTime(currentTime)}
                </span>
                <input 
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeekChange}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#063A3A]"
                />
                <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                  {formatTime(duration)}
                </span>
              </div>

              <div 
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-xs shrink-0"
                style={{ border: '1px solid #c3fae8' }}
              >
                <button onClick={toggleMute} className="text-[#063A3A] hover:text-[#0D7A80] transition cursor-pointer flex items-center">
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input 
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#063A3A]"
                />
              </div>

              <button 
                onClick={togglePlay} 
                className="flex items-center justify-center p-2.5 bg-white hover:bg-slate-50 text-[#063A3A] rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                style={{ border: '1px solid #c3fae8' }}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default MediaPreviewModal;