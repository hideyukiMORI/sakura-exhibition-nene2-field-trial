import { useEffect, useState } from 'react';

import './App.css';
import {
  fetchExhibitionArtists,
  fetchExhibitionWorks,
  type ExhibitionArtist,
  type ExhibitionWork,
} from './api/exhibitions';
import { fetchHealth, type HealthResponse } from './api/health';

const exhibitionYears = [2026, 2025] as const;

export function App() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [artists, setArtists] = useState<readonly ExhibitionArtist[]>([]);
  const [works, setWorks] = useState<readonly ExhibitionWork[]>([]);
  const [exhibitionError, setExhibitionError] = useState<string | null>(null);
  const [isLoadingExhibition, setIsLoadingExhibition] = useState(true);

  useEffect(() => {
    let isActive = true;

    fetchHealth()
      .then((response) => {
        if (isActive) {
          setHealth(response);
          setHealthError(null);
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setHealth(null);
          setHealthError(
            error instanceof Error ? error.message : 'Unknown error',
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    Promise.all([
      fetchExhibitionArtists(selectedYear),
      fetchExhibitionWorks(selectedYear),
    ])
      .then(([artistResponse, workResponse]) => {
        if (isActive) {
          setArtists(artistResponse.artists);
          setWorks(workResponse.works);
          setExhibitionError(null);
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setArtists([]);
          setWorks([]);
          setExhibitionError(
            error instanceof Error ? error.message : 'Unknown error',
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingExhibition(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedYear]);

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">SAKURA Exhibition Field Trial</p>
        <h1>Public exhibition data, served by NENE2.</h1>
        <p className="summary">
          A small browser demo for the private NENE2 field trial. It reads the
          same JSON APIs that are documented in OpenAPI and exposed to local MCP
          tools.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="backend-status-title">
        <div>
          <p className="eyebrow">Backend Integration</p>
          <h2 id="backend-status-title">Health API status</h2>
        </div>

        {health !== null ? (
          <p className="status-message is-ok">
            {health.service} responded with <strong>{health.status}</strong>.
          </p>
        ) : (
          <p className="status-message">
            {healthError ??
              'Waiting for the NENE2 backend health endpoint to respond.'}
          </p>
        )}
      </section>

      <section className="toolbar" aria-labelledby="exhibition-year-title">
        <div>
          <p className="eyebrow">Exhibition Year</p>
          <h2 id="exhibition-year-title">Browse sandbox entries</h2>
        </div>
        <label>
          <span>Year</span>
          <select
            value={selectedYear}
            onChange={(event) => {
              setIsLoadingExhibition(true);
              setSelectedYear(Number(event.target.value));
            }}
          >
            {exhibitionYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </section>

      {exhibitionError !== null ? (
        <section className="status-panel" role="alert">
          <p className="status-message is-error">{exhibitionError}</p>
        </section>
      ) : null}

      <section className="content-grid" aria-busy={isLoadingExhibition}>
        <section className="panel" aria-labelledby="artists-title">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Artists</p>
              <h2 id="artists-title">{selectedYear} participating artists</h2>
            </div>
            <span className="count-pill">{artists.length}</span>
          </div>

          <div className="list">
            {artists.map((artist) => (
              <article className="list-item" key={artist.artistId}>
                <div>
                  <h3>{artist.displayName.en}</h3>
                  <p>{artist.displayName.jp}</p>
                </div>
                <dl>
                  <div>
                    <dt>Region</dt>
                    <dd>{artist.countryOrRegion}</dd>
                  </div>
                  <div>
                    <dt>Works</dt>
                    <dd>{artist.workCount}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="works-title">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Works</p>
              <h2 id="works-title">{selectedYear} public work list</h2>
            </div>
            <span className="count-pill">{works.length}</span>
          </div>

          <div className="list">
            {works.map((work) => (
              <article className="list-item" key={work.workId}>
                <div>
                  <h3>{work.title.en}</h3>
                  <p>{work.title.jp}</p>
                </div>
                <dl>
                  <div>
                    <dt>Artist</dt>
                    <dd>{work.artistDisplayName.en}</dd>
                  </div>
                  <div>
                    <dt>No.</dt>
                    <dd>{work.workNumber}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
