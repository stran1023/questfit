import type { LandmarkFrame } from "./calibrationDomain";

const connections=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]] as const;

export function drawPoseOverlay(canvas:HTMLCanvasElement|null,landmarks:LandmarkFrame){
 const context=canvas?.getContext("2d");if(!canvas||!context)return;context.clearRect(0,0,canvas.width,canvas.height);context.strokeStyle="#22d3ee";context.lineWidth=3;
 for(const [start,end] of connections){const a=landmarks[start],b=landmarks[end];if(!a||!b)continue;context.beginPath();context.moveTo((1-a.x)*canvas.width,a.y*canvas.height);context.lineTo((1-b.x)*canvas.width,b.y*canvas.height);context.stroke()}
 context.fillStyle="#f0abfc";for(const landmark of landmarks){if((landmark.visibility??1)<.45)continue;context.beginPath();context.arc((1-landmark.x)*canvas.width,landmark.y*canvas.height,3,0,Math.PI*2);context.fill()}
}

export function clearPoseOverlay(canvas:HTMLCanvasElement|null){const context=canvas?.getContext("2d");if(canvas&&context)context.clearRect(0,0,canvas.width,canvas.height)}
