'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn } from 'lucide-react';
import ProductImage from './ProductImage';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const photos = [...new Set(images.filter(Boolean))].slice(0, 4);
  const index = Math.min(active, Math.max(0, photos.length - 1));
  const move = (step: number) => setActive((index + step + photos.length) % photos.length);
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-bg-elev-2">
        {photos[index] ? <button type="button" title="Zoom image" aria-label={`Zoom ${name} photo ${index + 1}`} onClick={() => dialog.current?.showModal()} className="block h-full w-full cursor-zoom-in">
          <ProductImage src={photos[index]} alt={`${name} - photo ${index + 1}`} className="h-full w-full object-contain" />
          <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-border bg-bg-elev-1 text-text"><ZoomIn className="h-5 w-5" /></span>
        </button> : <div className="grid h-full place-items-center text-text-muted"><ImageOff className="h-10 w-10" aria-label="No product image" /></div>}
        {photos.length > 1 && <>
          <button type="button" title="Previous photo" aria-label="Previous photo" onClick={() => move(-1)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg-elev-1 text-text"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" title="Next photo" aria-label="Next photo" onClick={() => move(1)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg-elev-1 text-text"><ChevronRight className="h-5 w-5" /></button>
        </>}
      </div>
      {photos.length > 1 && <div className="flex gap-3 overflow-x-auto pb-1">
        {photos.map((image, photoIndex) => <button key={image} type="button" onClick={() => setActive(photoIndex)} aria-label={`View photo ${photoIndex + 1}`} aria-pressed={index === photoIndex} className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-bg-elev-2 ${index === photoIndex ? 'border-accent' : 'border-border hover:border-accent/50'}`}>
          <ProductImage src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </button>)}
      </div>}
      <dialog ref={dialog} aria-label={`${name} enlarged photo`} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => { if (photos.length > 1 && event.key === 'ArrowRight') move(1); if (photos.length > 1 && event.key === 'ArrowLeft') move(-1); }} className="fixed inset-0 m-auto h-[85dvh] w-[94vw] max-w-4xl rounded-lg border border-border bg-bg-elev-1 p-4 backdrop:bg-black/70">
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between gap-3"><p className="text-sm text-text">{name} · {index + 1}/{photos.length}</p><button type="button" title="Close image" aria-label="Close image" onClick={() => dialog.current?.close()} className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-text hover:bg-bg-elev-2"><X className="h-5 w-5" /></button></div>
          {photos[index] && <ProductImage src={photos[index]} alt={`${name} - photo ${index + 1}`} className="min-h-0 flex-1 object-contain" />}
          {photos.length > 1 && <div className="flex justify-center gap-3"><button type="button" title="Previous photo" aria-label="Previous enlarged photo" onClick={() => move(-1)} className="grid h-10 w-10 place-items-center rounded-md border border-border text-text"><ChevronLeft className="h-5 w-5" /></button><button type="button" title="Next photo" aria-label="Next enlarged photo" onClick={() => move(1)} className="grid h-10 w-10 place-items-center rounded-md border border-border text-text"><ChevronRight className="h-5 w-5" /></button></div>}
        </div>
      </dialog>
    </div>
  );
}
