import "../styles/globals.css"; // ✅ Fixed Import
import RoadblockAd from "../components/RoadblockAd"; // ✅ Check Path

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <RoadblockAd /> {/* ✅ Roadblock Ad Always Visible */}
    </>
  );
  
}
