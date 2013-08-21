### Overview

This tool allows users to divide integers by other integers, by allowing them to set up a number of 'pie-sources' and a number of 'pie-holes', split each of the sources into the same number of pieces as the number of holes, then drag the pieces into the holes until they are all even.


### Initialising

When the tool is first run, it sets up a number of sources and holes, as well as buttons for controlling the tool and a settings layer, with the settings being the divisor, dividend, and whether or not the pies are prefilled.


### Pie pieces

When the pies are split into n pieces, the background piece of the pie is removed and replaced by n pie pieces. Each of these has a canvas clipping node that masks all but a 1/n sector of the pie. The full circle background is added to this, so you only see a sector of the pie. Clicking on the pie detects which section you are clicking on, and if there is a pie piece there it is hidden and a moving pie piece is added to the main layer. If that pie piece is dropped into a pie the original piece is removed and a new pie piece is placed in the new pie. The pie pieces can be dragged from and to pie holes and pie sources. If dropping a pie piece into a full pie hole overfills the hole, a small pie is displayed outside the hole to indicate this. You cannot overfill a pie source.


### Dragging on pie pieces/sources

When the pies are not prefilled, the user adds sources and holes by dragging them in from buttons. The buttons work by having a dummy button sprite visible, and a scaled down source/hole draggable invisible on top of it. When the user presses the invisble draggable it becomes visible and enlarges. When the user drags it into the main area, it sets the pie sources node invisible and sets another node that has an extra pie source visible. When the user drops it, it recreates the entire area.


### Representing the tool's state

The state of the tool is the dividend and divisor. Each of the pies knows how many pieces it has, including how many whole pies, so can report whether the division is correct or not (at the moment the pie sources flash green when this has happened).