angular.module('myApp').controller('EmulatorsController', ['$http', '$window', 'emulatorsService', 'hubsService', function ($http, $window, emulatorsService, hubsService) {

    var ctrl = this;

    ctrl.hub = [];
    var getIndexOfHub = function (emu, hubs) {

        for (var i = 0; i < hubs.length; i++) {

            if (emu.hub_id === hubs[i].id)
                return i;
        }
        return -1;
    };

    ctrl.getAll = function () {
        ctrl.hubs = hubsService.query(function () {
            ctrl.emulators = emulatorsService.query(function () {

                for (var i = 0; i < ctrl.emulators.length; i++) {
                    var index=getIndexOfHub(ctrl.emulators[i], ctrl.hubs);

                    if(index!=-1)

                        ctrl.hub[i] = ctrl.hubs[index].id;
                }
            });

        });
    };

    ctrl.getAll();

    ctrl.getOne = function (id) {
        ctrl.emulator = emulatorsService.get(id);
    };

    ctrl.create = function (newEmulator) {
        var emulator = new emulatorsService(newEmulator);
        emulator.$save();
        // TODO: see hub
    };

    ctrl.delete = function (emulator) {
        emulator.$delete({id: emulator.id});
    };

    ctrl.view = function (emulator) {
        var params = 'host=' + emulator.ip + '&' + 'port=' + emulator.vnc_port + '&' + 'autoconnect=true' + '&' + 'resize=downscale';
        $window.open('templates/pages/noVNC/vnc.html?' + params, emulator.name, 'height=682, width=360, resizable=no');
    };

    ctrl.attachToHub = function (emulator, hub_id) {
        if (hub_id) {
            var resource = {
                type: 'emulator',
                id: emulator.id
            };
            $http.post('api/v1/hubs/' + hub_id + '/connections', resource).success(function (res) {
                //TODO
            });
        }
    };

    ctrl.devices = [
        {
            id:'nexus_9',
            name:'Nexus 9',
            orientation:[
                {
                    name:'port',
                    size:'1978,2631',
                    screenpos:'219,264',
                    screensize:'1536,2048',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'2854,1785',
                    screenpos:'401,100',
                    screensize:'2048,1536',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'nexus_6',
            name:'Nexus 6',
            orientation:[
                {
                    name:'port',
                    size:'1896,3054',
                    screenpos:'229,239',
                    screensize:'1440,2560',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'3142,1639',
                    screenpos:'318,76',
                    screensize:'2560,1440',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'nexus_5',
            name:'Nexus 5',
            orientation:[
                {
                    name:'port',
                    size:'1370,2405',
                    screenpos:'144,195',
                    screensize:'1080,1920',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'2497,1235',
                    screenpos:'261,65',
                    screensize:'1920,1080',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'nexus_4',
            name:'Nexus 4',
            orientation:[
                {
                    name:'port',
                    size:'958,1678',
                    screenpos:'94,187',
                    screensize:'768,1280',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'1799,885',
                    screenpos:'257,45',
                    screensize:'1280,768',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'nexus_7_2013',
            name:'Nexus 7',
            orientation:[
                {
                    name:'port',
                    size:'1064,1714',
                    screenpos:'130,201',
                    screensize:'800,1280',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'1848,986',
                    screenpos:'282,80',
                    screensize:'1280,800',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'nexus_7',
            name:'Nexus 7 (2012)',
            orientation:[
                {
                    name:'port',
                    size:'1094,1689',
                    screenpos:'142,190',
                    screensize:'800,1280',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'1803,1045',
                    screenpos:'260,105',
                    screensize:'1280,800',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'nexus_10',
            name:'Nexus 10',
            orientation:[
                {
                    name:'port',
                    size:'1165,1568',
                    screenpos:'183,133',
                    screensize:'800,1280',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'1670,1088',
                    screenpos:'194,133',
                    screensize:'1280,800',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'xoom',
            name:'Motorola XOOM',
            orientation:[
                {
                    name:'port',
                    size:'1170,1471',
                    screenpos:'185,83',
                    screensize:'800,1280',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'1569,998',
                    screenpos:'152,89',
                    screensize:'1280,800',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'galaxy_nexus',
            name:'Galaxy Nexus',
            orientation:[
                {
                    name:'port',
                    size:'1101,1709',
                    screenpos:'192,213',
                    screensize:'720,1280',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'1847,886',
                    screenpos:'304,68',
                    screensize:'1280,720',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'nexus_s',
            name:'Nexus S',
            orientation:[
                {
                    name:'port',
                    size:'719,1139',
                    screenpos:'119,160',
                    screensize:'480,800',
                    shadow:'port_shadow.png',
                    back:'port_back.png',
                    lights:'port_fore.png'
                },
                {
                    name:'land',
                    size:'1210,586',
                    screenpos:'208,44',
                    screensize:'800,480',
                    shadow:'land_shadow.png',
                    back:'land_back.png',
                    lights:'land_fore.png'
                }
            ]
        },
        {
            id:'nexus_one',
            name:'Nexus One',
            orientation:[
                {
                    name:'port',
                    size:'732,1178',
                    screenpos:'125,131',
                    screensize:'480,800',
                    shadow:'port_shadow.png',
                    back:'port_back.png'
                },
                {
                    name:'land',
                    size:'1300,612',
                    screenpos:'200,52',
                    screensize:'800,480',
                    shadow:'land_shadow.png',
                    back:'land_back.png'
                }
            ]
        }
    ];

}]);