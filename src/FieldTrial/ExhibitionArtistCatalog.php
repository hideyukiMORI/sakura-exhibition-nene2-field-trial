<?php

declare(strict_types=1);

namespace Nene2\FieldTrial;

final readonly class ExhibitionArtistCatalog
{
    /**
     * @var list<array{artistId: int, displayName: array{en: string, jp: string}, countryOrRegion: string}>
     */
    private const ARTISTS = [
        [
            'artistId' => 1,
            'displayName' => [
                'en' => 'Yoshimi Ohtani',
                'jp' => 'オオタニヨシミ',
            ],
            'countryOrRegion' => 'Japan',
        ],
        [
            'artistId' => 2,
            'displayName' => [
                'en' => 'Hideyuki Mori',
                'jp' => '彩',
            ],
            'countryOrRegion' => 'Japan',
        ],
    ];

    /**
     * @var list<array{artistId: int, exhibitionYear: int, workCount: int}>
     */
    private const EXHIBITION_YEARS = [
        [
            'artistId' => 1,
            'exhibitionYear' => 2025,
            'workCount' => 2,
        ],
        [
            'artistId' => 1,
            'exhibitionYear' => 2026,
            'workCount' => 1,
        ],
        [
            'artistId' => 2,
            'exhibitionYear' => 2026,
            'workCount' => 1,
        ],
    ];

    /**
     * @return array{exhibitionYear: int, artists: list<array{artistId: int, displayName: array{en: string, jp: string}, countryOrRegion: string, workCount: int}>}
     */
    public function artistsForYear(int $year): array
    {
        $artistsById = [];

        foreach (self::ARTISTS as $artist) {
            $artistsById[$artist['artistId']] = $artist;
        }

        $artists = [];

        foreach (self::EXHIBITION_YEARS as $exhibitionYear) {
            if ($exhibitionYear['exhibitionYear'] !== $year) {
                continue;
            }

            $artist = $artistsById[$exhibitionYear['artistId']];

            $artists[] = [
                ...$artist,
                'workCount' => $exhibitionYear['workCount'],
            ];
        }

        return [
            'exhibitionYear' => $year,
            'artists' => $artists,
        ];
    }
}
