<?php

namespace App\CommandProcess\Admin\Customer;


use App\Services\Admin\CustomerService;
use Rosamarsky\CommandBus\Command;
use Rosamarsky\CommandBus\Handler;

class UpdateCustomerActiveStatusHandler implements Handler
{

    public CustomerService $dbService;

    public function __construct(CustomerService $dbService)
    {
        $this->dbService = $dbService;
    }

    public function handle(Command $command)
    {
        $this->dbService->updateActiveStatus($command->customerId, $command->status);
    }
}
