<?php

namespace App\Http\Requests\Admin\Lead;

use App\Http\Rules\Admin\IfSalespersonAuthorizedForLead;
use Illuminate\Foundation\Http\FormRequest;

class GetLeadCustomerOrdersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'lead_id' => ['required', new IfSalespersonAuthorizedForLead()]
        ];
    }


    /**
     * Validation Messages
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'lead_id.required' => trans('Lead is required'),
        ];
    }
}
