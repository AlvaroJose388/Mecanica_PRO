'use client';

import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {getInitials} from '@/lib/utils/get-initials';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Send, Camera, Mic, Video, Smile, Paperclip, Trash2, StopCircle, FileText, Download, MoreVertical, ShieldCheck, CheckCheck } from 'lucide-react';
import { ImageMessage } from './image-message';
import type {Message, User, Conversation} from '@/lib/types';
import {useRef, useEffect, useState} from 'react';
import {ScrollArea} from '../ui/scroll-area';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnhancedToast } from '@/hooks/use-enhanced-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { deleteMessage } from '@/app/actions/chat';

type ExtendedConversation = Conversation & { otherParticipant?: User };

interface ChatProps {
  conversation: ExtendedConversation;
  currentUser: User;
  onSendMessage: (newMessage: {message: string; conversationId: string}) => void;
}

const STICKERS = [
    { code: 'sticker:wrench', emoji: '🔧', label: 'Reparación' },
    { code: 'sticker:car', emoji: '🚗', label: 'Vehículo' },
    { code: 'sticker:check', emoji: '✅', label: 'Terminado' },
    { code: 'sticker:alert', emoji: '⚠️', label: 'Prioridad' },
    { code: 'sticker:oil', emoji: '🛢️', label: 'Aceite' },
    { code: 'sticker:tire', emoji: '🛞', label: 'Llantas' },
    { code: 'sticker:fire', emoji: '🔥', label: 'Urgente' },
    { code: 'sticker:cool', emoji: '😎', label: 'Excelente' },
    { code: 'sticker:money', emoji: '💰', label: 'Pagado' },
    { code: 'sticker:clock', emoji: '⏳', label: 'En espera' },
];

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export function Chat({conversation, currentUser, onSendMessage}: ChatProps) {
  const toast = useEnhancedToast();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [conversation.messages]);

  useEffect(() => {
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim()) {
      onSendMessage({message, conversationId: conversation.id});
      setMessage('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            toast.error({
                title: 'Archivo demasiado pesado',
                description: 'El límite técnico es de 4MB.'
            });
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            const fileHint = file.type.includes('pdf') ? '[PDF]' : '[DOC]';
            onSendMessage({ message: `${fileHint}${file.name}|${base64}`, conversationId: conversation.id });
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleDeleteMsg = async (id: string) => {
      try {
          await deleteMessage(id);
          toast.success({ title: 'Registro de mensaje eliminado' });
      } catch (e) {
          toast.error({ title: 'Error' });
      }
  };

  const sendSticker = (stickerCode: string) => {
      onSendMessage({ message: stickerCode, conversationId: conversation.id });
  };

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            if (audioChunksRef.current.length > 0) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    onSendMessage({ message: base64, conversationId: conversation.id });
                };
                reader.readAsDataURL(audioBlob);
            }
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    } catch (err) {
        toast.error({
            title: 'Error de Micrófono',
            description: 'Verifique los permisos del navegador.'
        });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessageContent = (text: string, isOwn: boolean = false) => {
      // Archivos PDF y DOC
      if (text.startsWith('[PDF]') || text.startsWith('[DOC]')) {
          const [header, base64] = text.split('|');
          const fileName = header.replace('[PDF]', '').replace('[DOC]', '');
          const isPdf = header.includes('PDF');
          
          return (
              <div className="flex items-center gap-3 p-3 bg-slate-100/50 rounded-2xl border border-white/20 mt-1 min-w-[200px]">
                  <div className={cn("p-2 rounded-xl shrink-0 shadow-sm", isPdf ? "bg-red-500 text-white" : "bg-blue-500 text-white")}>
                      <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                      <p className="text-[11px] font-black truncate text-slate-900 uppercase tracking-tight">{fileName}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{isPdf ? 'Documento PDF' : 'Documento DOC'}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" asChild>
                      <a href={base64} download={fileName}>
                          <Download className="h-4 w-4" />
                      </a>
                  </Button>
              </div>
          );
      }
      
      // Imágenes (PNG, JPG, GIF, WEBP, etc.)
      if (text.startsWith('data:image') || /\.(png|jpg|jpeg|gif|webp)$/i.test(text)) {
          return <ImageMessage src={text} alt="Foto Técnica" isOwn={isOwn} />;
      }
      
      // Audio
      if (text.startsWith('data:audio')) {
          return (
              <audio controls className="max-w-xs rounded-xl mt-1">
                  <source src={text} type="audio/webm" />
                  Tu navegador no soporta reproducción de audio
              </audio>
          );
      }
      
      // Video
      if (text.startsWith('data:video')) {
          return (
              <video controls className="max-w-xs rounded-xl mt-1 max-h-80">
                  <source src={text} type="video/mp4" />
                  Tu navegador no soporta reproducción de video
              </video>
          );
      }
      
      // Stickers (emoji)
      if (text.startsWith('sticker:')) {
          const stickerCode = text.replace('sticker:', '');
          const stickerMap: { [key: string]: string } = {
              'wrench': '🔧', 'car': '🚗', 'check': '✅', 'alert': '⚠️',
              'oil': '🛢️', 'tire': '🛞', 'fire': '🔥', 'cool': '😎',
              'money': '💰', 'clock': '⏳'
          };
          return <span className="text-4xl">{stickerMap[stickerCode] || '👍'}</span>;
      }
      
      // Texto normal
      return <p className="text-sm leading-relaxed">{text}</p>;
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>

      <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-md z-10 h-16 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm">
                <AvatarImage 
                    src={conversation.otherParticipant?.avatarUrl} 
                    alt={conversation.otherParticipant?.name} 
                />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">{getInitials(conversation.otherParticipant?.name || 'U')}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <div className="overflow-hidden">
                <p className="font-black text-sm leading-none text-slate-950 uppercase tracking-tight truncate">{conversation.otherParticipant?.name}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black truncate">
                        {conversation.otherParticipant?.role} • Conectado
                    </p>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <MoreVertical className="h-5 w-5" />
            </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 z-10" ref={scrollAreaRef}>
        <div className="space-y-6">
          {conversation.messages.map((msg, index) => {
            const isOwn = msg.senderId === currentUser.id;
            const isSticker = msg.text.startsWith('sticker:');

            return (
                <div
                key={msg.id || index}
                className={cn(
                    'flex group gap-3 animate-in slide-in-from-bottom-2 duration-300',
                    isOwn ? 'flex-row-reverse' : 'flex-row'
                )}
                >
                <div className={cn(
                    "flex flex-col max-w-[85%] sm:max-w-[70%]",
                    isOwn ? "items-end" : "items-start"
                )}>
                    <div className="flex items-end gap-2">
                        <div
                            className={cn(
                            'rounded-2xl p-4 text-sm shadow-md transition-all relative',
                            isOwn
                                ? (isSticker ? '' : 'bg-slate-950 text-white rounded-tr-none border-b-4 border-primary/30')
                                : (isSticker ? '' : 'bg-white text-slate-900 border-2 border-slate-100 rounded-tl-none')
                            )}
                        >
                            {renderMessageContent(msg.text, isOwn)}
                            
                            <div className={cn(
                                "flex items-center gap-1.5 mt-2 opacity-50",
                                isOwn ? "justify-end" : "justify-start"
                            )}>
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                    {msg.timestamp ? format(new Date(msg.timestamp), "HH:mm") : ''}
                                </span>
                                {isOwn && <CheckCheck className="h-3 w-3 text-primary" />}
                            </div>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
                                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-destructive" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isOwn ? 'end' : 'start'} className="rounded-2xl border-2">
                                <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 text-xs font-black uppercase" onClick={() => handleDeleteMsg(msg.id)}>
                                    <Trash2 className="h-3.5 w-3.5" /> Eliminar Mensaje
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white/80 backdrop-blur-md z-10 shrink-0">
        {isRecording ? (
            <div className="flex items-center justify-between bg-slate-950 text-white rounded-[1.5rem] px-6 py-3 animate-pulse shadow-2xl h-14 border-2 border-primary/30">
                <div className="flex items-center gap-4">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-ping" />
                    <span className="text-sm font-black tracking-widest text-red-500">{formatTime(recordingTime)}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Capturando Audio Técnico...</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsRecording(false)} className="text-slate-400 h-10 w-10 hover:text-red-500 hover:bg-white/5 rounded-xl">
                        <Trash2 className="h-5 w-5" />
                    </Button>
                    <Button type="button" size="icon" onClick={stopRecording} className="rounded-full h-11 w-11 bg-primary text-white hover:bg-primary/80 shadow-lg">
                        <StopCircle className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 h-14">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*,audio/*,application/pdf,.doc,.docx" 
                    onChange={handleFileUpload} 
                />
                
                <div className="flex items-center gap-1">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl h-11 w-11 shrink-0 transition-all">
                                <Smile className="h-6 w-6" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-3 bg-white border-2 shadow-2xl rounded-[2rem]" side="top" align="start">
                            <div className="p-2 border-b-2 border-slate-50 mb-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocolos de Reacción Pro</p>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {STICKERS.map(s => (
                                    <button 
                                        key={s.code} 
                                        type="button"
                                        onClick={() => sendSticker(s.code)}
                                        className="text-3xl hover:bg-slate-50 p-2 rounded-2xl transition-all hover:scale-125 active:scale-90"
                                        title={s.label}
                                    >
                                        {s.emoji}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl h-11 w-11 shrink-0 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Paperclip className="h-6 w-6" />}
                    </Button>
                </div>

                <div className="flex-1 relative group">
                    <Input
                        autoComplete="off"
                        placeholder="Escribe un reporte o mensaje técnico..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="h-12 bg-slate-100/80 border-2 border-transparent group-focus-within:border-primary/20 group-focus-within:bg-white rounded-2xl px-6 text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-inner"
                    />
                </div>

                {message.trim() ? (
                    <Button type="submit" size="icon" className="h-12 w-12 rounded-2xl shadow-xl bg-slate-950 text-white hover:bg-primary transition-all active:scale-95 shrink-0">
                        <Send className="h-6 w-6" />
                    </Button>
                ) : (
                    <Button type="button" size="icon" onClick={startRecording} className="h-12 w-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 transition-all active:scale-95 shrink-0 shadow-sm">
                        <Mic className="h-6 w-6" />
                    </Button>
                )}
            </form>
        )}
      </div>
    </div>
  );
}
