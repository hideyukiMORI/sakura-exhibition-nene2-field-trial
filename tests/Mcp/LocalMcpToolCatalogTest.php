<?php

declare(strict_types=1);

namespace Nene2\Tests\Mcp;

use Nene2\Mcp\LocalMcpToolCatalog;
use PHPUnit\Framework\TestCase;

final class LocalMcpToolCatalogTest extends TestCase
{
    public function testLoadsReadOnlyToolsFromCommittedCatalog(): void
    {
        $catalog = new LocalMcpToolCatalog(dirname(__DIR__, 2) . '/docs/mcp/tools.json');

        $tool = $catalog->find('getHealth');

        self::assertNotNull($tool);
        self::assertSame('read', $tool['safety']);
        self::assertSame('GET', $tool['source']['method']);
        self::assertSame('/health', $tool['source']['path']);
        self::assertSame('getHealth', $tool['source']['operationId']);
    }

    public function testLoadsExhibitionArtistsToolFromCommittedCatalog(): void
    {
        $catalog = new LocalMcpToolCatalog(dirname(__DIR__, 2) . '/docs/mcp/tools.json');

        $tool = $catalog->find('getExhibition2026Artists');

        self::assertNotNull($tool);
        self::assertSame('read', $tool['safety']);
        self::assertSame('GET', $tool['source']['method']);
        self::assertSame('/exhibitions/2026/artists', $tool['source']['path']);
        self::assertSame('getExhibition2026Artists', $tool['source']['operationId']);
        self::assertSame('#/components/schemas/ExhibitionArtistsResponse', $tool['responseSchemaRef']);
    }

    public function testLoadsExhibition2026WorksToolFromCommittedCatalog(): void
    {
        $catalog = new LocalMcpToolCatalog(dirname(__DIR__, 2) . '/docs/mcp/tools.json');

        $tool = $catalog->find('getExhibition2026Works');

        self::assertNotNull($tool);
        self::assertSame('read', $tool['safety']);
        self::assertSame('GET', $tool['source']['method']);
        self::assertSame('/exhibitions/2026/works', $tool['source']['path']);
        self::assertSame('getExhibition2026Works', $tool['source']['operationId']);
        self::assertSame('#/components/schemas/ExhibitionWorksResponse', $tool['responseSchemaRef']);
    }

    public function testLoadsExhibitionWorkDetailToolFromCommittedCatalog(): void
    {
        $catalog = new LocalMcpToolCatalog(dirname(__DIR__, 2) . '/docs/mcp/tools.json');

        $tool = $catalog->find('getExhibitionWorkByYearAndId');

        self::assertNotNull($tool);
        self::assertSame('read', $tool['safety']);
        self::assertSame('GET', $tool['source']['method']);
        self::assertSame('/exhibitions/{year}/works/{workId}', $tool['source']['path']);
        self::assertSame('getExhibitionWorkByYearAndId', $tool['source']['operationId']);
        self::assertSame('#/components/schemas/ExhibitionWorkDetailResponse', $tool['responseSchemaRef']);
    }
}
