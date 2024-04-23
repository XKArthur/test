import { ThreeInstance } from "../activation/threeInit";

export class Lights {

    constructor() {

        this._config = null;
        this._lightsData = null;

        this.ambLight = null;

        this.color = 0xFFFFFF;

        this.dirLights = [];

    }

    init(config) {

        this._config = config;
        this._lightsData = config.lights;

        this.addAmbLight();

    }

    addAmbLight() {

        this.ambLight = new THREE.AmbientLight(this._lightsData.ambient_light.color, this._lightsData.ambient_light.intensity);
        this.ambLight.name = "AmbientLight";

        ThreeInstance.getInstance().scene.add(this.ambLight);

    }


    setAmbLight(value) {

        // Editor.stageMesh.material = Editor.material_reflect;

        this.ambLight.intensity = value;

    }


    setAmbLightColor(value) {
        // this.ambLight.color.setHex(value);
        this.ambLight.color.set(value);
        console.log('setAmbLightColor',value,this.ambLight.color)

    }


    // 平行光
    addDirLight(name, color, intensity, dir) {

        (name === undefined) && (name = "dirLight" + this.dirLights.length);
        (color === undefined) && (color = 0xffffff);
        (intensity === undefined) && (intensity = 0.5);
        (dir === undefined) && (dir = new THREE.Vector3(0, 1, 0));

        const directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.name = name;

        window.shgl.scene.add(directionalLight);
        this.dirLights.push(directionalLight);

        !window.shgl.dirLights && (window.shgl.dirLights = this.dirLights);

        //this.debug();
        // let light = this.folder.addFolder("平行光源" + this.dirLights.length);

        // light.addColor( directionalLight, "color").onChange( function (value) {

        //     Lights.setDirLightColor( value );

        // });

        // light.add( directionalLight, "intensity",0.0,10.0).onChange( function (value) {

        //     Lights.setDirLightintensity( value );

        // });

    }
    setDirLight(x, z) {

        if (this.dirLights.length > 0) {
            var Light = this.dirLights[0];
            Light.position.x = x
            Light.position.z = z
        }

    }


    setDirLightColor(value) {

        this.dirLights[0].color = value;

    }


    setDirLightintensity(value) {

        Editor.stageMesh.material = Editor.material_reflect;
        this.dirLights[0].intensity = value;

    }


    delDirLight() {

        var obj = ThreeInstance.getInstance().scene.getObjectByName("dirLight" + (this.dirLights.length - 1));

        if (obj)
            ThreeInstance.getInstance().scene.remove(obj)

    }

    // 保存
    save() {

        this._lightsData.ambient_light.intensity = this.ambLight.intensity;
        this._lightsData.ambient_light.color = '#' + this.ambLight.color.getHexString();

    }



    // DEBUG ---
    debug() {

        let folder = ThreeInstance.getInstance().gui.addFolder('🔆 | 光源控制');
        folder.open();

        let self = this;



        // 是否开启光照
        folder.add(this._config.renderer, "lit").name("使用光照").onChange();


        // 环境光强度
        folder.add(this.ambLight, "intensity", 0.0, 2.0).step(0.005).onChange(function (value) {

            self.setAmbLight(value)

        });


        // 颜色
        folder.addColor(this, "color").onChange(function (value) {

            self.setAmbLightColor(value);

        });

        // folder.add(Lights, 'addDirLight').name('增加平行光');

        //folder.add(Lights, 'delDirLight').name('删除平行光');
    }

}



