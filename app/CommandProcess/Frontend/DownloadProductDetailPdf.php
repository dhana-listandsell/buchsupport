<?php

namespace App\CommandProcess\Frontend;

use Rosamarsky\CommandBus\Command;

class DownloadProductDetailPdf implements Command
{
    public int $userId;

    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }
}
