import { ThreeInstance } from "../activation/threeInit";
import { createMultiMaterialObject } from "../libs/SceneUtils";

export class Props {
    constructor() {
        this.colorArr = [0xff00ff, 0xff0000, 0x00ff00, 0x0000ff, 0x000f0f, 0x0ff0ff]
    }
    init() {

        let arrdata = [30, 30, 20, 20, 50, 50]
        this.createProps(arrdata, 'column')
        // this.gltf = new THREE.GLTFExporter()
        // console.log('GLTFExporter', this.gltf)
        // const options = {
        //     trs: false,
        //     onlyVisible: true,
        //     truncateDrawRange: true,
        //     binary: true,
        //     maxTextureSize: Infinity,
        // }
        // let self = this;
        // this.gltf.parse(ThreeInstance.getInstance().scene, function (res) {
        //     console.log('GLTFExporterRes', res);
        //     //self.testBlob(res);
        // },
        //     options
        // )
        //this.circle1.rotation.z = 30
    }

    testBlob(res) {
        //var data = new Blob([res])
        var data = new Blob([res])
        console.log('GLTFExporterdata', data);
        const elink = document.createElement("a");
        elink.download = "test.glb";
        elink.style.display = "none";
        elink.href = URL.createObjectURL(data);
        document.body.appendChild(elink);     //
        elink.click();      //默认点击a标签触发下载，
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
    }
    createProps(arr, type) {
        if (type === 'circle') {
            this.createCircleImage(arr);
        } else if (type === "column") {
            this.createColumnImage(arr);
        }
    }
    createCircleImage(arr) {
        let totlal = 0;
        for (let j = 0; j < arr.length; ++j) {
            totlal += arr[j];
        }
        let angle = 0;
        for (let i = 0; i < arr.length; ++i) {
            let geome = new THREE.CircleGeometry(1, 100, (angle) * Math.PI * 2, (arr[i] / totlal) * Math.PI * 2)
            angle += (arr[i] / totlal);
            var cricle = this.createMesh(geome, this.colorArr[i])
            cricle.position.x = 3;
            cricle.position.z = 4;
            cricle.position.y = 3;
            const labGeome = new THREE.PlaneBufferGeometry(1, 1);
            var lab = this.creatLabMesh(labGeome, i)
            let labAngle = (angle - (arr[i] / totlal) / 2) * 360 * (Math.PI / 180)
            lab.position.x = Math.cos(labAngle) * 2 + 3
            lab.position.z = 4;
            lab.position.y = Math.sin(labAngle) * 2 + 3;
            ThreeInstance.getInstance().objectsGroup.add(cricle)
            ThreeInstance.getInstance().objectsGroup.add(lab)
        }
    }
    getTextCanvas(text) {
        var width = 512, height = 512;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#C3C3C3';
        ctx.fillRect(0, 0, width, height);
        ctx.font = 50 + 'px " bold';
        ctx.fillStyle = '#2891FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);
        return canvas;
    }
    createMesh(geom, color) {
        var meshMaterial = new THREE.MeshBasicMaterial({ color: color });
        meshMaterial.side = THREE.DoubleSide;
        var meshMaterial1 = new THREE.MeshBasicMaterial({ color: 0x000000 });
        meshMaterial1.side = THREE.DoubleSide;
        var wireFrameMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        wireFrameMat.wireframe = true;

        // 混合材质

        var mesh = createMultiMaterialObject(geom, [meshMaterial]);
        return mesh;
    }
    creatLabMesh(geom, idx) {
        var material = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(this.getTextCanvas('Label' + idx)) })
        const labMesh = new THREE.Mesh(geom, material);
        return labMesh
    }
    getTextCanvas(text) {
        var width = 512, height = 512;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#C3C3C3';
        ctx.fillRect(0, 0, width, height);
        ctx.font = 80 + 'px " bold';
        ctx.fillStyle = '#2891FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);
        return canvas;
    }

    createColumnImage(arr) {
        let max = Math.max.apply(this,arr);
        console.log("max",max)
        for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            const geometry = new THREE.CylinderGeometry(0.3, 0.3, arr[index]/max, 1000);
            var cylinder = this.createMesh(geometry, this.colorArr[index])
            cylinder.position.x = (2*index - 5);
            cylinder.position.y = 3 + (arr[index]/max)/2
            
            const labGeome = new THREE.PlaneBufferGeometry(1, 1);
            var lab = this.creatLabMesh(labGeome, index)
            lab.position.x = (2*index - 5);
            lab.position.y = 2.4 ;
            const labTopGeome = new THREE.PlaneBufferGeometry(1, 1);
            var labTop = this.creatLabMesh(labTopGeome, arr[index])
            labTop.position.x = (2*index - 5);
            labTop.position.y = cylinder.position.y + 1;

            ThreeInstance.getInstance().objectsGroup.add(labTop)
            ThreeInstance.getInstance().objectsGroup.add(lab)
            ThreeInstance.getInstance().objectsGroup.add(cylinder)
        }
    }
}