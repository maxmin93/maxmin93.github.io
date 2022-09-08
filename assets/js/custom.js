/*
  custom.js
  ================

  - js for 404.html
*/

// top module of custom js
let customScripts = {
  // page404 module
  customPage404: function () {
    console.log("load custom scripts: 'customPage404'");

    // global variables
    let doc_width = document.documentElement.clientWidth;
    let doc_height = document.documentElement.clientHeight;

    window.addEventListener('resize', debounce(
      function (e) {
        // Get width and height of the window excluding scrollbars
        doc_width = document.documentElement.clientWidth;
        doc_height = document.documentElement.clientHeight;
        // console.log('resized:', doc_width, doc_height);
      }, 
      300
    ));

    // debounce(logMousePosition, 300)
    function debounce(callback, interval) {
      let debounceTimeoutId;

      return function (...args) {
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval);
      };
    }

    document.body.addEventListener('mousemove', logMouseMoved);

    // https://codepen.io/diogo_ml_gomes/pen/PyWdLb
    function logMouseMoved(e) { 
      // query element for logging
      const loggingEl = document.querySelector('#logging-div');
      if (loggingEl) {
        // console.log('mouse-position:', e.clientX, e.clientY);
        loggingEl.innerHTML = `X: ${doc_width}/${e.pageX}, Y: ${doc_height}/${e.pageY}`;    
      }

      //verticalAxis
      mouseY = event.pageY;
      yAxis = (doc_height / 2 - mouseY) / doc_height * 300; 
      //horizontalAxis
      mouseX = event.pageX / -doc_width;
      xAxis = -mouseX * 100 - 100;

      ele = document.querySelector('.box__ghost-eyes');
      if (ele != null) {
        // console.log('==> X:', xAxis, ', Y:', -yAxis);    
        ele.style.transform = `translate(${xAxis}%,-${yAxis}%)`;
      }
    }

    // throttle(logMouseMoved, 300)
    function throttle(callback, interval) {
      let enableCall = true;

      return function (...args) {
        if (!enableCall) return;

        enableCall = false;
        callback.apply(this, args);
        setTimeout(() => enableCall = true, interval);
      }
    }
  },
};
// registry module to window
window.customScripts = customScripts;
