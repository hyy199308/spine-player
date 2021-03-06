import Renderer  from "./renderer"
import Shader, { ShaderUniform } from "./shader"
import Texture from "./texture"

export default class Mesh {
    public texture:Texture
    public points:Array<any> = []
    public indices:Uint16Array = null

    protected renderer:Renderer
    protected shader:Shader
    protected attributes:Array<{location:number, size:number}> = []
    protected uniforms:Array<ShaderUniform> = []

    private _x:number = 0
    private _y:number = 0

    //use for vbo, ebo drawing
    protected vertices:Float32Array
    protected bytesPerVertex:number
    protected elementsCountPerVertex:number
    protected vertsDirty:boolean = true
    protected vertsIndexDirty:boolean = true

    public vbo:WebGLBuffer = null
    public ebo:WebGLBuffer = null

    constructor(renderer:Renderer) {
        this.renderer = renderer
        this.setShader(this.renderer.getDefaultShader())
    }

    public get x():number {
        return this._x
    }

    public get y():number {
        return this._y
    }
    
    public set x(x:number){
        this._x = x
        this.vertsDirty = true
    }

    public set y(y:number){
        this._y = y
        this.vertsDirty = true
    }

    public setImage(file:string) {
        this.texture = Texture.getTexture(file, this.renderer)
        this.vertsDirty = true
    }

    public setTexture(texture:Texture) {
        this.texture = texture
        this.vertsDirty = true
    }

    public setShader(shader:Shader) {
        this.shader = shader
        this.shader.onMeshUseShader(this)
    }

    public setUniform(uniform:ShaderUniform) {
        for (let i=0;i<this.uniforms.length;i++){
            if (this.uniforms[i].name == uniform.name){
                this.uniforms.splice(i, 1)
                break
            }
        }
        this.uniforms.push(uniform)
    }

    public setMeshAttributes(attributes:Array<{location:number, size:number}>) {
        this.attributes = attributes

        let bytesPerVertex = 0
        let elementsCountPerVertex = 0
        for (let i = 0; i < attributes.length; i++) {
            let attrib = attributes[i]
            let sizeOfAttrib = attrib.size
            bytesPerVertex += sizeOfAttrib*Float32Array.BYTES_PER_ELEMENT
            elementsCountPerVertex += sizeOfAttrib
        }
        this.bytesPerVertex = bytesPerVertex
        this.elementsCountPerVertex = elementsCountPerVertex 
    }

    protected updateVertices() {
        if (this.vertices == null || this.vertices.length != this.points.length * this.elementsCountPerVertex) {
            this.vertices = new Float32Array(this.points.length * this.elementsCountPerVertex)
        } 
        //计算世界坐标
        for (let p=0;p<this.points.length;p++) {
            this.vertices[p*4] = this.points[p][0] + this.x
            this.vertices[p*4+1] = this.points[p][1] + this.y
            this.vertices[p*4+2] = this.points[p][2] //u
            this.vertices[p*4+3] = this.points[p][3] //v
        }

        if (this.vbo == null){
            this.vbo = this.renderer.createVBO(this.vertices)
        } else {
            this.renderer.updateVBO(this.vbo, this.vertices)
        }
        this.vertsDirty = false
    }

    protected updateVerticesIndex() {
        if (this.ebo == null) {
            this.ebo = this.renderer.createEBO(this.indices)
        } else {
            this.renderer.updateEBO(this.ebo, this.indices)
        }
        this.vertsIndexDirty = false
    }

    public preDraw() {

    }

    public fillBuffers() {
        if (this.vertsDirty) {
            this.updateVertices()
        }
        if (this.vertsIndexDirty) {
            this.updateVerticesIndex()
        }
    }

    public draw() {
        this.preDraw()
        this.fillBuffers()
        this.useShader()
        this.useTexture() //mesh use 1 texture currently
        this.useVBO()
        this.useEBO()
        
        this.renderer.draw(this.indices.length, true)
    }

    public useShader() {
        this.renderer.useShader(this.shader.webglShader, this.uniforms)
    }

    public useTexture() {
        this.renderer.useTexture(this.texture.webglTexture, 0) //mesh use 1 texture currently
    }

    public useVBO() {
        this.renderer.useVBO(this.vbo, this.bytesPerVertex, this.attributes)
    }

    public useEBO() {
        this.renderer.useEBO(this.ebo)
    }

    public setVertsDiry(){
        this.vertsDirty = true
    }

    public setVertsIndexDiry(){
        this.vertsIndexDirty = true
    }
}


