<?php

namespace App\Http\Requests\Admin\ProductCategory;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductCategoryRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name'      => 'required|unique:product_categories',
            'is_active' => 'required',
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
            'name.required'     => trans('Category name is required'),
            'name.unique'       => trans('Category name is already taken'),
            'is_active.required' => __('Category status is required'),
        ];
    }
}
