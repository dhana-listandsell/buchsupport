<div class="js-cookie-consent cookie-consent">

    <span class="cookie-consent__message">
        {!! trans('cookieConsent::texts.message') !!}
    </span>

    <button class="js-cookie-consent-agree cookie-consent__agree">
        {{ trans('cookieConsent::texts.agree') }}
    </button>

    <i style="margin-left: 20px;" class="fa fa-close" onclick="$('.js-cookie-consent').remove();"></i>

</div>