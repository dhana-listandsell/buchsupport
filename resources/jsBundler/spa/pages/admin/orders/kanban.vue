<template>
    <div>
        <Breadcrumbs :menu-items="breadcrumbConfig.service.edit(serviceId)" :title="getPipelineTitle()"/>

        <div class="container-fluid">

            <LeadConversionModal :pipeline-id="selectedPipelineId"
                                 :order-id="selectedOrderId"
                                 @close="closeLeadConversionModal"
                                 @reload="getServicePipelines"
                                 v-if="leadConversionModal"
            ></LeadConversionModal>

            <div class="clearfix m-b-10">
                <button class="btn btn-sm btn-primary pull-right"
                    @click.prevent="getServicePipelines"
                >
                    <i class="fa fa-refresh"></i>
                </button>
            </div>

            <div class="pipeline-container">

                <div class="pipeline-card" v-for="(pipeline, pipelineIndex) in pipelines" :key="pipeline.id">
                    <div class="pipeline-title">
                        {{ pipeline.name }}
                    </div>
                    <template v-if="pipeline.has_option">
                        <div v-for="status in PipelineStatus">
                            <VueDraggableNext
                                :options="pipeline"
                                class="list-group pipeline-last-group dragArea"
                                :list="[]"
                                :scroll-sensitivity="200"
                                group="orders"
                                :key="status.id"
                                :item-key="'pipeline_'+pipeline.id+status.id"
                                ghost-class="ghost"
                                @change="moveToLastPipeline(pipeline.id, status.id, $event)"
                                :move="checkValidation"
                            >
                                {{ $t(status.name) }}
                            </VueDraggableNext>
                        </div>
                    </template>
                    <template v-else>
                        <VueDraggableNext
                            tag="ul"
                            v-bind="dragOptions"
                            :options="pipeline"
                            class="list-group pipeline-group dragArea"
                            :list="pipeline.orders"
                            :scroll-sensitivity="200"
                            group="orders"
                            :key="pipeline.id"
                            :id="pipeline.id"
                            :item-key="'pipeline_'+pipeline.name"
                            ghost-class="ghost"
                            @change="sortPipeline(pipelineIndex, pipeline.id, $event)"
                            :move="checkValidation"
                        >
                            <li class="list-group-item draggable-item pipeline-item"
                                :key="order.id"
                                v-for="order in pipeline.orders"
                            >
                                <div class="m-b-10 pipeline-item-title">
                                    <a href="#" @click.prevent="goToOrderDetail(order.id)">{{ $t('Order')+" #"+order.id }}</a>
                                </div>
                                <table class="pipeline-table">
                                    <tr>
                                        <td>{{ $t('Customer') }}</td>
                                        <td>
                                            <ClickableCustomer class="pipeline-user" :user="order.user"></ClickableCustomer>
                                        </td>
                                    </tr>
                                    <tr v-if="order.lead">
                                        <td>{{ $t('Lead') }}</td>
                                        <td>
                                            {{ order.lead.first_name + " " + order.lead.last_name}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('Total') }}</td>
                                        <td>
                                            <TextCurrency :amount="order.total"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('Order Date') }}</td>
                                        <td>{{ HelperUtils.getDateTimeInGerman(order.order_at) }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('Shipment No') }}</td>
                                        <td>{{ order.shipment_no }}</td>
                                    </tr>
                                </table>
                            </li>
                        </VueDraggableNext>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {ref, onMounted, computed} from "vue";
import breadcrumbConfig from "@/storage/data/breadcrumbs";
import axios from "@/libraries/utils/clientapi/axios";
import route from '@/libraries/utils/ZiggyRoute';
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useMeta} from "vue-meta";
import {VueDraggableNext} from "vue-draggable-next";
import __has from "lodash/has";
import HelperUtils from "../../../libraries/utils/helpers/HelperUtils";
import TextCurrency from "@/components/common/TextCurrency.vue";
import LeadConversionModal from "@/components/admin/Order/LeadConversionModal.vue";
import BtModalHelper from "@/libraries/utils/BtModalHelper";
import {useServiceStore} from "@/storage/store/services";
import ClickableCustomer from "@/components/admin/Customer/ClickableCustomer.vue";
import Notifier from "@/libraries/utils/Notifier";
import PipelineStatus from "@/storage/data/PipelineStatus";

const router = useRouter();
const routes = useRoute();
const {t: $t} = useI18n();
useMeta({title: $t('Pipeline')});

const dragOptions = computed(() => {
    return {
        group: {name: 'g1'},
        scrollSensitivity: 0.1,
        forceFallback: true
    };
});


const serviceId = routes.params.id;

const form = ref(null);
const pipelines = ref([]);
const selectedOrderId = ref(null);
const selectedPipelineId = ref(null);
const leadConversionModal = ref(null);

function getServicePipelines() {
    axios.get(route('admin.orders.pipeline', {id: serviceId})).then((response) => {
        if (response.status === 200) {
            pipelines.value = response.data;
        }
    });
}

function checkValidation(event) {

    /*const order = event.draggedContext.element;

    const toPipeline = event.to.__draggable_component__.options;

    if (getNextPipelineId(order.pipeline_id) === toPipeline.id) {
        Notifier.toastError('Pipeline can be moved only one step or sequential step');
        return false;
    }
    
    if (toPipeline.has_conversion && !order.user_id) {
        Notifier.toastError('Add customer before moving to ' + toPipeline.name);
        return false;
    }

    if (toPipeline.has_tracking && !order.shipment_no) {
        Notifier.toastError('Update shipment no before moving to ' + toPipeline.name);
        return false;
    }

    if (getOrderPipelineIds(order).includes(toPipeline.id)) {
        Notifier.toastError('Cannot update to previous pipeline '+ toPipeline.name);
        return false;
    }*/

    return true;
}

function getNextPipelineId(pipelineId) {
    let pipelineIndex = pipelines.value.findIndex(pipeline => pipeline.id === pipelineId);
    if (pipelineIndex === pipelines.value.length - 1) {
        return 0;
    }
    return ++pipelineIndex;
}

function getOrderPipelineIds(order) {

    if (order.stages.length > 0) {
        return order.stages.map(stage => stage.pipeline_id);
    }

    return [];
}

function showRelatedPopup(event, pipeline) {
    /*const toPipeline = event.to.__draggable_component__.options;
    openLeadConversionModal(toPipeline.id, order.id);*/
}

function openLeadConversionModal(pipelineId, orderId) {
    if (leadConversionModal.value) {
        return;
    }
    selectedPipelineId.value = pipelineId;
    selectedOrderId.value = orderId;
    leadConversionModal.value = true;
    BtModalHelper.open();
}

function closeLeadConversionModal() {
    leadConversionModal.value = false;
    BtModalHelper.close();
}


function sortPipeline(pipelineIndex, pipelineId, event) {

    if (__has(event, 'added')) {
        axios.post(route('admin.orders.change_pipeline'), {
            order_id: event.added.element.id,
            service_id: serviceId,
            pipeline_id: pipelineId,
            order_no: ++event.added.newIndex,
        }).then((response) => {
            if (response.status === 200) {
                Notifier.toastSuccess(response.data.message);
            }
            getServicePipelines();
        });
    }
    /*if (__has(event, 'moved')) {
        axios.post(route('admin.orders.sort'), {
            pipeline_id: pipelineId,
            order_ids: getSortedOrderIds(pipelines.value[pipelineIndex]['orders']),
        })
            .then(response => {
            });
    }*/
}

function moveToLastPipeline(pipelineId, status, event) {
    if (__has(event, 'added')) {
        axios.post(route('admin.orders.add_to_last_pipeline'), {
            order_id: event.added.element.id,
            pipeline_id: pipelineId,
            service_id: serviceId,
            status: status,
        }).then((response) => {
            if (response.status === 200) {
                Notifier.toastSuccess(response.data.message);
            }
            getServicePipelines();
        });
    }
}

function getSortedOrderIds(orders) {
    return orders.map(order => order.id);
}

function getOrderUser(order) {
    if (order.user) {
        return order.user.first_name + " " + order.user.last_name;
    }
    return "-";
}

function getPipelineTitle() {
    const service = useServiceStore().services.find((service) => service.id == serviceId);
    return (service ? service.name : "");
}

function goToOrderDetail(orderId) {
    return router.push({ name: 'admin_order_detail', params: { id: orderId } });
}

onMounted(async () => {
    await getServicePipelines();
})
</script>
<style>
.ghost.draggable-item {
    opacity: 0.5;
    transform: rotate(5deg);
    background: #55aed8;
}
.ghost-indented {
    margin-left: 27px;
    background: green;
}
</style>