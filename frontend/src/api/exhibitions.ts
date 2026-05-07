export type LocalizedText = {
  readonly en: string;
  readonly jp: string;
};

export type ExhibitionArtist = {
  readonly artistId: number;
  readonly displayName: LocalizedText;
  readonly countryOrRegion: string;
  readonly workCount: number;
};

export type ExhibitionArtistsResponse = {
  readonly exhibitionYear: number;
  readonly artists: readonly ExhibitionArtist[];
};

export type ExhibitionWork = {
  readonly workId: number;
  readonly artistId: number;
  readonly artistDisplayName: LocalizedText;
  readonly title: LocalizedText;
  readonly workNumber: number;
};

export type ExhibitionWorksResponse = {
  readonly exhibitionYear: number;
  readonly works: readonly ExhibitionWork[];
};

const defaultApiBaseUrl = '/api';

export async function fetchExhibitionArtists(
  year: number,
  apiBaseUrl: string = import.meta.env.VITE_NENE2_API_BASE_URL ??
    defaultApiBaseUrl,
): Promise<ExhibitionArtistsResponse> {
  const payload = await fetchJson(`${apiBaseUrl}/exhibitions/${year}/artists`);

  if (!isExhibitionArtistsResponse(payload)) {
    throw new Error('Artist list response did not match the expected shape.');
  }

  return payload;
}

export async function fetchExhibitionWorks(
  year: number,
  apiBaseUrl: string = import.meta.env.VITE_NENE2_API_BASE_URL ??
    defaultApiBaseUrl,
): Promise<ExhibitionWorksResponse> {
  const payload = await fetchJson(`${apiBaseUrl}/exhibitions/${year}/works`);

  if (!isExhibitionWorksResponse(payload)) {
    throw new Error('Work list response did not match the expected shape.');
  }

  return payload;
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with HTTP ${response.status}.`);
  }

  return response.json();
}

function isExhibitionArtistsResponse(
  value: unknown,
): value is ExhibitionArtistsResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.exhibitionYear === 'number' &&
    Array.isArray(value.artists) &&
    value.artists.every(isExhibitionArtist)
  );
}

function isExhibitionArtist(value: unknown): value is ExhibitionArtist {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.artistId === 'number' &&
    isLocalizedText(value.displayName) &&
    typeof value.countryOrRegion === 'string' &&
    typeof value.workCount === 'number'
  );
}

function isExhibitionWorksResponse(
  value: unknown,
): value is ExhibitionWorksResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.exhibitionYear === 'number' &&
    Array.isArray(value.works) &&
    value.works.every(isExhibitionWork)
  );
}

function isExhibitionWork(value: unknown): value is ExhibitionWork {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.workId === 'number' &&
    typeof value.artistId === 'number' &&
    isLocalizedText(value.artistDisplayName) &&
    isLocalizedText(value.title) &&
    typeof value.workNumber === 'number'
  );
}

function isLocalizedText(value: unknown): value is LocalizedText {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.en === 'string' && typeof value.jp === 'string';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
