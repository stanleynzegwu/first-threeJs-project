import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import * as lil from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new lil.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('/textures/matcaps/5.png')
const matcapTexture6 = textureLoader.load('/textures/matcaps/6.png')
const matcapTexture7 = textureLoader.load('/textures/matcaps/7.png')

//Array of textures
const textureArr = [matcapTexture1,matcapTexture2,matcapTexture3,matcapTexture4,matcapTexture5,matcapTexture6,matcapTexture7]
let num = 0
//geometry
const torusGeometry = new THREE.TorusGeometry( 0.3, 0.2, 20, 45 ); 

const cubeGeometry = new THREE.BoxGeometry(0.2,0.2,0.2)

//Array of donuts
let donuts = []
let colorArr = [0xe02f64,0x1b9fe0,'yellow','orange','pink',0x62b579]

//material 
const material = new THREE.MeshMatcapMaterial({matcap:matcapTexture1})

//GUI
const parameters = {
    changeTexture: () => {
        const arrLength = textureArr.length - 1
    
        num =  num === arrLength ? 0 : ++num
        //const newTexture = new THREE.TextureLoader().load(newTextureUrl);
        material.matcap = textureArr[num];
        material.needsUpdate = true; 
    }
}
gui.add(parameters,'changeTexture')


//Fonts
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Thanks Juan Garcia',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
// textGeometry.computeBoundingBox()
// textGeometry.translate(
//     - (textGeometry.boundingBox.max.x - 0.2) * 0.5, //or - textGeometry.boundingBox.max.x / 2
//     - (textGeometry.boundingBox.max.y - 0.2) * 0.5,
//     - (textGeometry.boundingBox.max.z - 0.3) * 0.5
// )
        textGeometry.center()
        

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        for(let i = 0; i < 50; i++){
            //generate random number
            const randomNumber = Math.floor(Math.random() * colorArr.length);
            const randomMaterial = new THREE.MeshBasicMaterial({color:colorArr[randomNumber]})
            const donut = new THREE.Mesh(torusGeometry,material)
            const cube = new THREE.Mesh(cubeGeometry,randomMaterial)
            
            donuts.push(donut,cube)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.z = Math.random() * Math.PI

            const scale = Math.random()

            donut.scale.set(scale,scale,scale) 

            cube.position.x = (Math.random() - 0.5) * 10
            cube.position.y = (Math.random() - 0.5) * 5
            cube.position.z = (Math.random() - 0.5) * 5

            cube.rotation.x = Math.random() * Math.PI
            cube.rotation.z = Math.random() * Math.PI


            scene.add(donut,cube)
        }


    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = .5
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Animate each donut
    donuts.forEach((donut,index) => {
        donut.rotation.x = Math.sin(elapsedTime * (0.002 * index))
        donut.position.y = Math.sin(elapsedTime * (0.002 * (index % 2 ? -index : index)))
    })
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()