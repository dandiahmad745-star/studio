// This is a new file
"use client";

interface LocationMapProps {
  address: string;
}

export default function LocationMap({ address }: LocationMapProps) {
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`;

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg border md:h-full">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={embedUrl}
      ></iframe>
    </div>
  );
}
