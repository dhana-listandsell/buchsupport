<template>
    <div>
        <footer class="footer" :class="footer == 'footer-dark' ? 'footer-dark' : ''">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12 footer-copyright text-center">
                        <p class="mb-0">Copyright {{ (new Date).getFullYear() }} © List&Sell</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
import {
    useLayoutStore
} from '@/storage/store/layout';
import json from '@/storage/data/menu';

export default {

    data() {
        return {
            customizer: false,
            data: 'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(json)),
        };
    },
    computed: {

        footer() {
            return useLayoutStore().footer
        }
    }
};
</script>
