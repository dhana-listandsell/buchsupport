<?php

namespace App\CommandProcess\Admin\Invoice;

use Rosamarsky\CommandBus\Command;

class CreateCustomerAutoInvoice implements Command
{
    public int $customerId;

    public function __construct(int $customerId)
    {
        $this->customerId   = $customerId;
    }
}
