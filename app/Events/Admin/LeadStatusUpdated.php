<?php

namespace App\Events\Admin;


use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadStatusUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $leadId;
    public string $leadStatus;

    /**
     * Create a new event instance.
     */
    public function __construct(int $leadId, string $leadStatus)
    {
        $this->leadId = $leadId;
        $this->leadStatus = $leadStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
