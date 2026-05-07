<?php

declare(strict_types=1);

namespace Nene2\FieldTrial;

final readonly class ExhibitionWorkCatalog
{
    /**
     * @var list<array{workId: int, artistId: int, artistDisplayName: array{en: string, jp: string}, exhibitionYear: int, title: array{en: string, jp: string}, workNumber: int}>
     */
    private const WORKS = [
        [
            'workId' => 20250101,
            'artistId' => 1,
            'artistDisplayName' => [
                'en' => 'Yoshimi Ohtani',
                'jp' => 'オオタニヨシミ',
            ],
            'exhibitionYear' => 2025,
            'title' => [
                'en' => 'Sakura Memory I',
                'jp' => 'サクラメモリー I',
            ],
            'workNumber' => 1,
        ],
        [
            'workId' => 20250102,
            'artistId' => 1,
            'artistDisplayName' => [
                'en' => 'Yoshimi Ohtani',
                'jp' => 'オオタニヨシミ',
            ],
            'exhibitionYear' => 2025,
            'title' => [
                'en' => 'Sakura Memory II',
                'jp' => 'サクラメモリー II',
            ],
            'workNumber' => 2,
        ],
        [
            'workId' => 20260101,
            'artistId' => 1,
            'artistDisplayName' => [
                'en' => 'Yoshimi Ohtani',
                'jp' => 'オオタニヨシミ',
            ],
            'exhibitionYear' => 2026,
            'title' => [
                'en' => 'Spring Light',
                'jp' => '春の光',
            ],
            'workNumber' => 1,
        ],
        [
            'workId' => 20260201,
            'artistId' => 2,
            'artistDisplayName' => [
                'en' => 'Hideyuki Mori',
                'jp' => '彩',
            ],
            'exhibitionYear' => 2026,
            'title' => [
                'en' => 'Color Field',
                'jp' => '彩の場',
            ],
            'workNumber' => 1,
        ],
    ];

    /**
     * @return array{exhibitionYear: int, works: list<array{workId: int, artistId: int, artistDisplayName: array{en: string, jp: string}, title: array{en: string, jp: string}, workNumber: int}>}
     */
    public function worksForYear(int $year): array
    {
        $works = [];

        foreach (self::WORKS as $work) {
            if ($work['exhibitionYear'] !== $year) {
                continue;
            }

            $works[] = [
                'workId' => $work['workId'],
                'artistId' => $work['artistId'],
                'artistDisplayName' => $work['artistDisplayName'],
                'title' => $work['title'],
                'workNumber' => $work['workNumber'],
            ];
        }

        return [
            'exhibitionYear' => $year,
            'works' => $works,
        ];
    }

    /**
     * @return array{exhibitionYear: int, work: array{workId: int, artistId: int, artistDisplayName: array{en: string, jp: string}, title: array{en: string, jp: string}, workNumber: int}}|null
     */
    public function workForYearAndId(int $year, int $workId): ?array
    {
        foreach (self::WORKS as $work) {
            if ($work['exhibitionYear'] !== $year || $work['workId'] !== $workId) {
                continue;
            }

            return [
                'exhibitionYear' => $year,
                'work' => [
                    'workId' => $work['workId'],
                    'artistId' => $work['artistId'],
                    'artistDisplayName' => $work['artistDisplayName'],
                    'title' => $work['title'],
                    'workNumber' => $work['workNumber'],
                ],
            ];
        }

        return null;
    }
}
