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

type Locale = 'en' | 'jp';

const uiCopy: Record<
  Locale,
  {
    readonly archiveNote: string;
    readonly waitingForApi: string;
    readonly switchYear: string;
    readonly featuredFallback: string;
    readonly artistsHeading: (year: number) => string;
    readonly worksHeading: (year: number) => string;
    readonly regionLabel: string;
    readonly workCountLabel: string;
    readonly artistLabel: string;
    readonly footerNote: string;
  }
> = {
  en: {
    archiveNote:
      'A cinematic portal concept powered by NENE2 APIs. The demo keeps the data public, structured, and visible through OpenAPI and local MCP boundaries.',
    waitingForApi: 'Waiting for API response',
    switchYear: 'Switch year',
    featuredFallback: 'No featured work for this year.',
    artistsHeading: (year) => `${year} participating artists`,
    worksHeading: (year) => `${year} public work list`,
    regionLabel: 'Region',
    workCountLabel: 'Works',
    artistLabel: 'Artist',
    footerNote:
      'Open field-trial demo UI. Exhibition-style fiction only; see repository README.',
  },
  jp: {
    archiveNote:
      'NENE2 API で公開展示データを扱うための試作ポータルです。OpenAPI と local MCP の境界を保ったまま、構造化されたサンプルデータを表示します。',
    waitingForApi: 'API 応答を待っています',
    switchYear: '年度切替',
    featuredFallback: 'この年度の注目作品はありません。',
    artistsHeading: (year) => `${year} 参加作家`,
    worksHeading: (year) => `${year} 作品リスト`,
    regionLabel: '地域',
    workCountLabel: '作品数',
    artistLabel: '作家',
    footerNote:
      '公開されている field trial のデモ UI です（実イベント非関連・フィクションのデータ）。README を参照してください。',
  },
};

export function App() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [locale, setLocale] = useState<Locale>('en');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [artists, setArtists] = useState<readonly ExhibitionArtist[]>([]);
  const [works, setWorks] = useState<readonly ExhibitionWork[]>([]);
  const [exhibitionError, setExhibitionError] = useState<string | null>(null);
  const [isLoadingExhibition, setIsLoadingExhibition] = useState(true);
  const featuredWork = works[0] ?? null;
  const copy = uiCopy[locale];

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
          <p className="summary">{copy.archiveNote}</p>
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
              {healthError ?? copy.waitingForApi}
            </p>
          )}
        </div>

        <div className="year-card">
          <p className="eyebrow">Season</p>
          <h2 id="exhibition-year-title">{selectedYear}</h2>
          <label>
            <span>{copy.switchYear}</span>
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
          <div className="language-toggle" aria-label="Display language">
            {(['en', 'jp'] as const).map((language) => (
              <button
                key={language}
                type="button"
                aria-pressed={locale === language}
                onClick={() => {
                  setLocale(language);
                }}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
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
            <p>{copy.featuredFallback}</p>
          )}
        </article>

        <article className="quote-card">
          <p className="eyebrow">Direction</p>
          <blockquote>
            A curated public archive with cinematic calm and luxury restraint.
          </blockquote>
        </article>
      </section>

      <section className="content-grid" aria-busy={isLoadingExhibition}>
        <section className="panel" aria-labelledby="artists-title">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Artists</p>
              <h2 id="artists-title">{copy.artistsHeading(selectedYear)}</h2>
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
                    <dt>{copy.regionLabel}</dt>
                    <dd>{artist.countryOrRegion}</dd>
                  </div>
                  <div>
                    <dt>{copy.workCountLabel}</dt>
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
              <h2 id="works-title">{copy.worksHeading(selectedYear)}</h2>
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
                    <dt>{copy.artistLabel}</dt>
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

      <footer className="site-footer">
        <div>
          <p className="eyebrow">Field Trial Build</p>
          <p>{copy.footerNote}</p>
        </div>
        <nav aria-label="Technical boundaries">
          <a href="/api/health">API</a>
          <a href="/docs/">OpenAPI</a>
          <span>MCP Ready</span>
        </nav>
      </footer>
    </main>
  );
}
