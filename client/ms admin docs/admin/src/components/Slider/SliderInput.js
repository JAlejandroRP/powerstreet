import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { getValue } from '@mui/system';

function valuetext(value) {
  // console.log(value);
  return `${value}`;
}

export default function SliderInput({ setHistory, marks }) {
  const [val, setVal] = React.useState(1)
  // setHistory('asf')
  // console.log(marks);

  const max = marks ? marks.length : 0

  return (
    <Box sx={{ width: '100%' }}>
      <Slider
        key={1}
        aria-label="Temperature"
        value={val}
        // defaultValue={max}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={1}
        max={max - 1}
        min={0}
        // marks={marks || []}
        onChange={(event, newvalue) => {
          setHistory(newvalue)
          setVal(newvalue)
        }}
      />
    </Box>
  );
}