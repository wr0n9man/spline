import "./main.css";
import { Layer, Stage, Line } from "react-konva";
import Konva from "konva";
import { useRef, useState } from "react";

	export default function Main() {
	const [tool, setTool] = useState("pen");
	const [gradus, setGradus] = useState(0);
	const [tangens, setTangens] = useState(0);
	const [poly, setPoly] = useState([])
	const [lines, setLines] = useState([]);
	const [dopLine, setDopLine]= useState([]);
	const isDrawing = useRef(false);

	const handleMouseDown = (e) => {
		isDrawing.current = true;
		const pos = e.target.getStage().getPointerPosition();
		

		setLines([...lines, { tool, points: [pos.x, pos.y] }]);	
		const point = e.target.getStage().getPointerPosition();
		setDopLine([{ tool, points: [pos.x, pos.y] }]);
		let lastLine = lines[lines.length - 1];

		// add point
		if (lastLine!==undefined){
			lastLine.points = lastLine.points.concat([point.x, point.y]);
	
			// replace last
			lines.splice(lines.length - 1, 1, lastLine);
		
		}
		let polygons=[];
		console.log(' ');
		lines.slice(0,lines.length-1).map((line,i)=>{

		let tang = ((dopLine[0].points[3]-((line.points[1]+line.points[3])/2))/(((line.points[0]+line.points[2])/2)-dopLine[0].points[2]))
		let arctg = Math.atan(tang); // Арктангенс
		let angle = arctg * 180 / Math.PI; // угол в градусах
		if (((line.points[1]+line.points[3])/2)>dopLine[0].points[3]){
			if (tang < 0) {
				angle = 360 + angle;
			}else if (tang > 0) {
				angle = 180 + angle;
			}			 
		}else{		
			if (tang < 0) {
				angle = 180 + angle;
			} 
		}	
	


			console.log(line);
			console.log((Math.abs(line.points[0]-line.points[2]))<(Math.abs(line.points[1]-line.points[3])));
			console.log(dopLine[0].points[3],' ',((line.points[0]+line.points[2])/2));
		
				let x =0
				if (((angle<45)&&(angle>0))||((angle<0)&&(angle>315))){
					x =700;
					polygons.push({
						points:[
						line.points[0],line.points[1],				
						line.points[2],line.points[3],				
						x,(line.points[3] + ((700-line.points[2])*(Math.tan( Math.atan((dopLine[0].points[3]-line.points[3]) / (dopLine[0].points[2]-line.points[2])))))),
						x,(line.points[1] + ((700-line.points[0])*(Math.tan( Math.atan((dopLine[0].points[3]-line.points[1]) / (dopLine[0].points[2]-line.points[0])))))),				
						],	ugol:{
							1:angle,
						}					
					})
				}if ((angle<225)&&(angle>135)){
					polygons.push({
						points:[
						line.points[0],line.points[1],				
						line.points[2],line.points[3],				
						x,(line.points[3] - (line.points[2]*(Math.tan( Math.atan((dopLine[0].points[3]-line.points[3]) / (dopLine[0].points[2]-line.points[2])))))),
						x,(line.points[1] - (line.points[0]*(Math.tan( Math.atan((dopLine[0].points[3]-line.points[1]) / (dopLine[0].points[2]-line.points[0])))))),				
						],			ugol:{
							1:angle,
						}					
					})
				}
			
				let y=0;
				
				if((angle<315)&&(angle>225)){
					y=700;
					polygons.push({
						points:[
						line.points[0],line.points[1],				
						line.points[2],line.points[3],				
						(line.points[2] + ((700-line.points[3])*(Math.tan( Math.atan((dopLine[0].points[2]-line.points[2]) / (dopLine[0].points[3]-line.points[3])))))), y,
						(line.points[0] + ((700-line.points[1])*(Math.tan( Math.atan((dopLine[0].points[2]-line.points[0]) / (dopLine[0].points[3]-line.points[1])))))), y,				
						],
						ugol:{
							1:angle,
						}				
					})

				}if((angle<135)&&(angle>45)){					
					polygons.push({
						points:[
						line.points[0],line.points[1],				
						line.points[2],line.points[3],				
						(line.points[2] - (line.points[3]*(Math.tan( Math.atan((dopLine[0].points[2]-line.points[2]) / (dopLine[0].points[3]-line.points[3])))))), y,
						(line.points[0] - (line.points[1]*(Math.tan( Math.atan((dopLine[0].points[2]-line.points[0]) / (dopLine[0].points[3]-line.points[1])))))), y,				
						],		ugol:{
							1:angle,
							
						}				
					})
				}
			}
			
		)
		setPoly(polygons)

	};

	const handleMouseMove = (e) => {	
		const stage = e.target.getStage();
		const point = stage.getPointerPosition();	
		if (lines.find((line)=>{
			if((dopLine[0].points[0]<line.points[0])&&(dopLine[0].points[0]<line.points[3])){
			
			}
			if((point.x<=line.points[0]));
		})){}
		let lastDopLine = dopLine[0];
	
		if (lastDopLine !== undefined){	
			lastDopLine.points =lastDopLine.points.slice(0,2)
			lastDopLine.points = lastDopLine.points.concat([point.x, point.y]);			
			setDopLine(dopLine.concat());		
		}
		let tang = ((350-point.y)/(point.x-350))
		let arctg = Math.atan(tang); // Арктангенс
		let angle = arctg * 180 / Math.PI; // угол в градусах
		if (point.y>350){
			if (tang < 0) {
				angle = 360 + angle;
			}else if (tang > 0) {
				angle = 180 + angle;
			}			 
		}else{		
			if (tang < 0) {
				angle = 180 + angle;
			} 
		}	

		setGradus(angle)
		setTangens(tang)		
		

		
	};
	const handleMouseLeave = (e) =>{
		let lastDopLine = dopLine[0];
		if (lastDopLine !== undefined){			
			lastDopLine.points =lastDopLine.points.slice(0,2)
			lastDopLine.points = lastDopLine.points.splice(lastDopLine.points.length-2,2);
			
			setDopLine(dopLine.concat());
			console.log(lines,'poly=',poly);
			console.log(dopLine);
		}
		
	}

	const handleMouseUp = () => {
		isDrawing.current = false;
		
	};


  return (
	  <>
	  <label>градусы={gradus}, Тангенс={tangens}</label>
		<Stage
			width={700}
			height={700}
			onClick={handleMouseDown}
			onMousemove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onMouseup={handleMouseUp}
			className="main__canvas"
		>
			<Layer>
				{lines.map((line, i) => (
					<Line
						key={i}
						points={line.points}
						stroke="#df4b26"
						strokeWidth={1} 
						lineCap="round"
						//closed="true"				
						globalCompositeOperation={
							line.tool === "eraser" ? "destination-out" : "source-over"
						}
					/>
				))}
					{dopLine.map((dopLine, i) => (
					<Line
						key={i}
						points={dopLine.points}
						stroke="#3d3d3d"
						strokeWidth={1} 
						lineCap="round"
						//closed="true"				
						globalCompositeOperation={
							dopLine.tool === "eraser" ? "destination-out" : "source-over"
						}
					/>
				))}
					{poly.map((poly, i) => (
					<Line
						key={i}
						points={poly.points}
						stroke="#3d3d3d"
						strokeWidth={1}
						fill='#00D2FF' 
						lineCap="round"
						closed="true"
						opacity={0.3}				
						globalCompositeOperation={
							dopLine.tool === "eraser" ? "destination-out" : "source-over"
						}
					/>
				))}
			</Layer>
		</Stage>
		</>
	);
}
