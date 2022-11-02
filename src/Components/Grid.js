

import React, { useEffect, useState } from "react";

import styled from 'styled-components';
import useKeyPress from "./useKeyPress";

const rows = 26;
const columns = 3;

const getEmptyState = (rows, columns) => {
  let data = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const row = []; 
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      row.push('');
    }
    data.push(row);
  }

  return data;
}

const Grid = () => {

  const [cellsState, setCellsState] = useState(getEmptyState(rows, columns));

  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const rightPress = useKeyPress("ArrowRight");
  const leftPress = useKeyPress("ArrowLeft");

  const [currentCell, setCurrentCell] = useState({
    rowIndex: 0,
    cellIndex: 0
  });
 
  const handleChange = (value, rowIndex, cellIndex) => {

    setCellsState((prev) => {
      const newState = [
        ...prev,
      ]
      newState[rowIndex][cellIndex] = value;
      return newState;
    })
  }

  useEffect(() => {
    if ( downPress && currentCell.rowIndex < rows ) {
      setCurrentCell(prev => {
        return {
          ...prev,
          rowIndex: prev.rowIndex + 1
        }
      })
    }
  }, [downPress]);

  useEffect(() => {
    if (upPress && currentCell.rowIndex > 0) {
      setCurrentCell(prev => {
        return {
          ...prev,
          rowIndex: prev.rowIndex - 1
        }
      })    }
  }, [upPress]);

  useEffect(() => {
    if (rightPress && currentCell.cellIndex < columns) {
      setCurrentCell(prev => {
        return {
          ...prev,
          cellIndex: prev.cellIndex + 1
        }
      })    }
  }, [rightPress]);

  useEffect(() => {
    if (leftPress && currentCell.cellIndex > 0) {
      setCurrentCell(prev => {
        return {
          ...prev,
          cellIndex: prev.cellIndex - 1
        }
      })    }
  }, [leftPress]);

  useEffect(() => {
    const cell = document.getElementById(`cell_${currentCell.rowIndex}_${currentCell.cellIndex}`);
    if (cell) {
      cell.focus();
    }
  }, [currentCell]);

  const downloadFile = () => {
    const string = cellsState.flatMap(cell => cell).reduce((previousValue, currentValue) => previousValue + currentValue, '');
    var link = document.createElement('a');
    link.download = 'data';
    var blob = new Blob([string], {type: 'text/plain'});
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }

  return (
    <>
      <GridContainer>
        {cellsState.map((row, rowIndex) => {
          return (
            <Row key={rowIndex}>
              {row.map((cell, cellIndex) => {
                return <Cell key={cellIndex}>
                  <input id={`cell_${rowIndex}_${cellIndex}`} onFocus={() => setCurrentCell({rowIndex, cellIndex})} type="text" value={cell} onChange={(event) => handleChange(event.target.value, rowIndex, cellIndex)}></input>
                </Cell>
              })}
            </Row>
          )
        })}
      </GridContainer>
      <button onClick={downloadFile}>Download file</button>
    </>
  );
}

export default Grid

const GridContainer = styled.div`
  margin: 32px;
`;

const Row = styled.div`
  height: 50px;
  border: 1px solid black;
  display: flex;
`;

const Cell = styled.div`
  width: 200px;
`;