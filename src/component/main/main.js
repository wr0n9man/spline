import "./main.css";
import { Layer, Stage, Line, Circle } from "react-konva";

import { useEffect, useState } from "react";

export default function Main() {
  const tool = "pen";
  const [result, setResult] = useState("");
  const [select, setSelect] = useState("polygon");
  const [pointDot, setPointDot] = useState({
    Y: -10,
    X: -10,
  });
  const [ray, setRay] = useState({ points: [] });
  const [active, setActive] = useState(true);
  const [lines, setLines] = useState([]);
  const [dopLine, setDopLine] = useState([]);
  const [dopPoint, setDopPoint] = useState([]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(1);

  const tutorial = {
    1: "Нарисуйте многоугольник, двойное нажатие лкм завершит рисование ",
    2: "Поставьте точку и нажмите определить",
    3: "Для того что бы определить проводим лучи от точки, если количество пересечений четное - точка снаружи, если количество пересечений нечетное - точка внутри многоугольника",
  };

  useEffect(() => {
    const onKeypress = (e) => {
      if ((e.key.toLowerCase() === "c") || (e.key.toLowerCase() === "с")) {
        setRay({ points: [] })
        setLines([]);
        setDopLine([]);
        setDopPoint([]);
        setPointDot({Y: -10, X:-10 })
        setIsDrawingPolygon(true);
        setResult("");
        setTutorialStep(1);
        setSelect("polygon");
      }
    };

    document.addEventListener("keypress", onKeypress);

    return () => {
      document.removeEventListener("keypress", onKeypress);
    };
  }, []);

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    if (select === "polygon") {
      if (isDrawingPolygon) {
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
        const point = e.target.getStage().getPointerPosition();
        setDopLine([{ tool, points: [pos.x, pos.y] }]);
        console.log(lines);
        let lastLine = lines[lines.length - 1];
        // add point
        if (lastLine !== undefined) {
          if (
            lastLine.points[0] !== point.x &&
            lastLine.points[1] !== point.y
          ) {
            lastLine.points = lastLine.points.concat([point.x, point.y]);
            lines.splice(lines.length - 1, 1, lastLine);
          } else {
            lines.splice(lines.length - 1, 1);
            setLines(lines);
          }
          // replace last
        }
      }
    } else {
      setRay({ points: [] })
      setDopPoint([]);
      setPointDot({
        Y: pos.y,
        X: pos.x,
      });
      setActive(false);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (select === "polygon") {
      if (isDrawingPolygon) {
        if (
          lines.find((line) => {
            if (
              dopLine[0].points[0] < line.points[0] &&
              dopLine[0].points[0] < line.points[3]
            ) {
            }
            if (point.x <= line.points[0]);
          })
        ) {
        }
        let lastDopLine = dopLine[0];

        if (lastDopLine !== undefined) {
          lastDopLine.points = lastDopLine.points.slice(0, 2);
          lastDopLine.points = lastDopLine.points.concat([point.x, point.y]);
          setDopLine(dopLine.concat());
        }
      }
    }
  };

  const handleDblClick = () => {
    if (select === "polygon") {
      if (isDrawingPolygon) {
        console.log(1);
        setIsDrawingPolygon(false);
        if (lines[lines.length - 1].points.length === 2) {
          lines[lines.length - 1].points.push(
            lines[0].points[0],
            lines[0].points[1]
          );
        } else {
          setLines([
            ...lines,
            {
              tool,
              points: [
                lines[lines.length - 1].points[2],
                lines[lines.length - 1].points[3],
                lines[0].points[0],
                lines[0].points[1],
              ],
            },
          ]);
        }
      }

      // add point
      setSelect("dot");
      setTutorialStep(2);
    }
  };

  const handleMouseLeave = (e) => {
    let lastDopLine = dopLine[0];
    if (lastDopLine !== undefined) {
      lastDopLine.points = lastDopLine.points.slice(0, 2);
      lastDopLine.points = lastDopLine.points.splice(
        lastDopLine.points.length - 2,
        2
      );
      setDopLine(dopLine.concat());
    }
  };

  function classify(line, point) {
    var pr =
      (line.points[2] - line.points[0]) * (point.Y - line.points[1]) -
      (line.points[3] - line.points[1]) * (point.X - line.points[0]);

    if (pr > 0) return 1;
    if (pr < 0) return -1;
    return 0;
  }

  // классифицируем ребро (Касается, пересекает или безразлично)
  function edgeType(line, point) {
    // eslint-disable-next-line default-case
    switch (classify(line, point)) {
      case 1:
        return line.points[1] < point.Y && point.Y <= line.points[3] ? 1 : 2;
      case -1:
        return line.points[3] < point.Y && point.Y <= line.points[1] ? 1 : 2;
      case 0:
        return 0;
    }
  }

  function pointInPolygon(lines, dot) {
    let parity = 0;
    let dopPoint = [];
    lines.map((line) => {
      switch (edgeType(line, dot)) {
        case 0:
          return 2;
        case 1:
          parity = 1- parity;
          if (line.points[1] < dot.Y) {
            let YDot =
              (dot.Y - line.points[1]) /
              Math.abs(line.points[3] - line.points[1]);
            let Xdot = Math.abs(line.points[0] - line.points[2]) * YDot;

            Xdot =
              line.points[0] > line.points[2]
                ? line.points[0] - Xdot
                : line.points[0] + Xdot;
            console.log(1, " ", Xdot);
            dopPoint.push({ points: [Xdot, dot.Y] });
          } else {
            let YDot =
              (line.points[1] - dot.Y) /
              Math.abs(line.points[3] - line.points[1]);
            let Xdot = Math.abs(line.points[0] - line.points[2]) * YDot;

            Xdot =
              line.points[0] > line.points[2]
                ? line.points[0] - Xdot
                : line.points[0] + Xdot;
            console.log(2, " ", Xdot);
            dopPoint.push({ points: [Xdot, dot.Y] });
          }
          break;
        default:
          break;
      }
    });
    console.log(dopPoint);
    setDopPoint(dopPoint);
    return parity;
  }

  function handleClickButton() {
    setTutorialStep(3);
    setDopPoint([]);
    setRay({ points: [pointDot.X, pointDot.Y, 800, pointDot.Y] });
    var checkP = pointInPolygon(lines, pointDot);
    if (checkP === 0) {
      setResult("Точка лежит вне многоугольника");
    } else if (checkP === 1) {
      setResult("Точка принадлежит многоугольнику");
    } else {
      setResult("Точка лежит на грани многоугольника");
    }
  }

  return (
    <div className="main">
      {/* <label>градусы={gradus}, Тангенс={tangens}</label> */}

      <Stage
        width={700}
        height={700}
        onClick={handleMouseDown}
        onDblClick={handleDblClick}
        onMousemove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
          <Line
            points={ray.points}
            stroke="#3d3d3d"
            strokeWidth={1}
            lineCap="round"
            //closed="true"
            globalCompositeOperation={
              dopLine.tool === "eraser" ? "destination-out" : "source-over"
            }
          />
          <Circle
            x={pointDot.X}
            y={pointDot.Y}
            radius={2}
            fill="blue"
            stroke="blue"
            strokeWidth={1}
          />
          {dopPoint.map((point, i) => (
            <Circle
              key={i}
              x={point.points[0]}
              y={point.points[1]}
              radius={2}
              fill="red"
              stroke="red"
              strokeWidth={1}
            />
          ))}
        </Layer>
      </Stage>
      <div className="main__interface">
        <label className="main__clear">
          Что бы очистить поле нажмите "C"(clear){" "}
        </label>
        <label className="main__tutorial">{tutorial[tutorialStep]}</label>
        <button
          className="main__button"
          disabled={active}
          onClick={handleClickButton}
        >
          Определить
        </button>
        <label className="main__result">{result}</label>
      </div>
    </div>
  );
}
