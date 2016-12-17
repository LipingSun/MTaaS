angular.module('myApp').controller('DashboardController', ['emulatorServiceV2', 'deviceServiceV2', 'hubServiceV2', '$http', function (emulatorServiceV2, deviceServiceV2, hubServiceV2, $http) {

    const api_v1 = '/api/v1';

    var ctrl = this;

    ctrl.showWhich = null;
    ctrl.emulators = [];
    ctrl.devices = [];
    ctrl.hubs = [];

    var getRealTimeBill = function () {
        $http({
            method: 'GET',
            url: api_v1 + '/bill_plan'
            // params: {"now_date":now_date}
        }).success(function (res) {
            // alert(res.curr_plan);
            $http({
                method: 'GET',
                url: api_v1 + '/realTimeBills',
                params: {"curr_plan": res.curr_plan}
            }).success(function (res) {
                ctrl.bills = res;
            });
        });
    };

    getRealTimeBill();

    var draw = function () {

        deviceServiceV2.findAllByOccupant(function (deviceData) {
            ctrl.devices = deviceData.payload;
            ctrl.devices_num = ctrl.devices.length;

            emulatorServiceV2.get(function (emulatorData) {
                ctrl.emulators = emulatorData.payload.filter(function (emulator) {
                    return emulator.status === 'processing' || emulator.status === 'occupied';
                });
                ctrl.emulators_num = ctrl.emulators.length;

                hubServiceV2.get(function (hubData) {
                    ctrl.hubs = hubData.payload.filter(function (hub) {
                        return hub.status === 'processing' || hub.status === 'occupied';
                    });
                    ctrl.hubs_num = ctrl.hubs.length;

                    //if (ctrl.emulators_num + ctrl.devices_num + ctrl.hubs_num > 0) {
                    //    ctrl.showWhich = 'topology';
                    //} else {
                    //    ctrl.showWhich = 'quick_start';
                    //}
                    ctrl.showWhich = 'topology';

                    var nodes = [];
                    var edges = [];

                    var DIR = '../../../images/resource/';
                    var EDGE_LENGTH_MAIN = 150;
                    var EDGE_LENGTH_SUB = 50;

                    // alert(ctrl.hubs.length+' '+ctrl.emulators.length);

                    var wifi_node = 0;

                    for (var i = 0; i < ctrl.hubs.length; i++) {

                        wifi_node++;
                        nodes.push({
                            id: ctrl.hubs[i].id,
                            label: 'HUB: ' + ctrl.hubs[i].name,
                            image: DIR + 'HUB.png',
                            shape: 'image'
                        });


                        //alert(ctrl.hubs[i].network_type);
                        if (ctrl.hubs[i].network_type === 'WiFi') {
                            nodes.push({
                                id: wifi_node,
                                label: 'WIFI',
                                image: DIR + 'WIFI.png',
                                shape: 'image'
                            });

                            edges.push({from: ctrl.hubs[i].id, to: wifi_node, length: EDGE_LENGTH_MAIN});
                        }
                    }

                    for (var i = 0; i < ctrl.emulators.length; i++) {
                        nodes.push({
                            id: ctrl.emulators[i]._id,
                            label: 'Emulator: ' + ctrl.emulators[i].spec.system,
                            image: DIR + 'Hardware-My-PDA-02-icon.png',
                            shape: 'image'
                        });


                        //alert(ctrl.emulators[i].attached_hub);
                        if (ctrl.emulators[i].hub_id !== null) {

                            if (ctrl.emulators[i].hub_port) {
                                edges.push({
                                    from: ctrl.emulators[i].hub_id,
                                    to: ctrl.emulators[i]._id,
                                    label: ctrl.emulators[i].hub_port,
                                    font: {align: 'horizontal'},
                                    length: EDGE_LENGTH_MAIN
                                });
                            }
                            else {
                                edges.push({
                                    from: ctrl.emulators[i].hub_id,
                                    to: ctrl.emulators[i]._id,
                                    length: EDGE_LENGTH_MAIN
                                });
                            }
                        }
                    }

                    for (var i = 0; i < ctrl.devices.length; i++) {
                        nodes.push({
                            id: ctrl.devices[i]._id,
                            label: 'Device: ' + ctrl.devices[i].spec.model,
                            image: DIR + 'Hardware-My-PDA-02-icon.png',
                            shape: 'image'
                        });

                        //alert(ctrl.emulators[i].attached_hub);
                        if (ctrl.devices[i].hub_id !== null) {

                            if (ctrl.devices[i].hub_port) {

                                edges.push({
                                    from: ctrl.devices[i].hub_id,
                                    to: ctrl.devices[i]._id,
                                    label: ctrl.devices[i].hub_port,
                                    font: {align: 'horizontal'},
                                    length: EDGE_LENGTH_MAIN
                                });
                            }
                            else {

                                edges.push({
                                    from: ctrl.devices[i].hub_id,
                                    to: ctrl.devices[i]._id,
                                    length: EDGE_LENGTH_MAIN
                                });
                            }
                        } else {
                            edges.push({
                                from: ctrl.hubs[0].id,
                                to: ctrl.devices[i]._id,
                                length: EDGE_LENGTH_MAIN
                            });

                        }
                    }

                    // create a network
                    var container = document.getElementById('mynetwork');
                    var data = {
                        nodes: nodes,
                        edges: edges
                    };
                    var options = {};
                    var network = new vis.Network(container, data, options);

                });
            });
        });

    };

    draw();

}]);