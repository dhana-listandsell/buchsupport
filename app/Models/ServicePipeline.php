<?php

namespace App\Models;

use App\Helpers\Trait\SortingEloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Libraries\EloquentHelpers\ProductHelper;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ServicePipeline extends Model
{
    use HasFactory, SortingEloquent, ProductHelper;


    protected $table = "service_pipelines";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'service_id',
        'name',
        'default',
        'has_tracking',
        'order_no'
    ];



    /**
     * Fillable Properties
     *
     * @return array
     */
    public static function fillableProps(): array
    {
        $instance = new static();
        return $instance->fillable;
    }


    /**
     * Service
     *
     * @return HasOne
     */
    public function service(): HasOne
    {
        return $this->hasOne(Service::class, 'service_id');
    }


    /**
     * Orders
     *
     * @return HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'pipeline_id')->orderBy('order_no');
    }


}
