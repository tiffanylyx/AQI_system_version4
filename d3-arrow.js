!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):(t=t||self,n(t.d3=t.d3||{}))}(this,function(t){"use strict";function n(t,n){for(var r=Object.keys(t),c=r.length,e=0;e<c;e++){var o=r[e];n.attr(o,t[o])}}function r(t,r,c,e,o,a,u){var i=t.select("defs");i.empty()&&(i=t.append("defs")),n(r,i.append("marker").attr("id",c).attr("refX",o*e).attr("refY",a*e).attr("markerWidth",o+2*e).attr("markerHeight",2*a*e).attr("markerUnits","userSpaceOnUse").attr("orient","auto-start-reverse").append("path").attr("d",u))}function c(){function t(t){r(t,n,c,e,15,8,"M 1 1 Q ".concat(7*e," ").concat(5*e," ").concat(16*e," ").concat(8*e," Q ").concat(7*e," ").concat(11*e," 1 ").concat(15*e," L ").concat(4*e," ").concat(8*e," Z"))}var n={fill:"black",stroke:"black"},c="d3-arrow-1",e=1;return t.id=function(n){return arguments.length?(c=n,t):c},t.scale=function(n){return arguments.length?(e=n,t):e},t.attr=function(r,c){return 2===arguments.length?(n[r]=c,t):n[r]},t}function e(){function t(t){r(t,n,c,e,17,7.5,"M 1 1 L ".concat(18*e," ").concat(7.5*e," L 1 ").concat(14*e," L ").concat(5*e," ").concat(7.5*e," z"))}var n={fill:"black",stroke:"black"},c="d3-arrow-2",e=1;return t.id=function(n){return arguments.length?(c=n,t):c},t.scale=function(n){return arguments.length?(e=n,t):e},t.attr=function(r,c){return 2===arguments.length?(n[r]=c,t):n[r]},t}function o(){function t(t){r(t,n,c,e,21,7,"M 1 1 Q ".concat(9*e," ").concat(5*e," ").concat(22*e," ").concat(7*e," Q ").concat(9*e," ").concat(9*e," 1 ").concat(13*e," L ").concat(4*e," ").concat(7*e," Z"))}var n={fill:"black",stroke:"black"},c="d3-arrow-3",e=1;return t.id=function(n){return arguments.length?(c=n,t):c},t.scale=function(n){return arguments.length?(e=n,t):e},t.attr=function(r,c){return 2===arguments.length?(n[r]=c,t):n[r]},t}function a(){function t(t){r(t,n,c,e,14,7,"M 1 1 L ".concat(15*e," ").concat(7*e," L 1 ").concat(13*e," L ").concat(3*e," ").concat(7*e," z"))}var n={fill:"black",stroke:"black"},c="d3-arrow-5",e=1;return t.id=function(n){return arguments.length?(c=n,t):c},t.scale=function(n){return arguments.length?(e=n,t):e},t.attr=function(r,c){return 2===arguments.length?(n[r]=c,t):n[r]},t}function u(){function t(t){r(t,n,c,e,5,4.5,"M 1 1 L ".concat(5*e," ").concat(4.5*e," L 1 ").concat(8*e))}var n={fill:"none",stroke:"black","stroke-width":1},c="d3-arrow-10",e=1;return t.id=function(n){return arguments.length?(c=n,t):c},t.scale=function(n){return arguments.length?(e=n,t):e},t.attr=function(r,c){return 2===arguments.length?(n[r]=c,t):n[r]},t}function i(){function t(t){r(t,n,c,e,8,8,"M 1 1 L ".concat(8*e," ").concat(8*e," L 1 ").concat(15*e))}var n={fill:"none",stroke:"black","stroke-width":1},c="d3-arrow-11",e=1;return t.id=function(n){return arguments.length?(c=n,t):c},t.scale=function(n){return arguments.length?(e=n,t):e},t.attr=function(r,c){return 2===arguments.length?(n[r]=c,t):n[r]},t}function f(){function t(t){r(t,n,c,e,13,10,"M 1 1 L ".concat(13*e," ").concat(10*e," L 1 ").concat(19*e))}var n={fill:"none",stroke:"black","stroke-width":1},c="d3-arrow-13",e=1;return t.id=function(n){return arguments.length?(c=n,t):c},t.scale=function(n){return arguments.length?(e=n,t):e},t.attr=function(r,c){return 2===arguments.length?(n[r]=c,t):n[r]},t}t.arrow1=c,t.arrow10=u,t.arrow11=i,t.arrow13=f,t.arrow2=e,t.arrow3=o,t.arrow5=a,Object.defineProperty(t,"__esModule",{value:!0})});
