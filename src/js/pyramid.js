// pyramids
// n*n | n-1*n-1 | n-2 * n-2 | ...
// filled pyramid made of primitives
// each layer is n*n where layer++ => n--;
// margin needs to be 2 to not make it lopsided.
// as you cannot place a 3*3 on a 4*4 without overlap
// you could make the 'jump' on n be -2 and margin 1

var sliceArr = []; // if (i+1) slice (i, i+1) else slice to count
var numBoxesUsedInPyramid,
    leftOverBoxes,
    pyramidCurrentN,
    pyramidPosition,
    pyramidSliceStart,
    pyramidSliceEnd,
    pyramidIterator = 0; // boxes to use in Pyramid
var calculatePyramid = function(n, base, count) {
  var count = count || 1;
  var base = base || 2;
  if (count === n) {
    numBoxesUsedInPyramid = count;
    leftOverBoxes = n - count;
    sliceArr.push(count);
    return base-1;
  } else if (count > n) {
    return base - 2;
  } else {
    numBoxesUsedInPyramid = count;
    leftOverBoxes = n - count;
    sliceArr.push(count);
    return calculatePyramid(n, base + 1, count + base*base);
  }
};
calculatePyramid(len);
sliceArr = sliceArr.reverse();
var pyramidPositionX = -10;
var pyramidPositionY = 1;
var pyramidPositionZ = -20;

// NOTE: could pass 'leftOverBoxes' into a separate thread of calculatePyramid and render a mini-pyramid next to the main pyramid etc...

var determineNforPyramid = function() {
  pyramidSliceStart = numBoxesUsedInPyramid - sliceArr[pyramidIterator];
  if (sliceArr[pyramidIterator+1]) {
    pyramidSliceEnd = numBoxesUsedInPyramid - sliceArr[pyramidIterator+1];
  } else {
    pyramidSliceEnd = numBoxesUsedInPyramid; // so we don't get NaN
  }
  pyramidIterator++;
  pyramidCurrentN = Math.sqrt(pyramidSliceEnd - pyramidSliceStart);
};

var changePositionForPyramid = function() {
  pyramidPositionX +=1;
  pyramidPositionY +=1;
  pyramidPositionZ +=1;

  pyramidPosition = `${pyramidPositionX} ${pyramidPositionY} ${pyramidPositionZ}`
};

{/* container for pyramid of boxes! */}
{sliceArr.map(function(i) {
  determineNforPyramid();
  changePositionForPyramid();
    return <Entity layout={{type: 'box', margin: '2', columns: `${pyramidCurrentN}`}} position={pyramidPosition} rotation="90 0 0">

    {data.slice(pyramidSliceStart, pyramidSliceEnd).map(function(person) {
      return <Entity key={person.id}
        geometry="primitive: box"
        material={{src: `url(${person.image})`, color: that.state.color}}
        onClick={that.changeColor} >
      </Entity>
    })}
  </Entity>
})}
