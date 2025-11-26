import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type SearchType = "podcasts" | "users" | "episodes";

type SearchFilters = {
  name: string;
  genre: string;
  language: string;
  platform: string;
  year: string;
  host: string;
  guest: string;
};

type SearchBarProps = {
  searchType: string;
  onSearch: () => void;
  podcastID?: string;
};

const API_URL_BASE = import.meta.env.VITE_API_URL;

export default function NewSearchBar({ searchType, onSearch, podcastID }: SearchBarProps) {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [hosts, setHosts] = useState<string[]>([]);
  const [guests, setGuests] = useState<string[]>([]);
  const [filteredHosts, setFilteredHosts] = useState<string[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<string[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: "",
    genre: "",
    language: "",
    platform: "",
    year: "",
    host: "",
    guest: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function loadFilters() {
      try {
        let data;
        if (searchType === "podcasts") {
          const response = await fetch(`${API_URL_BASE}/podcasts/filters`);
          data = await response.json();
          setGenres(data.genres);
          setLanguages(data.languages);
          setPlatforms(data.platforms);
        } else if (searchType === "episodes") {
          const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/filters`);
          data = await response.json();
        }
        if (data) {
          setHosts(data.hosts ?? []);
          setGuests(data.guests ?? []);
          setFilteredHosts(data.hosts ?? []);
          setFilteredGuests(data.guests ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch filters", error);
      }
    }
    loadFilters();
  }, [searchType, podcastID]);

  async function handleSearch() {
    const params = new URLSearchParams();
    params.append("type", searchType);

    if (searchType === "episodes") {
      Object.entries(searchFilters).forEach(([filter, value]) => {
        if (value) {
          params.append(filter, value);
        }
      });
      navigate(`/podcasts/${podcastID}/episodes?${params.toString()}`);
      return;
    }

    if (searchType === "podcasts") {
      Object.entries(searchFilters).forEach(([filter, value]) => {
        if (value) {
          params.append(filter, value);
        }
      });
    } else {
      params.append("name", searchFilters.name);
    }
    navigate(`/results?${params.toString()}`);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleReset() {
    setSearchFilters({ name: "", genre: "", language: "", platform: "", year: "", host: "", guest: "" });
  }

  function handleHostSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchFilters({ ...searchFilters, host: value });

    if (value.trim() === "") {
      setFilteredHosts([]);
    } else {
      setFilteredHosts(hosts.filter((h) => h.toLowerCase().includes(value.toLowerCase())));
    }
  }

  function handleGuestSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchFilters({ ...searchFilters, guest: value });

    if (value.trim() === "") {
      setFilteredGuests([]);
    } else {
      setFilteredGuests(guests.filter((g) => g.toLowerCase().includes(value.toLowerCase())));
    }
  }

  return (
    <>
      <button onClick={handleSearch}>Search</button>
      <input
        className="w-100 h-7 px-2"
        type="search"
        value={searchFilters.name}
        onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
        placeholder="Search for..."
        onKeyDown={handleKeyPress}
      ></input>
      <button onClick={() => setShowFilters(!showFilters)}>Filters</button>
      {showFilters && (
        <div className="bg-amber-400">
          {searchType === "podcasts" && (
            <div className="absolute bg-cyan-100">
              <label>Genre</label>
              <select
                value={searchFilters.genre}
                onChange={(e) => setSearchFilters({ ...searchFilters, genre: e.target.value })}
              >
                <option value="">Any</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <label>Language</label>
              <select
                value={searchFilters.language}
                onChange={(e) => setSearchFilters({ ...searchFilters, language: e.target.value })}
              >
                <option value="">Any</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <label>Platform</label>
              <select
                value={searchFilters.platform}
                onChange={(e) => setSearchFilters({ ...searchFilters, platform: e.target.value })}
              >
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
                value={searchFilters.year}
                onChange={(e) => setSearchFilters({ ...searchFilters, year: e.target.value })}
              />
              <label>Host</label>
              <input
                type="text"
                value={searchFilters.host}
                onChange={handleHostSearch}
                placeholder="Search for a host"
              />
              {searchFilters.host && (
                <ul>
                  {filteredHosts.slice(0, 3).map((host) => (
                    <li
                      key={host}
                      onClick={() => {
                        setSearchFilters({ ...searchFilters, host: host });
                        setFilteredHosts([]);
                      }}
                    >
                      {host}
                    </li>
                  ))}
                </ul>
              )}
              <label>Guest</label>
              <input
                type="text"
                value={searchFilters.guest}
                onChange={handleGuestSearch}
                placeholder="Search for a guest"
              />
              {searchFilters.guest && (
                <ul>
                  {filteredGuests.slice(0, 3).map((guest) => (
                    <li
                      key={guest}
                      onClick={() => {
                        setSearchFilters({ ...searchFilters, guest: guest });
                        setFilteredGuests([]);
                      }}
                    >
                      {guest}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={handleReset}>Reset</button>
            </div>
          )}
          {searchType === "episodes" && (
            <div className="absolute bg-cyan-100">
              <label>Year</label>
              <input
                type="number"
                min={0}
                max={9999}
                value={searchFilters.year}
                onChange={(e) => setSearchFilters({ ...searchFilters, year: e.target.value })}
              />
              <label>Host</label>
              <input
                type="text"
                value={searchFilters.host}
                onChange={handleHostSearch}
                placeholder="Search for a host"
              />
              {searchFilters.host && (
                <ul>
                  {filteredHosts.slice(0, 3).map((host) => (
                    <li
                      key={host}
                      onClick={() => {
                        setSearchFilters({ ...searchFilters, host: host });
                        setFilteredHosts([]);
                      }}
                    >
                      {host}
                    </li>
                  ))}
                </ul>
              )}
              <label>Guest</label>
              <input
                type="text"
                value={searchFilters.guest}
                onChange={handleGuestSearch}
                placeholder="Search for a guest"
              />
              {searchFilters.guest && (
                <ul>
                  {filteredGuests.slice(0, 3).map((guest) => (
                    <li
                      key={guest}
                      onClick={() => {
                        setSearchFilters({ ...searchFilters, guest: guest });
                        setFilteredGuests([]);
                      }}
                    >
                      {guest}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={handleReset}>Reset</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
