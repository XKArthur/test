import { ThreeInstance } from "../activation/threeInit";

let textureloader = new THREE.TextureLoader();

export class Helper {

    constructor() {

        this._roleplaneData = null;
        this.rolePlane = null;
        this.rolePlaneScale = 1;
        this.rolePlaneX = 0;
        this.rolePlaneY = 0;
        this.rolePlaneZ = 0;


        this.AxesHelper = null;

        this.rolePlaneVisible = false;
        this._axesHelperVisible = false;

    }

    init(_config) {

        this._roleplaneData = _config.roleplane.arrangement[0];

        this.rolePlane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 3.52, 1.98 ),
            new THREE.MeshBasicMaterial({ transparent: true })
        );

        this._setRolePlaneTextureByDirection( this._roleplaneData.direction );
        this.rolePlane.rotation.z = Math.PI * (this._roleplaneData.angle / 180);
        this.rolePlane.position.set(this._roleplaneData.x, this._roleplaneData.y, this._roleplaneData.z);
        this.rolePlane.scale.set(this._roleplaneData.s, this._roleplaneData.s, this._roleplaneData.s );
        this.rolePlane.renderOrder = 1;
        this.rolePlane.visible = true;
        this.rolePlane.name = 'role plane';


        this.AxesHelper = new THREE.AxesHelper(1.7);
        this.AxesHelper.visible = false;

        this.gridHelper = new THREE.GridHelper(20, 10);
        this.gridHelper.visible = false;
        

        ThreeInstance.getInstance().scene.add(this.AxesHelper);
        ThreeInstance.getInstance().scene.add(this.rolePlane);
        ThreeInstance.getInstance().scene.add(this.gridHelper);

    }



    setRolePlaneVisible (bool) {
        this.rolePlane.visible = bool;
    }


    UISetRolePlaneDirection ( direction ) {

        let scalefactor;
        let angle;

        switch( direction ) {

            case 'horizontal':
                scalefactor = 0.7;
                angle = 0;
                break;

            case 'vertical':
                scalefactor = 1;
                angle = -90;
                break;

        }

        this.rolePlane.rotation.z = Math.PI * ( angle / 180 );
        this.rolePlane.scale.set( scalefactor, scalefactor, scalefactor );
        this._setRolePlaneTextureByDirection( direction );

        // 写入CONFIG
        this._roleplaneData.direction = direction;
        this._roleplaneData.angle = angle;
        this._roleplaneData.s = scalefactor;

    }


    _setRolePlaneTextureByDirection ( direction ) {

        let map;

        switch( direction ) {

            case 'horizontal':
                map = textureloader.load('./resources/tex/role-webcam-horizontal.png');
                break;

            case 'vertical':
                map = textureloader.load('./resources/tex/role-webcam-vertical.png');
                break;

        }

        this.rolePlane.material.map = map;

    }


    UISetRolePlaneScale ( value ) {

        this.rolePlane.scale.set(value, value, value);

        let offsetY = (3.52 * value - 3.52) / 2;

        this.rolePlane.position.y = 1.76 + offsetY;


        // 写入CONFIG
        this._roleplaneData.s = value;
        this._roleplaneData.y = this.rolePlane.position.y;

    }


    UISetRolePlaneTranslate(direction, value) {

        switch (direction) {

            case 'x':

                this.rolePlane.position.x = value;
                this._roleplaneData.x = value;
                break;

            case 'y':

                this.rolePlane.position.y = value;
                this._roleplaneData.y = value;
                break;

            case 'z':

                this.rolePlane.position.z = value;
                this._roleplaneData.z = value;
                break;

        }

    }


    setAxesVisible(bool) {
        this.AxesHelper.visible = bool;
        this.gridHelper.visible = bool;
    }



    // DEBUG
    test() {}

    debug() {

        let folder = ThreeInstance.getInstance().gui.addFolder('🕴 | 辅助器');
        folder.open();

        let self = this;

        folder.add(this, 'rolePlaneVisible').name('面片显示隐藏').onChange(function (value) {
    
            self.setRolePlaneVisible(value);
    
        });
    

        // 输出参数   
        folder.add(this, 'test').name('LOG').onChange(function (value) {
    
            console.log( self.rolePlane );
    
        });
    

        // 横竖调节    
        folder.add(this, 'test').name('横向').onChange(function (value) {
    
            self.UISetRolePlaneDirection('horizontal');
    
        });
    
        folder.add(this, 'test').name('竖向').onChange(function (value) {
    
            self.UISetRolePlaneDirection('vertical')
    
        });
        

        // 缩放调节
        folder.add(this, 'rolePlaneScale', 0, 3).step(0.01).name('缩放面片').onChange(function (value) {
    
            self.UISetRolePlaneScale(value);
    
        });
        

        // 位置调节
        folder.add(this, 'rolePlaneX', -20, 20).step(0.01).name('面片左右').onChange(function (value) {
    
            self.UISetRolePlaneTranslate('x', value);
    
        });
    
        folder.add(this, 'rolePlaneY', -2, 10).step(0.01).name('面片高低').onChange(function (value) {
    
            self.UISetRolePlaneTranslate('y', value);
    
        });
    
        folder.add(this, 'rolePlaneZ', -10, 10).step(0.01).name('面片前后').onChange(function (value) {
    
            self.UISetRolePlaneTranslate('z', value);
    
        });
    
    
    
        folder.add(this, '_axesHelperVisible').name('坐标显示隐藏').onChange(function (value) {
    
            self.setAxesVisible(value);
    
        });
    
    
    }


}


