import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "650px",
  borderRadius: "24px",
};

const defaultCenter = { lat: 31.4117, lng: 34.6753 };

const townCoordinates = {
  "אשדוד": { lat: 31.8014, lng: 34.6435 },
  "אשקלון": { lat: 31.6688, lng: 34.5743 },
  "באר שבע": { lat: 31.252, lng: 34.7915 },
  "גן יבנה": { lat: 31.7889, lng: 34.7066 },
  "יבנה": { lat: 31.8781, lng: 34.7398 },
  "רחובות": { lat: 31.8948, lng: 34.8113 },
  "ראשון לציון": { lat: 31.973, lng: 34.7925 },
  "נס ציונה": { lat: 31.9307, lng: 34.7987 },
  "קריית גת": { lat: 31.61, lng: 34.7642 },
  "קריית מלאכי": { lat: 31.7306, lng: 34.7468 },
  "תל אביב": { lat: 32.0853, lng: 34.7818 },
  "חולון": { lat: 32.0158, lng: 34.7874 },
  "בת ים": { lat: 32.0231, lng: 34.7503 },
  "רמלה": { lat: 31.9316, lng: 34.8656 },
  "לוד": { lat: 31.951, lng: 34.8881 },
  "נהריה": { lat: 33.0059, lng: 35.0941 },
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  gestureHandling: "greedy",
};

export default function ResidenceMap({
  points,
  activeTown,
  onSelectTown,
  googleMapsApiKey,
}) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const mapRef = useRef(null);

  const enrichedPoints = useMemo(() => {
    return points
      .map((point) => {
        const coords = townCoordinates[point.town];
        if (!coords) return null;

        return {
          ...point,
          lat: coords.lat,
          lng: coords.lng,
        };
      })
      .filter(Boolean);
  }, [points]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey || "",
  });

  const fitMapToPoints = useCallback(() => {
    if (!mapRef.current || !window.google || !enrichedPoints.length) return;

    if (activeTown) {
      const activePoint = enrichedPoints.find((p) => p.town === activeTown);
      if (activePoint) {
        mapRef.current.panTo({ lat: activePoint.lat, lng: activePoint.lng });
        mapRef.current.setZoom(10);
        return;
      }
    }

    if (enrichedPoints.length === 1) {
      mapRef.current.panTo({
        lat: enrichedPoints[0].lat,
        lng: enrichedPoints[0].lng,
      });
      mapRef.current.setZoom(10);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    enrichedPoints.forEach((point) => {
      bounds.extend({ lat: point.lat, lng: point.lng });
    });

    mapRef.current.fitBounds(bounds, 50);
  }, [enrichedPoints, activeTown]);

  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;
      setTimeout(() => {
        fitMapToPoints();
      }, 100);
    },
    [fitMapToPoints]
  );

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const timer = setTimeout(() => {
      fitMapToPoints();
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoaded, fitMapToPoints]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const handleResize = () => {
      setTimeout(() => {
        fitMapToPoints();
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, fitMapToPoints]);

  if (!googleMapsApiKey) {
    return (
      <div className="flex h-[440px] items-center justify-center rounded-2xl bg-[#2e3038] text-center text-white/70 ring-1 ring-white/10">
        <div>
          <div className="text-lg font-bold text-white">
            Google Maps API Key חסר
          </div>
          <div className="mt-2 text-sm">הוסף לקובץ .env את המשתנה:</div>
          <div className="mt-2 font-mono text-sky-300">
            REACT_APP_GOOGLE_MAPS_API_KEY=your_key
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[440px] items-center justify-center rounded-2xl bg-[#2e3038] text-center text-white/70 ring-1 ring-white/10">
        <div>
          <div className="text-lg font-bold text-white">שגיאה בטעינת המפה</div>
          <div className="mt-2 text-sm">
            בדוק את ה-API key, ההרשאות וכתובות localhost.
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[440px] items-center justify-center rounded-2xl bg-[#2e3038] text-center text-white/70 ring-1 ring-white/10">
        <div className="text-lg font-bold text-white">טוען מפה...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={8}
      onLoad={onLoad}
      options={mapOptions}
    >
      {enrichedPoints.map((point) => (
        <Marker
          key={point.town}
          position={{ lat: point.lat, lng: point.lng }}
          onClick={() => {
            setSelectedPoint(point);
            onSelectTown?.(point.town);
          }}
        />
      ))}

      {selectedPoint && (
        <InfoWindow
          position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
          onCloseClick={() => setSelectedPoint(null)}
        >
          <div
            style={{
              minWidth: 100,
              direction: "rtl",
              textAlign: "right",
              color: "#111827",
              fontFamily: "Arial, sans-serif",
              lineHeight: 1.6,
              padding: "4px 2px",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "6px" }}>
              {selectedPoint.town}
            </div>

            <div style={{ fontSize: "14px", marginBottom: "4px" }}>
              <strong>מספר נרשמים:</strong> {selectedPoint.count}
            </div>

            <div style={{ fontSize: "13px", color: "#4b5563" }}>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}