"use client";
interface Props { src: string; alt: string; fallback: string; }
export default function CategoryProductImage({ src, alt, fallback }: Props) {
  return (
    <img src={src} alt={alt}
      style={{ maxHeight: 140, maxWidth: "100%", objectFit: "contain" }}
      onError={e => { const t = e.currentTarget; t.src = fallback; t.onerror = null; }} />
  );
}
