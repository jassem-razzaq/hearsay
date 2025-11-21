import { useState, useEffect } from "react";
import microphoneIcon from "../assets/microphone.png";

type SearchType = "podcasts" | "users";

type PodcastFilters = {
  genre: string;
  language: string;
  platform: string;
  year: string;
  host: string;
  guest: string;
};

export default function NavBar() {
  const [searchType, setSearchType] = useState<SearchType>("podcasts");
  const [searchInput, setSearchInput] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [hosts, setHosts] = useState<string[]>([]);
  const [guests, setGuests] = useState<string[]>([]);
  const [hostSearch, setHostSearch] = useState<string>("");
  const [filteredHosts, setFilteredHosts] = useState<string[]>([]);
  const [guestSearch, setGuestSearch] = useState<string>("");
  const [filteredGuests, setFilteredGuests] = useState<string[]>([]);
  const [podcastFilters, setPodcastFilters] = useState<PodcastFilters>({
    genre: "",
    language: "",
    platform: "",
    year: "",
    host: "",
    guest: "",
  });

  useEffect(() => {
    async function loadFilters() {
      try {
        const response: Response = await fetch("http://127.0.0.1:8000/podcasts/filters");
        const data = await response.json();
        setGenres(data.genres);
        setLanguages(data.languages);
        setPlatforms(data.platforms);
        setHosts(data.hosts);
        setGuests(data.guests);
        setFilteredHosts(data.hosts);
        setFilteredGuests(data.guests);
      } catch (error) {
        console.log("Failed to fetch filters", error);
      }
    }
    loadFilters();
  }, []);

  function handleHostSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setHostSearch(value);

    if (value.trim() === "") {
      setFilteredHosts([]);
    } else {
      setFilteredHosts(hosts.filter((h) => h.toLowerCase().includes(value.toLowerCase())));
    }
  }

  function handleGuestSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setGuestSearch(value);

    if (value.trim() === "") {
      setFilteredGuests([]);
    } else {
      setFilteredGuests(guests.filter((g) => g.toLowerCase().includes(value.toLowerCase())));
    }
  }

  return (
    <div className="flex bg-yellow-100 h-16 sticky top-0 left-0 justify-between items-center pr-3">
      <img src={microphoneIcon} className="w-15 h-14.5" />
      <button className="border">test</button>
      <div>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value as SearchType)}>
          <option value="podcasts">Podcasts</option>
          <option value="users">Users</option>
        </select>
        <input
          className="w-100 h-7 px-2"
          type="search"
          placeholder={`Search ${searchType} ${searchType === "users" ? "by username" : ""}`}
        />

        <button onClick={() => setShowFilters(!showFilters)}>filters</button>
        <div className="relative">
          {showFilters && (
            <div className="absolute bg-cyan-100">
              <label>Genre</label>
              <select onChange={(e) => setPodcastFilters({ ...podcastFilters, genre: e.target.value })}>
                <option value="">Any</option>
                {genres.map((genre) => (
                  <option key={genre} value={podcastFilters.genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <label>Language</label>
              <select onChange={(e) => setPodcastFilters({ ...podcastFilters, language: e.target.value })}>
                <option value="">Any</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <label>Platform</label>
              <select onChange={(e) => setPodcastFilters({ ...podcastFilters, platform: e.target.value })}>
                <option value="">Any</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
              <label>Year</label>
              <input
                type="number"
                min={0}
                max={9999}
                onChange={(e) => setPodcastFilters({ ...podcastFilters, genre: e.target.value })}
              />
              <label>Host</label>
              <input type="text" value={hostSearch} onChange={handleHostSearch} placeholder="Search for a host" />
              {hostSearch && (
                <ul>
                  {filteredHosts.slice(0, 3).map((host) => (
                    <li
                      key={host}
                      onClick={() => {
                        setPodcastFilters({ ...podcastFilters, host: host });
                        setHostSearch(host);
                        setFilteredHosts([]);
                      }}
                    >
                      {host}
                    </li>
                  ))}
                </ul>
              )}
              <label>Guest</label>
              <input type="text" value={guestSearch} onChange={handleGuestSearch} placeholder="Search for a guest" />
              {guestSearch && (
                <ul>
                  {filteredGuests.slice(0, 3).map((guest) => (
                    <li
                      key={guest}
                      onClick={() => {
                        setPodcastFilters({ ...podcastFilters, guest: guest });
                        setGuestSearch(guest);
                        setFilteredGuests([]);
                      }}
                    >
                      {guest}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <button>log in</button>
        <button>register</button>
      </div>
    </div>
  );
}
