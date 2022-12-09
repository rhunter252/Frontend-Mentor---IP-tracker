import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import arrow from "./assets/icon-arrow.svg";
import bgImage from "./assets/pattern-bg.png";
import Markerposition from "./Markerposition";

const App = () => {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${
            import.meta.env.VITE_API_KEY
          }&ipAddress=192.212.174.101`
        );
        const data = await res.json();
        setAddress(data);
        console.log(data);
      };
      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  const getEnteredIpAddress = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${
        import.meta.env.VITE_API_KEY
      }&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredIpAddress();
    setIpAddress("");
  };

  return (
    <>
      <section>
        <div className="absolute">
          <img
            className="w-screen h-80 object-cover sm:h-96"
            src={bgImage}
            alt=""
          />
        </div>
        <article className="relative p-8">
          <h1 className="text-2xl text-white text-center font-bold p-8 tracking-wide">
            IP Address Tracker
          </h1>

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="flex justify-center max-w-xl mx-auto"
          >
            <input
              type="text"
              name="ip-address"
              id="ip-address"
              placeholder="Search for any IP address or domain"
              required
              className="py-2.5 px-4 rounded-l-lg w-full"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black py-4 px-4 rounded-r-lg hover:bg-slate-700"
            >
              <img src={arrow} alt="arrow image" />
            </button>
          </form>
        </article>

        {address && (
          <>
            <article
              className="bg-white rounded-xl p-8 shadow max-w-6xl mx-auto grid grid-cols-1 gap-5 text-center md:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:text-left -mb-10 relative lg:-mb-32"
              style={{ zIndex: "1000" }}
            >
              <div className="lg:border-r lg:border-slate-600">
                <h2 className="uppercase text-sm mb-3 tracking-wider">
                  IP Address
                </h2>
                <p className="text-lg font-bold text-slate-900 md:text-xl xl:text-2xl">
                  {address.ip}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-600">
                <h2 className="uppercase text-sm mb-3">Location</h2>
                <p className="text-lg font-bold text-slate-900 md:text-xl xl:text-2xl">
                  {address.location.city}, {address.location.region}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-600">
                <h2 className="uppercase text-sm mb-3">Timezone</h2>
                <p className="text-lg font-bold text-slate-900 md:text-xl xl:text-2xl">
                  {address.location.timezone}
                </p>
              </div>
              <div>
                <h2 className="uppercase text-sm mb-3">ISP</h2>
                <p className="text-lg font-bold text-slate-900 md:text-xl xl:text-2xl">
                  {address.isp}
                </p>
              </div>
            </article>

            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "100vh" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Markerposition address={address} />
            </MapContainer>
          </>
        )}
      </section>
    </>
  );
};

export default App;
