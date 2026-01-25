<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<array-key,mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'emailVerified' => isset($this->email_verified_at),
            'twoFactorEnabled' => $this->hasEnabledTwoFactorAuthentication(),
            'twoFactorConfirmed' => !is_null($this->two_factor_confirmed_at),
        ];
    }
}
