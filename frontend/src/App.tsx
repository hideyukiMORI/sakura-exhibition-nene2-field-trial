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
  const featuredWork = works[0] ?? null;

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
        <div className="hero-copy">
          <p className="eyebrow">SAKURA Exhibition Field Trial</p>
          <h1>Archive of light, form, and public works.</h1>
          <p className="summary">
            A cinematic portal concept powered by NENE2 APIs. The demo keeps the
            data public, structured, and visible through OpenAPI and local MCP
            boundaries.
          </p>
        </div>

        <div className="hero-poster" aria-label="Featured exhibition poster">
          <span className="poster-year">{selectedYear}</span>
          <span className="poster-line" />
          <p>Public Exhibition Index</p>
        </div>
      </section>

      <section className="command-deck" aria-labelledby="exhibition-year-title">
        <div className="status-card">
          <p className="eyebrow">Backend</p>
          {health !== null ? (
            <p className="status-message is-ok">
              {health.service} / <strong>{health.status}</strong>
            </p>
          ) : (
            <p className="status-message">
              {healthError ?? 'Waiting for API response'}
            </p>
          )}
        </div>

        <div className="year-card">
          <p className="eyebrow">Season</p>
          <h2 id="exhibition-year-title">{selectedYear}</h2>
          <label>
            <span>Switch year</span>
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
        </div>

        <div className="metric-card">
          <p className="eyebrow">Index</p>
          <dl>
            <div>
              <dt>Artists</dt>
              <dd>{artists.length}</dd>
            </div>
            <div>
              <dt>Works</dt>
              <dd>{works.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      {exhibitionError !== null ? (
        <section className="status-panel" role="alert">
          <p className="status-message is-error">{exhibitionError}</p>
        </section>
      ) : null}

      <section className="feature-grid" aria-busy={isLoadingExhibition}>
        <article className="feature-card">
          <p className="eyebrow">Featured Work</p>
          {featuredWork !== null ? (
            <>
              <h2>{featuredWork.title.en}</h2>
              <p>{featuredWork.title.jp}</p>
              <dl>
                <div>
                  <dt>Artist</dt>
                  <dd>{featuredWork.artistDisplayName.en}</dd>
                </div>
                <div>
                  <dt>Archive ID</dt>
                  <dd>{featuredWork.workId}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p>No featured work for this year.</p>
          )}
        </article>

        <article className="quote-card">
          <p className="eyebrow">Direction</p>
          <blockquote>
            A restrained public archive with film-poster drama and luxury
            editorial rhythm.
          </blockquote>
        </article>
      </section>

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
