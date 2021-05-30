import {Component, h, Prop, State,Method,Element} from '@stencil/core';

import {Pose, PoseBodyFrameModel, PoseLimb, PoseModel, PosePointModel, RGBColor} from "pose-utils";


@Component({
  tag: 'pose-viewer',
  styleUrl: 'pose-viewer.css',
  shadow: true
})
export class PoseViewer {
  /**
   * Pose Img Source
   */
  @Prop() src: string;

  /**
   * Allow editing the img
   */
  @Prop() edit: boolean = false;

  @Element() el :HTMLElement
  @Prop({reflect:true,mutable:true}) paused: boolean = false
  @Prop({reflect:true,mutable:true}) fps: number = 15
  @Prop ({reflect:true,mutable:true}) playbackrate: number = 1.0
  duration : number
  video : HTMLVideoElement
  @State() frame: PoseBodyFrameModel;
  private loopInterval: any; 
  pose: PoseModel;

  @Prop ({reflect:true,mutable:true}) nextFrameId = 0
  constructor() {
  }
  setDuration(vidDuration:number){
    this.duration = vidDuration
  }
  playPose(){
    this.paused = false
  }
  pausePose(){
    this.paused = true
  }
  updatePose(currTime :number,oldTime :number){
    if (Math.abs(currTime - oldTime) > 1.5)  {  
    this.nextFrameId=Math.round(currTime/this.duration*this.pose.body.frames.length)
    }
    // if(this.video.playbackRate!=this.playbackrate){
    //   this.playbackrate =this.video.playbackRate
    // }
  }
  seek(currTime :number){
      this.nextFrameId=Math.round(currTime/this.duration*this.pose.body.frames.length)
   
  }
  @Method()
  async setVideo(video :any){
    this.video = video
    this.duration =this.video.duration
    this.video.addEventListener('pause', () => {
        this.pausePose();
    });
    this.video.addEventListener('play', () => {
        this.playPose()
    });
      var time  = 0
    this.video.addEventListener('timeupdate', () => {
        var oldtime =time
        time = this.video.currentTime
        this.updatePose(time,oldtime)
    });
    this.video.addEventListener('seek', () => {
        time = this.video.currentTime
        this.seek(time)
    });
  }

  @Method()
  async changeplaybackRate(rate:number){
    this.playbackrate = rate;
  }




  async componentWillLoad() {
    this.pose = await Pose.fromRemote(this.src);
    console.log(this.pose);
    this.frame = this.pose.body.frames[this.nextFrameId];
    if (this.pose.body.frames.length > 1) {
      this.clearInterval();
      this.loopInterval = setInterval(this.frameLoop.bind(this), (1000 / this.pose.body.fps)/this.playbackrate)
    } else {
      this.frameLoop();
    }
  }

  clearInterval() {
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
    }
  }

  disconnectedCallback() {
    this.clearInterval();
  }

  frameLoop() {
    if(this.paused==false){
      this.frame = this.pose.body.frames[this.nextFrameId];
      this.nextFrameId = ((this.nextFrameId+1) % (this.pose.body.frames.length));
    }
    
  }

  isJointValid(joint: PosePointModel) {
    return joint.C > 0;
  }

  renderJoints(joints: PosePointModel[], colors: RGBColor[]) {
    return joints
      .filter(this.isJointValid.bind(this))
      .map((joint, i) => {
        const {R, G, B} = colors[i % colors.length];
        return (<circle
          cx={joint.X}
          cy={joint.Y}
          r={4}
          class="joint draggable"
          style={{
            fill: `rgb(${R}, ${G}, ${B})`,
            opacity: String(joint.C)
          }}
          data-id={i}>
        </circle>);
      });
  }

  renderLimbs(limbs: PoseLimb[], joints: PosePointModel[], colors: RGBColor[]) {
    return limbs.map(({from, to}) => {
      const a = joints[from];
      const b = joints[to];
      if (!this.isJointValid(a) || !this.isJointValid(b)) {
        return "";
      }

      const c1 = colors[from % colors.length];
      const c2 = colors[to % colors.length];
      const {R, G, B} = {
        R: (c1.R + c2.R) / 2,
        G: (c1.G + c2.G) / 2,
        B: (c1.B + c2.B) / 2,
      };
      return (<line
        x1={joints[from].X}
        y1={joints[from].Y}
        x2={joints[to].X}
        y2={joints[to].Y}
        style={{
          stroke: `rgb(${R}, ${G}, ${B})`,
          opacity: String((joints[from].C + joints[to].C) / 2)
        }}>
      </line>);
    });
  }


  render() {
    if (!this.frame) {
      return "";
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={this.pose.header.width} height={this.pose.header.height}>
        <g>
          {this.frame.people.map(person => this.pose.header.components.map(component => {
            const joints = person[component.name];
            return [
              this.renderLimbs(component.limbs, joints, component.colors),
              this.renderJoints(joints, component.colors),
            ]
          }))}
        </g>
      </svg>
    )
  }
} 